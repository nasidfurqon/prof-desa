export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface OrganizationImage {
  id: number;
  image: string;
  caption: string | null;
  sortOrder: number;
}

export interface Location {
  id: number;
  latitude: string;
  longitude: string;
  address: string | null;
}

export interface Organization {
  id: number;
  name: string;
  description: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  thumbnail: string | null;
  createdAt: string;
  updatedAt: string;
  images?: OrganizationImage[];
  location?: Location | null;
}

export interface OrganizationFormValues {
  name: string;
  description: string;
  phone?: string;
  email?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  thumbnail?: FileList;
  images?: FileList;
}

export interface Page {
  id: number;
  pageKey: string;
  title: string;
  content: string;
  updatedAt: string;
}

export type MapMarkerType = "ORGANIZATION" | "UMKM" | "SCHOOL";

export interface MapMarker {
  id: number;
  type: MapMarkerType;
  referenceId: number;
  name: string;
  description: string;
  thumbnail: string | null;
  latitude: number;
  longitude: number;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  photo: string | null;
}

export interface User {
  id: number;
  name: string;
  email: string;
  photo: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserFormValues {
  name: string;
  email: string;
  password?: string;
  isActive?: boolean;
}

export interface UmkmImage {
  id: number;
  image: string;
  caption: string | null;
  sortOrder: number;
}

export interface Umkm {
  id: number;
  name: string;
  ownerName: string;
  phone: string | null;
  description: string;
  address: string | null;
  thumbnail: string | null;
  createdAt: string;
  updatedAt: string;
  images?: UmkmImage[];
  location?: Location | null;
}

export interface UmkmFormValues {
  name: string;
  ownerName: string;
  description: string;
  phone?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  thumbnail?: FileList;
  images?: FileList;
}

export interface SchoolImage {
  id: number;
  image: string;
  caption: string | null;
  sortOrder: number;
}

export interface School {
  id: number;
  name: string;
  level: string;
  description: string;
  address: string | null;
  phone: string | null;
  thumbnail: string | null;
  createdAt: string;
  updatedAt: string;
  images?: SchoolImage[];
  location?: Location | null;
}

export interface SchoolFormValues {
  name: string;
  level: string;
  description: string;
  address?: string;
  phone?: string;
  latitude?: number;
  longitude?: number;
  thumbnail?: FileList;
  images?: FileList;
}

export type NewsRelatedType = "GENERAL" | "ORGANIZATION" | "UMKM" | "SCHOOL";

export interface NewsImage {
  id: number;
  image: string;
  caption: string | null;
  sortOrder: number;
}

export interface News {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  thumbnail: string | null;
  relatedType: NewsRelatedType;
  relatedId: number | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  images?: NewsImage[];
}

export interface NewsFormValues {
  title: string;
  summary: string;
  content: string;
  relatedType?: NewsRelatedType;
  relatedId?: number;
  publishedAt?: string;
  thumbnail?: FileList;
  images?: FileList;
}
