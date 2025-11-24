import expenseRepository from "../repositories/expenseRepository.js";
import {
  formatExpense,
  formatExpenses,
  extractUpdateableFields,
  validateRequiredFields,
} from "../models/expenseModel.js";
import {
  CreateExpenseData,
  UpdateExpenseData,
  ExpensePublicFields,
} from "../types/expense.types.js";

class ExpenseService {
  async getAllExpenses(): Promise<ExpensePublicFields[]> {
    const expenses = await expenseRepository.findAll();
    return formatExpenses(expenses);
  }

  async getExpensesByShopId(shopId: number): Promise<ExpensePublicFields[]> {
    const expenses = await expenseRepository.findByShopId(shopId);
    return formatExpenses(expenses);
  }

  async getExpenseById(id: number): Promise<ExpensePublicFields | null> {
    const expense = await expenseRepository.findById(id);
    return formatExpense(expense || null);
  }

  async createExpense(
    expenseData: CreateExpenseData
  ): Promise<ExpensePublicFields> {
    const validation = validateRequiredFields(expenseData);
    if (!validation.valid) {
      throw new Error(
        `Missing required fields: ${validation.missingFields.join(", ")}`
      );
    }

    const createdExpense = await expenseRepository.create(expenseData);
    return formatExpense(createdExpense) || createdExpense;
  }

  async updateExpense(
    id: number,
    updateData: UpdateExpenseData
  ): Promise<ExpensePublicFields | null> {
    const allowedUpdateData = extractUpdateableFields(updateData);

    await expenseRepository.update(id, allowedUpdateData);
    const expense = await expenseRepository.findById(id);
    return formatExpense(expense || null);
  }

  async deleteExpense(id: number): Promise<ExpensePublicFields | null> {
    const expense = await expenseRepository.softDelete(id);
    return formatExpense(expense) || expense;
  }
}

export default new ExpenseService();

