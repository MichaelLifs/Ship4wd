const API_URL = process.env.API_URL || "http://localhost:4000/api";

interface ShopManager {
  name: string;
  last_name: string;
  email: string;
}

interface User {
  id: number;
  name: string;
  last_name: string;
  email: string;
  role: string | null;
}

interface Shop {
  id: number;
  shop_name: string;
}

interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

// 10 מנהלי חנות עם role: shop
const shopManagers: ShopManager[] = [
  { name: "Rami", last_name: "Shalev", email: "rami.shalev@example.com" },
  { name: "Keren", last_name: "Mor", email: "keren.mor@example.com" },
  { name: "Ofer", last_name: "Dayan", email: "ofer.dayan@example.com" },
  { name: "Yaara", last_name: "Golan", email: "yaara.golan@example.com" },
  { name: "Eyal", last_name: "Tsur", email: "eyal.tsur@example.com" },
  { name: "Dana", last_name: "Peretz", email: "dana.peretz@example.com" },
  { name: "Haim", last_name: "Barkat", email: "haim.barkat@example.com" },
  { name: "Shelly", last_name: "Ramon", email: "shelly.ramon@example.com" },
  { name: "Omer", last_name: "Bashan", email: "omer.bashan@example.com" },
  { name: "Michal", last_name: "Tal", email: "michal.tal@example.com" },
];

async function getAllUsers(): Promise<User[]> {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data: ApiResponse<User[]> = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || "Failed to fetch users");
    }

    return data.data || [];
  } catch (error) {
    throw error;
  }
}

async function getAllShops(): Promise<Shop[]> {
  try {
    const response = await fetch(`${API_URL}/shops`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data: ApiResponse<Shop[]> = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || "Failed to fetch shops");
    }

    return data.data || [];
  } catch (error) {
    throw error;
  }
}

async function getShopById(shopId: number): Promise<Shop> {
  try {
    const response = await fetch(`${API_URL}/shops/${shopId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data: ApiResponse<Shop> = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || "Failed to fetch shop");
    }

    if (!data.data) {
      throw new Error("Shop data not found");
    }

    return data.data;
  } catch (error) {
    throw error;
  }
}

async function updateShopManagers(
  shopId: number,
  userIds: number[]
): Promise<ApiResponse<Shop>> {
  try {
    const response = await fetch(`${API_URL}/shops/${shopId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userIds,
      }),
    });

    const data: ApiResponse<Shop> = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || "Failed to update shop");
    }

    return data;
  } catch (error) {
    throw error;
  }
}

async function assignShopsToManagers(): Promise<void> {
  console.log("Fetching shops and managers...\n");

  const [allShops, allUsers] = await Promise.all([
    getAllShops(),
    getAllUsers(),
  ]);

  console.log(`Found ${allShops.length} shops in the system.`);
  console.log(`Found ${allUsers.length} users in the system.\n`);

  // Create a map of email to user for quick lookup
  const userMap = new Map<string, User>();
  allUsers.forEach((user) => {
    if (user.role && user.role.toLowerCase() === "shop") {
      userMap.set(user.email.toLowerCase(), user);
    }
  });

  // Get shop managers by email
  const managers = shopManagers.map((manager) => {
    const user = userMap.get(manager.email.toLowerCase());
    if (!user) {
      throw new Error(`Manager not found: ${manager.email}`);
    }
    return user;
  });

  console.log(`Found ${managers.length} shop managers.\n`);

  // Sort shops by ID to ensure consistent assignment
  const shops = allShops.sort((a, b) => a.id - b.id);
  const shopIds = shops.map((s) => s.id);

  console.log("Shops:", shops.map((s) => `${s.id}: ${s.shop_name}`).join(", "));
  console.log("\nAssigning shops to managers...\n");

  // Create a map to track which managers are assigned to which shops
  const shopManagersMap = new Map<number, number[]>();
  shops.forEach((shop) => {
    shopManagersMap.set(shop.id, []);
  });

  // Manager 1: 5 shops (all shops)
  console.log(
    `Manager 1 (${managers[0].name} ${managers[0].last_name}): 5 shops`
  );
  for (let i = 0; i < 5 && i < shopIds.length; i++) {
    const currentManagers = shopManagersMap.get(shopIds[i]) || [];
    if (!currentManagers.includes(managers[0].id)) {
      currentManagers.push(managers[0].id);
      shopManagersMap.set(shopIds[i], currentManagers);
    }
    console.log(`  ✓ Will add to shop ${shopIds[i]}: ${shops[i].shop_name}`);
  }

  // Manager 2: 4 shops (first 4)
  console.log(
    `\nManager 2 (${managers[1].name} ${managers[1].last_name}): 4 shops`
  );
  for (let i = 0; i < 4 && i < shopIds.length; i++) {
    const currentManagers = shopManagersMap.get(shopIds[i]) || [];
    if (!currentManagers.includes(managers[1].id)) {
      currentManagers.push(managers[1].id);
      shopManagersMap.set(shopIds[i], currentManagers);
    }
    console.log(`  ✓ Will add to shop ${shopIds[i]}: ${shops[i].shop_name}`);
  }

  // Managers 3-5: 3 shops each
  const threeShopAssignments: number[][] = [
    [0, 1, 2], // Manager 3: shops 1, 2, 3
    [1, 2, 3], // Manager 4: shops 2, 3, 4
    [2, 3, 4], // Manager 5: shops 3, 4, 5
  ];

  for (let m = 0; m < 3; m++) {
    const managerIndex = 2 + m; // managers[2], managers[3], managers[4]
    console.log(
      `\nManager ${managerIndex + 1} (${managers[managerIndex].name} ${
        managers[managerIndex].last_name
      }): 3 shops`
    );
    for (const shopIndex of threeShopAssignments[m]) {
      if (shopIndex < shopIds.length) {
        const currentManagers = shopManagersMap.get(shopIds[shopIndex]) || [];
        if (!currentManagers.includes(managers[managerIndex].id)) {
          currentManagers.push(managers[managerIndex].id);
          shopManagersMap.set(shopIds[shopIndex], currentManagers);
        }
        console.log(
          `  ✓ Will add to shop ${shopIds[shopIndex]}: ${shops[shopIndex].shop_name}`
        );
      }
    }
  }

  // Managers 6-10: 1 shop each (remaining 5 managers)
  console.log(`\nManagers 6-10: 1 shop each`);
  for (let m = 0; m < 5; m++) {
    const managerIndex = 5 + m; // managers[5] to managers[9]
    const shopIndex = m; // shops 0 to 4
    if (shopIndex < shopIds.length) {
      const currentManagers = shopManagersMap.get(shopIds[shopIndex]) || [];
      if (!currentManagers.includes(managers[managerIndex].id)) {
        currentManagers.push(managers[managerIndex].id);
        shopManagersMap.set(shopIds[shopIndex], currentManagers);
      }
      console.log(
        `  Manager ${managerIndex + 1} (${managers[managerIndex].name} ${
          managers[managerIndex].last_name
        }): shop ${shopIds[shopIndex]} (${shops[shopIndex].shop_name})`
      );
    }
  }

  // Now update all shops with their managers
  console.log("\n\nUpdating shops with managers...\n");
  for (const [shopId, managerIds] of shopManagersMap.entries()) {
    try {
      await updateShopManagers(shopId, managerIds);
      const shop = shops.find((s) => s.id === shopId);
      console.log(
        `✓ Updated shop ${shopId} (${shop?.shop_name}): ${managerIds.length} manager(s)`
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error(`✗ Failed to update shop ${shopId}: ${errorMessage}`);
    }
  }

  console.log("\n✅ Finished assigning shops to managers!");
}

// Run the script
assignShopsToManagers().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
