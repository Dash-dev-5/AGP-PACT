import { z } from "zod";

// === Validation pour un village ===
export const villageSchema = z.object({
  id: z.string().uuid({ message: "L'identifiant du village est invalide" }),
  name: z.string().min(1, { message: "Le nom est requis" }),
  slug: z.string().min(1, { message: "Le slug est requis" }),
  referenceNumber: z.string().min(1, { message: "Le numéro de référence est requis" }),
  committeeName: z.string().nullable(),
  committeeId: z.string().uuid({ message: "L'identifiant du comité est invalide" }).nullable(),
  projectSiteName: z.string().nullable(),
  projectSiteId: z.string().uuid({ message: "L'identifiant du site de projet est invalide" }).nullable()
});

// === Validation pour un secteur ===
export const sectorSchema = z.object({
  id: z.string().uuid({ message: "L'identifiant du secteur est invalide" }),
  name: z.string().min(1, { message: "Le nom est requis" }),
  slug: z.string().min(1, { message: "Le slug est requis" }),
  referenceNumber: z.string().min(1, { message: "Le numéro de référence est requis" }),
  villages: z.array(villageSchema)
});

// === Validation pour une ville ===
export const citySchema = z.object({
  id: z.string().uuid({ message: "L'identifiant de la ville est invalide" }),
  name: z.string().min(1, { message: "Le nom est requis" }),
  slug: z.string().min(1, { message: "Le slug est requis" }),
  referenceNumber: z.string().min(1, { message: "Le numéro de référence est requis" }),
  sectors: z.array(sectorSchema) || null
});

// === Validation pour un territoire ===
export const territorySchema = z.object({
  id: z.string().uuid({ message: "L'identifiant du territoire est invalide" }),
  name: z.string().min(1, { message: "Le nom est requis" }),
  slug: z.string().min(1, { message: "Le slug est requis" }),
  referenceNumber: z.string().min(1, { message: "Le numéro de référence est requis" }),
  cities: z.array(citySchema),
  isProjectConcern: z.boolean()
});

// === Validations CRUD ===

// Création de ville
export const createCitySchema = z.object({
  name: z.string().nonempty({ message: "Le nom est requis" }),
  province: z.string().min(1, { message: "La province doit être sélectionnée" })
});

// Mise à jour de ville
export const updateCitySchema = z.object({
  id: z.string().uuid({ message: "L'identifiant de la ville est invalide" }),
  province: z.string().uuid({ message: "Le territoire est requis" }),
  name: z.string().min(3, { message: "Le nom doit comporter au moins 3 caractères" })
});

// Suppression de ville
export const deleteCitySchema = z.object({
  id: z.string().uuid({ message: "L'identifiant de la ville est invalide" }),
  reason: z.enum(["Bad data", "Data created by mistake and more"], {
    message: "La raison est requise"
  })
});

// Ajout de village
export const addVillageSchema = z.object({
  name: z.string().min(3, { message: "Le nom du village est requis" }),
  sector: z.string().uuid({ message: "Le secteur est requis" }),
  projectSite: z.string().uuid({ message: "Le site du projet est requis" }),
  committee: z.string().uuid({ message: "Le comité est requis" })
});
