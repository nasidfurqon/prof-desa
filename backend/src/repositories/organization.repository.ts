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

export const organizationRepository = {
  async list({ page, limit, search, sortBy, sortOrder }: ListParams) {
    const where: Prisma.OrganizationWhereInput = search
      ? { name: { contains: search, mode: "insensitive" } }
      : {};

    const orderField = sortBy && SORTABLE_FIELDS.has(sortBy) ? sortBy : "createdAt";

    const [items, total] = await Promise.all([
      prisma.organization.findMany({
        where,
        orderBy: { [orderField]: sortOrder ?? "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.organization.count({ where }),
    ]);

    return { items, total };
  },

  findById(id: number) {
    return prisma.organization.findUnique({
      where: { id },
      include: { images: { orderBy: { sortOrder: "asc" } } },
    });
  },

  create(data: Prisma.OrganizationCreateInput) {
    return prisma.organization.create({ data });
  },

  update(id: number, data: Prisma.OrganizationUpdateInput) {
    return prisma.organization.update({ where: { id }, data });
  },

  delete(id: number) {
    return prisma.organization.delete({ where: { id } });
  },

  addImages(organizationId: number, images: { image: string; caption?: string; sortOrder: number }[]) {
    return prisma.organizationImage.createMany({
      data: images.map((img) => ({ ...img, organizationId })),
    });
  },
};
