import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";

export interface ListParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

const SORTABLE_FIELDS = new Set(["title", "publishedAt", "createdAt", "updatedAt"]);

export const newsRepository = {
  async list({ page, limit, search, sortBy, sortOrder }: ListParams) {
    const where: Prisma.NewsWhereInput = search
      ? { title: { contains: search, mode: "insensitive" } }
      : {};

    const orderField = sortBy && SORTABLE_FIELDS.has(sortBy) ? sortBy : "createdAt";

    const [items, total] = await Promise.all([
      prisma.news.findMany({
        where,
        orderBy: { [orderField]: sortOrder ?? "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.news.count({ where }),
    ]);

    return { items, total };
  },

  findById(id: number) {
    return prisma.news.findUnique({
      where: { id },
      include: { images: { orderBy: { sortOrder: "asc" } } },
    });
  },

  findBySlug(slug: string) {
    return prisma.news.findUnique({
      where: { slug },
      include: { images: { orderBy: { sortOrder: "asc" } } },
    });
  },

  findBySlugExcludingId(slug: string, excludeId?: number) {
    return prisma.news.findFirst({
      where: { slug, ...(excludeId ? { id: { not: excludeId } } : {}) },
    });
  },

  create(data: Prisma.NewsCreateInput) {
    return prisma.news.create({ data });
  },

  update(id: number, data: Prisma.NewsUpdateInput) {
    return prisma.news.update({ where: { id }, data });
  },

  delete(id: number) {
    return prisma.news.delete({ where: { id } });
  },

  addImages(newsId: number, images: { image: string; caption?: string; sortOrder: number }[]) {
    return prisma.newsImage.createMany({
      data: images.map((img) => ({ ...img, newsId })),
    });
  },
};
