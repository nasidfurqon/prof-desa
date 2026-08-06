import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";

export interface ListParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

const SORTABLE_FIELDS = new Set(["name", "createdAt", "updatedAt"]);

export const schoolRepository = {
  async list({ page, limit, search, sortBy, sortOrder }: ListParams) {
    const where: Prisma.SchoolWhereInput = search
      ? { name: { contains: search, mode: "insensitive" } }
      : {};

    const orderField = sortBy && SORTABLE_FIELDS.has(sortBy) ? sortBy : "createdAt";

    const [items, total] = await Promise.all([
      prisma.school.findMany({
        where,
        orderBy: { [orderField]: sortOrder ?? "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.school.count({ where }),
    ]);

    return { items, total };
  },

  findById(id: number) {
    return prisma.school.findUnique({
      where: { id },
      include: { images: { orderBy: { sortOrder: "asc" } } },
    });
  },

  create(data: Prisma.SchoolCreateInput) {
    return prisma.school.create({ data });
  },

  update(id: number, data: Prisma.SchoolUpdateInput) {
    return prisma.school.update({ where: { id }, data });
  },

  delete(id: number) {
    return prisma.school.delete({ where: { id } });
  },

  addImages(schoolId: number, images: { image: string; caption?: string; sortOrder: number }[]) {
    return prisma.schoolImage.createMany({
      data: images.map((img) => ({ ...img, schoolId })),
    });
  },
};
