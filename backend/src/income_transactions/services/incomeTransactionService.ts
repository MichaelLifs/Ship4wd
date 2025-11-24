import incomeTransactionRepository from "../repositories/incomeTransactionRepository.js";
import {
  formatIncomeTransaction,
  formatIncomeTransactions,
  extractUpdateableFields,
  validateRequiredFields,
} from "../models/incomeTransactionModel.js";
import {
  CreateIncomeTransactionData,
  UpdateIncomeTransactionData,
  IncomeTransactionPublicFields,
} from "../types/incomeTransaction.types.js";

class IncomeTransactionService {
  async getAllIncomeTransactions(): Promise<IncomeTransactionPublicFields[]> {
    const transactions = await incomeTransactionRepository.findAll();
    return formatIncomeTransactions(transactions);
  }

  async getIncomeTransactionsByShopId(
    shopId: number
  ): Promise<IncomeTransactionPublicFields[]> {
    const transactions = await incomeTransactionRepository.findByShopId(
      shopId
    );
    return formatIncomeTransactions(transactions);
  }

  async getIncomeTransactionById(
    id: number
  ): Promise<IncomeTransactionPublicFields | null> {
    const transaction = await incomeTransactionRepository.findById(id);
    return formatIncomeTransaction(transaction || null);
  }

  async createIncomeTransaction(
    transactionData: CreateIncomeTransactionData
  ): Promise<IncomeTransactionPublicFields> {
    const validation = validateRequiredFields(transactionData);
    if (!validation.valid) {
      throw new Error(
        `Missing required fields: ${validation.missingFields.join(", ")}`
      );
    }

    const createdTransaction =
      await incomeTransactionRepository.create(transactionData);
    return (
      formatIncomeTransaction(createdTransaction) || createdTransaction
    );
  }

  async updateIncomeTransaction(
    id: number,
    updateData: UpdateIncomeTransactionData
  ): Promise<IncomeTransactionPublicFields | null> {
    const allowedUpdateData = extractUpdateableFields(updateData);

    await incomeTransactionRepository.update(id, allowedUpdateData);
    const transaction = await incomeTransactionRepository.findById(id);
    return formatIncomeTransaction(transaction || null);
  }

  async deleteIncomeTransaction(
    id: number
  ): Promise<IncomeTransactionPublicFields | null> {
    const transaction = await incomeTransactionRepository.softDelete(id);
    return formatIncomeTransaction(transaction) || transaction;
  }
}

export default new IncomeTransactionService();

