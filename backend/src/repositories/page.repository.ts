import { prisma } from "../config/prisma";

export const pageRepository = {
  list() {
    return prisma.page.findMany({ orderBy: { pageKey: "asc" } });
  },
  findByKey(pageKey: string) {
    return prisma.page.findUnique({ where: { pageKey } });
  },
  update(id: number, data: { title?: string; content?: string }) {
    return prisma.page.update({ where: { id }, data });
  },
};
