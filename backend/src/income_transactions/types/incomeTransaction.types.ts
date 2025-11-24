export interface IncomeTransaction {
  id: number;
  shop_id: number;
  customer_name: string;
  amount: number;
  transaction_date: Date;
  deleted: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateIncomeTransactionData {
  shop_id: number;
  customer_name: string;
  amount: number;
  transaction_date: string; // ISO date string
}

export interface UpdateIncomeTransactionData {
  customer_name?: string;
  amount?: number;
  transaction_date?: string; // ISO date string
}

export interface IncomeTransactionPublicFields {
  id: number;
  shop_id: number;
  customer_name: string;
  amount: number;
  transaction_date: Date;
  deleted: boolean;
  created_at: Date;
  updated_at: Date;
}

