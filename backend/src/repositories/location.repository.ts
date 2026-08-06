import { LocationReferenceType } from "@prisma/client";
import { prisma } from "../config/prisma";

export const locationRepository = {
  upsert(referenceType: LocationReferenceType, referenceId: number, latitude: number, longitude: number, address?: string) {
    return prisma.location.upsert({
      where: { referenceType_referenceId: { referenceType, referenceId } },
      update: { latitude, longitude, address },
      create: { referenceType, referenceId, latitude, longitude, address },
    });
  },

  deleteFor(referenceType: LocationReferenceType, referenceId: number) {
    return prisma.location.deleteMany({ where: { referenceType, referenceId } });
  },

  findFor(referenceType: LocationReferenceType, referenceId: number) {
    return prisma.location.findUnique({
      where: { referenceType_referenceId: { referenceType, referenceId } },
    });
  },

  listAll() {
    return prisma.location.findMany();
  },
};
