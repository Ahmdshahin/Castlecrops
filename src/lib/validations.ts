import { z } from 'zod';

export const productSchema = z.object({
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens'),
  category: z.string().min(1, 'Category is required'),
  nameEn: z.string().min(1, 'English Name is required'),
  nameAr: z.string().optional(),
  nameFr: z.string().optional(),
  namePl: z.string().optional(),
  nameTr: z.string().optional(),
  descEn: z.string().min(1, 'English Description is required'),
  descAr: z.string().optional(),
  descFr: z.string().optional(),
  descPl: z.string().optional(),
  descTr: z.string().optional(),
  metaTitleEn: z.string().optional(),
  metaDescEn: z.string().optional(),
  ogImageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

export const blogSchema = z.object({
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens'),
  titleEn: z.string().min(1, 'English Title is required'),
  bodyEn: z.string().min(1, 'English Content is required'),
  metaTitleEn: z.string().optional(),
  metaDescEn: z.string().optional(),
  ogImageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});
