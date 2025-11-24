import {
  IncomeTransaction,
  CreateIncomeTransactionData,
  UpdateIncomeTransactionData,
  IncomeTransactionPublicFields,
} from "../types/incomeTransaction.types.js";

export const INCOME_TRANSACTION_PUBLIC_FIELDS = [
  "id",
  "shop_id",
  "customer_name",
  "amount",
  "transaction_date",
  "deleted",
  "created_at",
  "updated_at",
] as const;

export const INCOME_TRANSACTION_REQUIRED_FIELDS = [
  "shop_id",
  "customer_name",
  "amount",
  "transaction_date",
] as const;

export const INCOME_TRANSACTION_UPDATEABLE_FIELDS = [
  "customer_name",
  "amount",
  "transaction_date",
] as const;

export const sanitizeIncomeTransaction = (
  transaction: IncomeTransaction | null
): IncomeTransactionPublicFields | null => {
  if (!transaction) return null;
  return transaction;
};

export const formatIncomeTransaction = (
  transaction: IncomeTransaction | null
): IncomeTransactionPublicFields | null => {
  if (!transaction) return null;

  return {
    id: transaction.id,
    shop_id: transaction.shop_id,
    customer_name: transaction.customer_name,
    amount: transaction.amount,
    transaction_date: transaction.transaction_date,
    deleted: transaction.deleted || false,
    created_at: transaction.created_at,
    updated_at: transaction.updated_at,
  };
};

export const formatIncomeTransactions = (
  transactions: IncomeTransaction[]
): IncomeTransactionPublicFields[] => {
  if (!Array.isArray(transactions)) return [];
  return transactions
    .map(formatIncomeTransaction)
    .filter(
      (transaction): transaction is IncomeTransactionPublicFields =>
        transaction !== null
    );
};

export const extractUpdateableFields = (
  data: UpdateIncomeTransactionData
): UpdateIncomeTransactionData => {
  const updateData: UpdateIncomeTransactionData = {};

  (
    INCOME_TRANSACTION_UPDATEABLE_FIELDS as readonly (
      | keyof UpdateIncomeTransactionData
    )[]
  ).forEach((field) => {
    if (data[field] !== undefined) {
      (updateData as any)[field] = data[field];
    }
  });

  return updateData;
};

export const getPublicFieldsSQL = (): string => {
  return INCOME_TRANSACTION_PUBLIC_FIELDS.join(", ");
};

export const validateRequiredFields = (
  data: Partial<CreateIncomeTransactionData>
): { valid: boolean; missingFields: string[] } => {
  const missingFields = INCOME_TRANSACTION_REQUIRED_FIELDS.filter(
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

export const INCOME_TRANSACTION_MODEL_STRUCTURE = {
  id: "number (auto-increment)",
  shop_id: "number (required, foreign key to shops)",
  customer_name: "string (max 255, required)",
  amount: "decimal(15,2) (required)",
  transaction_date: "date (required)",
  deleted: "boolean (default: false)",
  created_at: "timestamp (auto)",
  updated_at: "timestamp (auto)",
} as const;

