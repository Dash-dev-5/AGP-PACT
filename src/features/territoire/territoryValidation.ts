import { z } from "zod";

export const villageSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, { message: "Le nom est requis" }).nullable(),
  slug: z.string().min(1, { message: "Le slug est requis" }).nullable(),
  referenceNumber: z.string().min(1, { message: "Le numéro de référence est requis" }).nullable(),
  committeeName: z.string().nullable(),
  committeeId: z.string().uuid().nullable(),
  projectSiteName: z.string().nullable(),
  projectSiteId: z.string().uuid().nullable(),
});

export const sectorSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, { message: "Le nom est requis" }).nullable(),
  slug: z.string().min(1, { message: "Le slug est requis" }).nullable(),
  referenceNumber: z.string().min(1, { message: "Le numéro de référence est requis" }).nullable(),
  villages: z.array(villageSchema).nullable(),
});

export const citySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, { message: "Le nom est requis" }).nullable(),
  slug: z.string().min(1, { message: "Le slug est requis" }).nullable(),
  referenceNumber: z.string().min(1, { message: "Le numéro de référence est requis" }).nullable(),
  sectors: z.array(sectorSchema).nullable(),
});



export const territorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, { message: "Le nom est requis" }).nullable(),
  slug: z.string().min(1, { message: "Le slug est requis" }).nullable(),
  referenceNumber: z.string().min(1, { message: "Le numéro de référence est requis" }).nullable(),
  provinceId: z.string().uuid().nullable(),
  villages: z.array(z.any()).nullable(), // ou définis un vrai schema pour les villages si nécessaire
});


// === CRUD validations ===

export const createTerritorySchema = z.object({
  name: z.string().min(3, { message: "Le nom doit comporter au moins 3 caractères" }).nullable(),
  province: z.string().min(1, { message: "La province doit être sélectionnée" }).nullable(), // Ajout de la validation pour provinceId
});

export const updateTerritorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(3, { message: "Le nom doit comporter au moins 3 caractères" }).nullable(),
});

export const deleteTerritorySchema = z.object({
  id: z.string().uuid(),
  reason: z.enum(["Bad data", "Data created by mistake and more"], {
    message: "Ce champ est requis",
  }),
});

export const addVillageSchema = z.object({
  name: z.string().min(3, { message: "Le nom du village est requis" }).nullable(),
  sector: z.string().uuid({ message: "Le secteur est requis" }).nullable(),
  projectSite: z.string().uuid({ message: "Le site du projet est requis" }).nullable(),
  committee: z.string().uuid({ message: "Le comité est requis" }).nullable(),
});

export const createCitySchema = z.object({
  province: z.string().uuid({ message: "La province est requis" }).nullable(),
  name: z.string().min(3, { message: "Le nom doit comporter au moins 3 caractères" }).nullable(),
});

export const updateCitySchema = z.object({
  id: z.string().uuid(),
  territory: z.string().uuid({ message: "Le territoire est requis" }).nullable(),
  name: z.string().min(3, { message: "Le nom doit comporter au moins 3 caractères" }).nullable(),
});

export const deleteCitySchema = z.object({
  id: z.string().uuid(),
  reason: z.enum(["Bad data", "Data created by mistake and more"], {
    message: "Ce champ est requis",
  }),
});
