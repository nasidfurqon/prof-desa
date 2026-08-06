import bcrypt from "bcrypt";
import { userRepository, ListParams } from "../repositories/user.repository";
import { AppError, NotFoundError } from "../utils/app-error";

export interface UserInput {
  name: string;
  email: string;
  password?: string;
  isActive?: boolean;
}

export const userService = {
  list(params: ListParams) {
    return userRepository.list(params);
  },

  async getById(id: number) {
    const user = await userRepository.findSafeById(id);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return user;
  },

  async create(input: UserInput) {
    if (!input.password) {
      throw new AppError("Password is required", 422);
    }

    const existing = await userRepository.findByEmail(input.email);
    if (existing) {
      throw new AppError("Email already in use", 422);
    }

    const password = await bcrypt.hash(input.password, 10);

    return userRepository.create({
      name: input.name,
      email: input.email,
      password,
      isActive: input.isActive ?? true,
    });
  },

  async update(id: number, input: Partial<UserInput>) {
    await userService.getById(id);

    if (input.email) {
      const existing = await userRepository.findByEmail(input.email);
      if (existing && existing.id !== id) {
        throw new AppError("Email already in use", 422);
      }
    }

    const data: { name?: string; email?: string; isActive?: boolean; password?: string } = {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.email !== undefined && { email: input.email }),
      ...(input.isActive !== undefined && { isActive: input.isActive }),
    };

    if (input.password) {
      data.password = await bcrypt.hash(input.password, 10);
    }

    return userRepository.update(id, data);
  },

  async remove(id: number) {
    await userService.getById(id);
    await userRepository.delete(id);
  },
};
