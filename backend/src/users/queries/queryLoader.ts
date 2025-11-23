import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const loadQuery = (queryName: string): string => {
  try {
    const queryPath = join(__dirname, `${queryName}.hsb`);
    const query = readFileSync(queryPath, "utf-8");
    return query.trim();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to load query ${queryName}: ${errorMessage}`);
  }
};
