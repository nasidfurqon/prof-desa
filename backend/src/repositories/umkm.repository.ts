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

export const umkmRepository = {
  async list({ page, limit, search, sortBy, sortOrder }: ListParams) {
    const where: Prisma.UmkmWhereInput = search
      ? { name: { contains: search, mode: "insensitive" } }
      : {};

    const orderField = sortBy && SORTABLE_FIELDS.has(sortBy) ? sortBy : "createdAt";

    const [items, total] = await Promise.all([
      prisma.umkm.findMany({
        where,
        orderBy: { [orderField]: sortOrder ?? "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.umkm.count({ where }),
    ]);

    return { items, total };
  },

  findById(id: number) {
    return prisma.umkm.findUnique({
      where: { id },
      include: { images: { orderBy: { sortOrder: "asc" } } },
    });
  },

  create(data: Prisma.UmkmCreateInput) {
    return prisma.umkm.create({ data });
  },

  update(id: number, data: Prisma.UmkmUpdateInput) {
    return prisma.umkm.update({ where: { id }, data });
  },

  delete(id: number) {
    return prisma.umkm.delete({ where: { id } });
  },

  addImages(umkmId: number, images: { image: string; caption?: string; sortOrder: number }[]) {
    return prisma.umkmImage.createMany({
      data: images.map((img) => ({ ...img, umkmId })),
    });
  },
};
