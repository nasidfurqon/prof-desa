import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";

export interface ListParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

const SORTABLE_FIELDS = new Set(["name", "email", "createdAt", "updatedAt"]);

const SAFE_SELECT = {
  id: true,
  name: true,
  email: true,
  photo: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

export const userRepository = {
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  findById(id: number) {
    return prisma.user.findUnique({ where: { id } });
  },

  findSafeById(id: number) {
    return prisma.user.findUnique({ where: { id }, select: SAFE_SELECT });
  },

  async list({ page, limit, search, sortBy, sortOrder }: ListParams) {
    const where: Prisma.UserWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const orderField = sortBy && SORTABLE_FIELDS.has(sortBy) ? sortBy : "createdAt";

    const [items, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: SAFE_SELECT,
        orderBy: { [orderField]: sortOrder ?? "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return { items, total };
  },

  create(data: Prisma.UserCreateInput) {
    return prisma.user.create({ data, select: SAFE_SELECT });
  },

  update(id: number, data: Prisma.UserUpdateInput) {
    return prisma.user.update({ where: { id }, data, select: SAFE_SELECT });
  },

  delete(id: number) {
    return prisma.user.delete({ where: { id } });
  },
};
