import { z } from "zod";

export const villageSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, { message: "Le nom est requis" }),
  slug: z.string().min(1, { message: "Le slug est requis" }),
  referenceNumber: z.string().min(1, { message: "Le numéro de référence est requis" }),
  committeeName: z.string().nullable(),
  committeeId: z.string().uuid().nullable(),
  projectSiteName: z.string().nullable(),
  projectSiteId: z.string().uuid().nullable(),
});

export const sectorSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, { message: "Le nom est requis" }),
  slug: z.string().min(1, { message: "Le slug est requis" }),
  referenceNumber: z.string().min(1, { message: "Le numéro de référence est requis" }),
  villages: z.array(villageSchema),
});

export const citySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, { message: "Le nom est requis" }),
  slug: z.string().min(1, { message: "Le slug est requis" }),
  referenceNumber: z.string().min(1, { message: "Le numéro de référence est requis" }),
  sectors: z.array(sectorSchema),
});

export const territorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, { message: "Le nom est requis" }),
  slug: z.string().min(1, { message: "Le slug est requis" }),
  referenceNumber: z.string().min(1, { message: "Le numéro de référence est requis" }),
  cities: z.array(citySchema),
  isProjectConcern: z.boolean(),
});

// === CRUD validations ===

export const createTerritorySchema = z.object({
  name: z.string().min(3, { message: "Le nom doit comporter au moins 3 caractères" }),
  province: z.string().min(1, { message: "La province doit être sélectionnée" }), // Ajout de la validation pour provinceId
});

export const updateTerritorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(3, { message: "Le nom doit comporter au moins 3 caractères" }),
});

export const deleteTerritorySchema = z.object({
  id: z.string().uuid(),
  reason: z.enum(["Bad data", "Data created by mistake and more"], {
    message: "Ce champ est requis",
  }),
});

export const addVillageSchema = z.object({
  name: z.string().min(3, { message: "Le nom du village est requis" }),
  sector: z.string().uuid({ message: "Le secteur est requis" }),
  projectSite: z.string().uuid({ message: "Le site du projet est requis" }),
  committee: z.string().uuid({ message: "Le comité est requis" }),
});

export const createCitySchema = z.object({
  territory: z.string().uuid({ message: "Le territoire est requis" }),
  name: z.string().min(3, { message: "Le nom doit comporter au moins 3 caractères" }),
});

export const updateCitySchema = z.object({
  id: z.string().uuid(),
  territory: z.string().uuid({ message: "Le territoire est requis" }),
  name: z.string().min(3, { message: "Le nom doit comporter au moins 3 caractères" }),
});

export const deleteCitySchema = z.object({
  id: z.string().uuid(),
  reason: z.enum(["Bad data", "Data created by mistake and more"], {
    message: "Ce champ est requis",
  }),
});
