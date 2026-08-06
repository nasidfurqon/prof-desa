import { LocationReferenceType } from "@prisma/client";
import { schoolRepository, ListParams } from "../repositories/school.repository";
import { locationRepository } from "../repositories/location.repository";
import { NotFoundError } from "../utils/app-error";
import { uploadToBlob } from "../config/multer";

export interface SchoolInput {
  name: string;
  level: string;
  description: string;
  address?: string;
  phone?: string;
  latitude?: number;
  longitude?: number;
}

export interface UploadedImages {
  thumbnail?: Express.Multer.File[];
  images?: Express.Multer.File[];
}

export const schoolService = {
  list(params: ListParams) {
    return schoolRepository.list(params);
  },

  async getById(id: number) {
    const school = await schoolRepository.findById(id);
    if (!school) {
      throw new NotFoundError("School not found");
    }
    const location = await locationRepository.findFor(LocationReferenceType.SCHOOL, id);
    return { ...school, location };
  },

  async create(input: SchoolInput, files: UploadedImages) {
    const thumbnail = files.thumbnail?.[0] ? await uploadToBlob("schools", files.thumbnail[0]) : undefined;

    const school = await schoolRepository.create({
      name: input.name,
      level: input.level,
      description: input.description,
      address: input.address,
      phone: input.phone,
      thumbnail,
    });

    if (files.images?.length) {
      const images = await Promise.all(
        files.images.map(async (file, index) => ({ image: await uploadToBlob("schools", file), sortOrder: index }))
      );
      await schoolRepository.addImages(school.id, images);
    }

    if (input.latitude !== undefined && input.longitude !== undefined) {
      await locationRepository.upsert(LocationReferenceType.SCHOOL, school.id, input.latitude, input.longitude, input.address);
    }

    return schoolService.getById(school.id);
  },

  async update(id: number, input: Partial<SchoolInput>, files: UploadedImages) {
    await schoolService.getById(id);

    const thumbnail = files.thumbnail?.[0] ? await uploadToBlob("schools", files.thumbnail[0]) : undefined;

    await schoolRepository.update(id, {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.level !== undefined && { level: input.level }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.address !== undefined && { address: input.address }),
      ...(input.phone !== undefined && { phone: input.phone }),
      ...(thumbnail && { thumbnail }),
    });

    if (files.images?.length) {
      const images = await Promise.all(
        files.images.map(async (file, index) => ({ image: await uploadToBlob("schools", file), sortOrder: index }))
      );
      await schoolRepository.addImages(id, images);
    }

    if (input.latitude !== undefined && input.longitude !== undefined) {
      await locationRepository.upsert(LocationReferenceType.SCHOOL, id, input.latitude, input.longitude, input.address);
    }

    return schoolService.getById(id);
  },

  async remove(id: number) {
    await schoolService.getById(id);
    await locationRepository.deleteFor(LocationReferenceType.SCHOOL, id);
    await schoolRepository.delete(id);
  },
};
