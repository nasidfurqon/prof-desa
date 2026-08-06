import { LocationReferenceType } from "@prisma/client";
import { organizationRepository, ListParams } from "../repositories/organization.repository";
import { locationRepository } from "../repositories/location.repository";
import { NotFoundError } from "../utils/app-error";
import { uploadToBlob } from "../config/multer";

export interface OrganizationInput {
  name: string;
  description: string;
  phone?: string;
  email?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

export interface UploadedImages {
  thumbnail?: Express.Multer.File[];
  images?: Express.Multer.File[];
}

export const organizationService = {
  async list(params: ListParams) {
    const { items, total } = await organizationRepository.list(params);
    return { items, total };
  },

  async getById(id: number) {
    const organization = await organizationRepository.findById(id);
    if (!organization) {
      throw new NotFoundError("Organization not found");
    }
    const location = await locationRepository.findFor(LocationReferenceType.ORGANIZATION, id);
    return { ...organization, location };
  },

  async create(input: OrganizationInput, files: UploadedImages) {
    const thumbnail = files.thumbnail?.[0] ? await uploadToBlob("organizations", files.thumbnail[0]) : undefined;

    const organization = await organizationRepository.create({
      name: input.name,
      description: input.description,
      phone: input.phone,
      email: input.email,
      address: input.address,
      thumbnail,
    });

    if (files.images?.length) {
      const images = await Promise.all(
        files.images.map(async (file, index) => ({
          image: await uploadToBlob("organizations", file),
          sortOrder: index,
        }))
      );
      await organizationRepository.addImages(organization.id, images);
    }

    if (input.latitude !== undefined && input.longitude !== undefined) {
      await locationRepository.upsert(
        LocationReferenceType.ORGANIZATION,
        organization.id,
        input.latitude,
        input.longitude,
        input.address
      );
    }

    return organizationService.getById(organization.id);
  },

  async update(id: number, input: Partial<OrganizationInput>, files: UploadedImages) {
    await organizationService.getById(id);

    const thumbnail = files.thumbnail?.[0] ? await uploadToBlob("organizations", files.thumbnail[0]) : undefined;

    await organizationRepository.update(id, {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.phone !== undefined && { phone: input.phone }),
      ...(input.email !== undefined && { email: input.email }),
      ...(input.address !== undefined && { address: input.address }),
      ...(thumbnail && { thumbnail }),
    });

    if (files.images?.length) {
      const images = await Promise.all(
        files.images.map(async (file, index) => ({
          image: await uploadToBlob("organizations", file),
          sortOrder: index,
        }))
      );
      await organizationRepository.addImages(id, images);
    }

    if (input.latitude !== undefined && input.longitude !== undefined) {
      await locationRepository.upsert(LocationReferenceType.ORGANIZATION, id, input.latitude, input.longitude, input.address);
    }

    return organizationService.getById(id);
  },

  async remove(id: number) {
    await organizationService.getById(id);
    await locationRepository.deleteFor(LocationReferenceType.ORGANIZATION, id);
    await organizationRepository.delete(id);
  },
};
