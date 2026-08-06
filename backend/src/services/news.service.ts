import { NewsRelatedType } from "@prisma/client";
import { newsRepository, ListParams } from "../repositories/news.repository";
import { NotFoundError } from "../utils/app-error";
import { uploadToBlob } from "../config/multer";
import { slugify } from "../utils/slugify";

export interface NewsInput {
  title: string;
  summary: string;
  content: string;
  relatedType?: NewsRelatedType;
  relatedId?: number;
  publishedAt?: Date;
}

export interface UploadedImages {
  thumbnail?: Express.Multer.File[];
  images?: Express.Multer.File[];
}

async function ensureUniqueSlug(baseSlug: string, excludeId?: number) {
  let slug = baseSlug;
  let suffix = 1;
  while (await newsRepository.findBySlugExcludingId(slug, excludeId)) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
  return slug;
}

export const newsService = {
  list(params: ListParams) {
    return newsRepository.list(params);
  },

  async getById(id: number) {
    const news = await newsRepository.findById(id);
    if (!news) {
      throw new NotFoundError("News not found");
    }
    return news;
  },

  async getBySlug(slug: string) {
    const news = await newsRepository.findBySlug(slug);
    if (!news) {
      throw new NotFoundError("News not found");
    }
    return news;
  },

  async create(input: NewsInput, files: UploadedImages, createdBy?: number) {
    const slug = await ensureUniqueSlug(slugify(input.title));
    const thumbnail = files.thumbnail?.[0] ? await uploadToBlob("news", files.thumbnail[0]) : undefined;

    const news = await newsRepository.create({
      title: input.title,
      slug,
      summary: input.summary,
      content: input.content,
      thumbnail,
      relatedType: input.relatedType ?? "GENERAL",
      relatedId: input.relatedId,
      publishedAt: input.publishedAt ?? new Date(),
      ...(createdBy !== undefined && { author: { connect: { id: createdBy } } }),
    });

    if (files.images?.length) {
      const images = await Promise.all(
        files.images.map(async (file, index) => ({ image: await uploadToBlob("news", file), sortOrder: index }))
      );
      await newsRepository.addImages(news.id, images);
    }

    return newsService.getById(news.id);
  },

  async update(id: number, input: Partial<NewsInput>, files: UploadedImages) {
    await newsService.getById(id);

    const thumbnail = files.thumbnail?.[0] ? await uploadToBlob("news", files.thumbnail[0]) : undefined;

    let slug: string | undefined;
    if (input.title !== undefined) {
      slug = await ensureUniqueSlug(slugify(input.title), id);
    }

    await newsRepository.update(id, {
      ...(input.title !== undefined && { title: input.title }),
      ...(slug !== undefined && { slug }),
      ...(input.summary !== undefined && { summary: input.summary }),
      ...(input.content !== undefined && { content: input.content }),
      ...(input.relatedType !== undefined && { relatedType: input.relatedType }),
      ...(input.relatedId !== undefined && { relatedId: input.relatedId }),
      ...(input.publishedAt !== undefined && { publishedAt: input.publishedAt }),
      ...(thumbnail && { thumbnail }),
    });

    if (files.images?.length) {
      const images = await Promise.all(
        files.images.map(async (file, index) => ({ image: await uploadToBlob("news", file), sortOrder: index }))
      );
      await newsRepository.addImages(id, images);
    }

    return newsService.getById(id);
  },

  async remove(id: number) {
    await newsService.getById(id);
    await newsRepository.delete(id);
  },
};
