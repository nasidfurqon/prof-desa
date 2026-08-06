-- CreateEnum
CREATE TYPE "LocationReferenceType" AS ENUM ('ORGANIZATION', 'UMKM', 'SCHOOL');

-- CreateEnum
CREATE TYPE "NewsRelatedType" AS ENUM ('GENERAL', 'ORGANIZATION', 'UMKM', 'SCHOOL');

-- CreateTable
CREATE TABLE "master_users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "photo" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "master_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "master_pages" (
    "id" SERIAL NOT NULL,
    "page_key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "master_pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "master_organizations" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "thumbnail" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "master_organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization_images" (
    "id" SERIAL NOT NULL,
    "organization_id" INTEGER NOT NULL,
    "image" TEXT NOT NULL,
    "caption" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "organization_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "master_umkms" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "owner_name" TEXT NOT NULL,
    "phone" TEXT,
    "description" TEXT NOT NULL,
    "address" TEXT,
    "thumbnail" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "master_umkms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "umkm_images" (
    "id" SERIAL NOT NULL,
    "umkm_id" INTEGER NOT NULL,
    "image" TEXT NOT NULL,
    "caption" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "umkm_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "master_schools" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "address" TEXT,
    "phone" TEXT,
    "thumbnail" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "master_schools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "school_images" (
    "id" SERIAL NOT NULL,
    "school_id" INTEGER NOT NULL,
    "image" TEXT NOT NULL,
    "caption" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "school_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "master_locations" (
    "id" SERIAL NOT NULL,
    "reference_type" "LocationReferenceType" NOT NULL,
    "reference_id" INTEGER NOT NULL,
    "latitude" DECIMAL(10,7) NOT NULL,
    "longitude" DECIMAL(10,7) NOT NULL,
    "address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "master_locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "news" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "thumbnail" TEXT,
    "related_type" "NewsRelatedType" NOT NULL DEFAULT 'GENERAL',
    "related_id" INTEGER,
    "published_at" TIMESTAMP(3),
    "created_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "news_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "news_images" (
    "id" SERIAL NOT NULL,
    "news_id" INTEGER NOT NULL,
    "image" TEXT NOT NULL,
    "caption" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "news_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "master_users_email_key" ON "master_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "master_pages_page_key_key" ON "master_pages"("page_key");

-- CreateIndex
CREATE UNIQUE INDEX "master_locations_reference_type_reference_id_key" ON "master_locations"("reference_type", "reference_id");

-- CreateIndex
CREATE UNIQUE INDEX "news_slug_key" ON "news"("slug");

-- AddForeignKey
ALTER TABLE "organization_images" ADD CONSTRAINT "organization_images_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "master_organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "umkm_images" ADD CONSTRAINT "umkm_images_umkm_id_fkey" FOREIGN KEY ("umkm_id") REFERENCES "master_umkms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "school_images" ADD CONSTRAINT "school_images_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "master_schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "news" ADD CONSTRAINT "news_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "master_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "news_images" ADD CONSTRAINT "news_images_news_id_fkey" FOREIGN KEY ("news_id") REFERENCES "news"("id") ON DELETE CASCADE ON UPDATE CASCADE;
