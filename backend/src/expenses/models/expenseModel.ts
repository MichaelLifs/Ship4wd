import {
  Expense,
  CreateExpenseData,
  UpdateExpenseData,
  ExpensePublicFields,
} from "../types/expense.types.js";

export const EXPENSE_PUBLIC_FIELDS = [
  "id",
  "shop_id",
  "amount",
  "expense_date",
  "deleted",
  "created_at",
  "updated_at",
] as const;

export const EXPENSE_REQUIRED_FIELDS = [
  "shop_id",
  "amount",
  "expense_date",
] as const;

export const EXPENSE_UPDATEABLE_FIELDS = ["amount", "expense_date"] as const;

export const sanitizeExpense = (
  expense: Expense | null
): ExpensePublicFields | null => {
  if (!expense) return null;
  return expense;
};

export const formatExpense = (
  expense: Expense | null
): ExpensePublicFields | null => {
  if (!expense) return null;

  return {
    id: expense.id,
    shop_id: expense.shop_id,
    amount: expense.amount,
    expense_date: expense.expense_date,
    deleted: expense.deleted || false,
    created_at: expense.created_at,
    updated_at: expense.updated_at,
  };
};

export const formatExpenses = (
  expenses: Expense[]
): ExpensePublicFields[] => {
  if (!Array.isArray(expenses)) return [];
  return expenses
    .map(formatExpense)
    .filter((expense): expense is ExpensePublicFields => expense !== null);
};

export const extractUpdateableFields = (
  data: UpdateExpenseData
): UpdateExpenseData => {
  const updateData: UpdateExpenseData = {};

  (EXPENSE_UPDATEABLE_FIELDS as readonly (keyof UpdateExpenseData)[]).forEach(
    (field) => {
      if (data[field] !== undefined) {
        (updateData as any)[field] = data[field];
      }
    }
  );

  return updateData;
};

export const getPublicFieldsSQL = (): string => {
  return EXPENSE_PUBLIC_FIELDS.join(", ");
};

export const validateRequiredFields = (
  data: Partial<CreateExpenseData>
): { valid: boolean; missingFields: string[] } => {
  const missingFields = EXPENSE_REQUIRED_FIELDS.filter(
    (field) =>
      !data[field] ||
      (typeof data[field] === "string" && data[field].trim() === "") ||
      (typeof data[field] === "number" && isNaN(data[field]))
  );

  return {
    valid: missingFields.length === 0,
    missingFields: [...missingFields],
  };
};

export const EXPENSE_MODEL_STRUCTURE = {
  id: "number (auto-increment)",
  shop_id: "number (required, foreign key to shops)",
  amount: "decimal(15,2) (required)",
  expense_date: "date (required)",
  deleted: "boolean (default: false)",
  created_at: "timestamp (auto)",
  updated_at: "timestamp (auto)",
} as const;

