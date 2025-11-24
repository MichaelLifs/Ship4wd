import pool from "../../db/database.js";
import { loadQuery } from "../queries/queryLoader.js";
import {
  Expense,
  CreateExpenseData,
  UpdateExpenseData,
  ExpensePublicFields,
} from "../types/expense.types.js";

class ExpenseRepository {
  async findAll(): Promise<ExpensePublicFields[]> {
    const queryText = loadQuery("findAllExpenses");
    const result = await pool.query<ExpensePublicFields>(queryText, []);
    return result.rows;
  }

  async findByShopId(shopId: number): Promise<ExpensePublicFields[]> {
    const queryText = loadQuery("findExpensesByShopId");
    const result = await pool.query<ExpensePublicFields>(queryText, [shopId]);
    return result.rows;
  }

  async findById(id: number): Promise<ExpensePublicFields | undefined> {
    const queryText = loadQuery("findExpenseById");
    const result = await pool.query<ExpensePublicFields>(queryText, [id]);
    return result.rows[0];
  }

  async create(expenseData: CreateExpenseData): Promise<ExpensePublicFields> {
    const { shop_id, amount, expense_date } = expenseData;
    const queryText = loadQuery("createExpense");
    const result = await pool.query<ExpensePublicFields>(queryText, [
      shop_id,
      amount,
      expense_date,
    ]);
    return result.rows[0];
  }

  async update(
    id: number,
    updateData: UpdateExpenseData
  ): Promise<ExpensePublicFields> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (updateData.amount !== undefined) {
      fields.push(`amount = $${paramIndex++}`);
      values.push(updateData.amount);
    }
    if (updateData.expense_date !== undefined) {
      fields.push(`expense_date = $${paramIndex++}`);
      values.push(updateData.expense_date);
    }

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    values.push(id);

    const baseQuery = loadQuery("updateExpense");
    const queryText = baseQuery
      .replace("{FIELDS}", fields.join(", "))
      .replace("{ID_PARAM}", `$${paramIndex}`);

    const result = await pool.query<ExpensePublicFields>(queryText, values);
    return result.rows[0];
  }

  async softDelete(id: number): Promise<ExpensePublicFields> {
    const queryText = loadQuery("deleteExpense");
    const result = await pool.query<ExpensePublicFields>(queryText, [id]);
    return result.rows[0];
  }
}

export default new ExpenseRepository();

