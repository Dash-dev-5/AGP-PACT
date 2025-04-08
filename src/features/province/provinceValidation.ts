import { z } from 'zod';

export const villageSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  referenceNumber: z.string(),
  committeeName: z.string().nullable(),
  committeeId: z.string().uuid().nullable(),
  projectSiteName: z.string().nullable(),
  projectSiteId: z.string().uuid().nullable()
});

export const sectorSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  referenceNumber: z.string(),
  villages: z.array(villageSchema)
});

export const citySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  referenceNumber: z.string(),
  sectors: z.array(sectorSchema)
});

export const provinceSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  referenceNumber: z.string(),
  cities: z.array(citySchema),
  isProjectConcern: z.boolean(),
});

export const createProvinceSchema = z.object({
  name: z.string().min(3, { message: 'Le nom doit comporter au moins 3 caractères' })
});

export const updateProvinceSchema = z.object({
  name: z.string().min(3, { message: 'Le nom doit comporter au moins 3 caractères' }),
  id: z.string().uuid()
});

export const deleteProvinceSchema = z.object({
  id: z.string().uuid(),
  reason: z.enum(['Bad data', 'Data created by mistake and more'], { message: 'Ce champ est requis' })
});

export const addVillageSchema = z.object({
  name: z.string(),
  sector: z.string().uuid(),
  projectSite: z.string().uuid(),
  committee: z.string().uuid()
});

export const createCitySchema = z.object({
  province: z.string().uuid(),
  name: z.string().min(3, { message: 'Le nom doit comporter au moins 3 caractères' })
});

export const updateCitySchema = z.object({
  name: z.string().min(3, { message: 'Le nom doit comporter au moins 3 caractères' }),
  id: z.string().uuid(),
  province: z.string().uuid()
});

export const deleteCitySchema = z.object({
  id: z.string().uuid(),
  reason: z.enum(['Bad data', 'Data created by mistake and more'], { message: 'Ce champ est requis' })
});
