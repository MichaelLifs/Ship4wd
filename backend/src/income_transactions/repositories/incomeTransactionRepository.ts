import pool from "../../db/database.js";
import { loadQuery } from "../queries/queryLoader.js";
import {
  IncomeTransaction,
  CreateIncomeTransactionData,
  UpdateIncomeTransactionData,
  IncomeTransactionPublicFields,
} from "../types/incomeTransaction.types.js";

class IncomeTransactionRepository {
  async findAll(): Promise<IncomeTransactionPublicFields[]> {
    const queryText = loadQuery("findAllIncomeTransactions");
    const result = await pool.query<IncomeTransactionPublicFields>(queryText, []);
    return result.rows;
  }

  async findByShopId(
    shopId: number
  ): Promise<IncomeTransactionPublicFields[]> {
    const queryText = loadQuery("findIncomeTransactionsByShopId");
    const result = await pool.query<IncomeTransactionPublicFields>(queryText, [
      shopId,
    ]);
    return result.rows;
  }

  async findById(
    id: number
  ): Promise<IncomeTransactionPublicFields | undefined> {
    const queryText = loadQuery("findIncomeTransactionById");
    const result = await pool.query<IncomeTransactionPublicFields>(queryText, [
      id,
    ]);
    return result.rows[0];
  }

  async create(
    transactionData: CreateIncomeTransactionData
  ): Promise<IncomeTransactionPublicFields> {
    const { shop_id, customer_name, amount, transaction_date } =
      transactionData;
    const queryText = loadQuery("createIncomeTransaction");
    const result = await pool.query<IncomeTransactionPublicFields>(queryText, [
      shop_id,
      customer_name,
      amount,
      transaction_date,
    ]);
    return result.rows[0];
  }

  async update(
    id: number,
    updateData: UpdateIncomeTransactionData
  ): Promise<IncomeTransactionPublicFields> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (updateData.customer_name !== undefined) {
      fields.push(`customer_name = $${paramIndex++}`);
      values.push(updateData.customer_name);
    }
    if (updateData.amount !== undefined) {
      fields.push(`amount = $${paramIndex++}`);
      values.push(updateData.amount);
    }
    if (updateData.transaction_date !== undefined) {
      fields.push(`transaction_date = $${paramIndex++}`);
      values.push(updateData.transaction_date);
    }

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    values.push(id);

    const baseQuery = loadQuery("updateIncomeTransaction");
    const queryText = baseQuery
      .replace("{FIELDS}", fields.join(", "))
      .replace("{ID_PARAM}", `$${paramIndex}`);

    const result = await pool.query<IncomeTransactionPublicFields>(
      queryText,
      values
    );
    return result.rows[0];
  }

  async softDelete(id: number): Promise<IncomeTransactionPublicFields> {
    const queryText = loadQuery("deleteIncomeTransaction");
    const result = await pool.query<IncomeTransactionPublicFields>(queryText, [
      id,
    ]);
    return result.rows[0];
  }
}

export default new IncomeTransactionRepository();

