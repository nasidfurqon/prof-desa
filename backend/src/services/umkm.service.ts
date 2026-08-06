import { LocationReferenceType } from "@prisma/client";
import { umkmRepository, ListParams } from "../repositories/umkm.repository";
import { locationRepository } from "../repositories/location.repository";
import { NotFoundError } from "../utils/app-error";
import { uploadToBlob } from "../config/multer";

export interface UmkmInput {
  name: string;
  ownerName: string;
  description: string;
  phone?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

export interface UploadedImages {
  thumbnail?: Express.Multer.File[];
  images?: Express.Multer.File[];
}

export const umkmService = {
  list(params: ListParams) {
    return umkmRepository.list(params);
  },

  async getById(id: number) {
    const umkm = await umkmRepository.findById(id);
    if (!umkm) {
      throw new NotFoundError("UMKM not found");
    }
    const location = await locationRepository.findFor(LocationReferenceType.UMKM, id);
    return { ...umkm, location };
  },

  async create(input: UmkmInput, files: UploadedImages) {
    const thumbnail = files.thumbnail?.[0] ? await uploadToBlob("umkms", files.thumbnail[0]) : undefined;

    const umkm = await umkmRepository.create({
      name: input.name,
      ownerName: input.ownerName,
      description: input.description,
      phone: input.phone,
      address: input.address,
      thumbnail,
    });

    if (files.images?.length) {
      const images = await Promise.all(
        files.images.map(async (file, index) => ({ image: await uploadToBlob("umkms", file), sortOrder: index }))
      );
      await umkmRepository.addImages(umkm.id, images);
    }

    if (input.latitude !== undefined && input.longitude !== undefined) {
      await locationRepository.upsert(LocationReferenceType.UMKM, umkm.id, input.latitude, input.longitude, input.address);
    }

    return umkmService.getById(umkm.id);
  },

  async update(id: number, input: Partial<UmkmInput>, files: UploadedImages) {
    await umkmService.getById(id);

    const thumbnail = files.thumbnail?.[0] ? await uploadToBlob("umkms", files.thumbnail[0]) : undefined;

    await umkmRepository.update(id, {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.ownerName !== undefined && { ownerName: input.ownerName }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.phone !== undefined && { phone: input.phone }),
      ...(input.address !== undefined && { address: input.address }),
      ...(thumbnail && { thumbnail }),
    });

    if (files.images?.length) {
      const images = await Promise.all(
        files.images.map(async (file, index) => ({ image: await uploadToBlob("umkms", file), sortOrder: index }))
      );
      await umkmRepository.addImages(id, images);
    }

    if (input.latitude !== undefined && input.longitude !== undefined) {
      await locationRepository.upsert(LocationReferenceType.UMKM, id, input.latitude, input.longitude, input.address);
    }

    return umkmService.getById(id);
  },

  async remove(id: number) {
    await umkmService.getById(id);
    await locationRepository.deleteFor(LocationReferenceType.UMKM, id);
    await umkmRepository.delete(id);
  },
};
