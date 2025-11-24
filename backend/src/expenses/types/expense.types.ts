export interface Expense {
  id: number;
  shop_id: number;
  amount: number;
  expense_date: Date;
  deleted: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateExpenseData {
  shop_id: number;
  amount: number;
  expense_date: string; // ISO date string
}

export interface UpdateExpenseData {
  amount?: number;
  expense_date?: string; // ISO date string
}

export interface ExpensePublicFields {
  id: number;
  shop_id: number;
  amount: number;
  expense_date: Date;
  deleted: boolean;
  created_at: Date;
  updated_at: Date;
}
