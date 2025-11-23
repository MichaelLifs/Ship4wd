import userRepository from "../repositories/userRepository.js";
import {
  formatUser,
  formatUsers,
  extractUpdateableFields,
  validateRequiredFields,
} from "../models/userModel.js";
import {
  CreateUserData,
  UpdateUserData,
  LoginData,
  UserPublicFields,
} from "../types/user.types.js";
import bcrypt from "bcrypt";

class UserService {
  async getAllUsers(): Promise<UserPublicFields[]> {
    const users = await userRepository.findAll();
    return formatUsers(users);
  }

  async getUserById(id: number): Promise<UserPublicFields | null> {
    const user = await userRepository.findById(id);
    return formatUser(user || null);
  }

  async createUser(userData: CreateUserData): Promise<UserPublicFields> {
    const validation = validateRequiredFields(userData);
    if (!validation.valid) {
      throw new Error(
        `Missing required fields: ${validation.missingFields.join(", ")}`
      );
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const userBody: CreateUserData = {
      ...userData,
      password: hashedPassword,
    };

    const user = await userRepository.create(userBody);
    return formatUser(user) || user;
  }

  async updateUser(
    id: number,
    updateData: UpdateUserData
  ): Promise<UserPublicFields | null> {
    const allowedUpdateData = extractUpdateableFields(updateData);

    if (allowedUpdateData.password) {
      allowedUpdateData.password = await bcrypt.hash(
        allowedUpdateData.password,
        10
      );
    }

    const user = await userRepository.update(id, allowedUpdateData);
    return formatUser(user) || user;
  }

  async deleteUser(id: number): Promise<UserPublicFields | null> {
    const user = await userRepository.softDelete(id);
    return formatUser(user) || user;
  }

  async login(loginData: LoginData): Promise<UserPublicFields | null> {
    const { email, password } = loginData;

    const user = await userRepository.findByEmail(email);

    if (!user) {
      return null;
    }

    if (!user.password) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    return formatUser(user);
  }

  async getUsersByRole(role: string): Promise<UserPublicFields[]> {
    const users = await userRepository.findByRole(role);
    return formatUsers(users);
  }
}

export default new UserService();
