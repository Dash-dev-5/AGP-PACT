import { z } from "zod";

// === Validation pour un village ===
export const villageSchema = z.object({
  id: z.string().uuid({ message: "L'identifiant du village est invalide" }),
  name: z.string().min(1, { message: "Le nom est requis" }).nullable(),
  slug: z.string().min(1, { message: "Le slug est requis" }).nullable(),
  referenceNumber: z.string().min(1, { message: "Le numéro de référence est requis" }).nullable(),
  committeeName: z.string().nullable(),
  committeeId: z.string().uuid({ message: "L'identifiant du comité est invalide" }).nullable(),
  projectSiteName: z.string().nullable(),
  projectSiteId: z.string().uuid({ message: "L'identifiant du site de projet est invalide" }).nullable()
});

// === Validation pour un secteur ===
export const sectorSchema = z.object({
  id: z.string().uuid({ message: "L'identifiant du secteur est invalide" }).nullable(),
  name: z.string().min(1, { message: "Le nom est requis" }).nullable(),
  slug: z.string().min(1, { message: "Le slug est requis" }).nullable(),
  referenceNumber: z.string().min(1, { message: "Le numéro de référence est requis" }).nullable(),
  villages: z.array(villageSchema).nullable()
});

// === Validation pour une ville ===
export const citySchema = z.object({
  id: z.string().nullable(),
  province: z.string().nullable(),
  name: z.string().nullable(),
  territory: z.string().optional(), // Ajoutez cette ligne
});

// === Validation pour un territoire ===
export const territorySchema = z.object({
  id: z.string().uuid({ message: "L'identifiant du territoire est invalide" }),
  name: z.string().min(1, { message: "Le nom est requis" }).nullable(),
  slug: z.string().min(1, { message: "Le slug est requis" }).nullable(),
  referenceNumber: z.string().min(1, { message: "Le numéro de référence est requis" }).nullable(),
  cities: z.array(citySchema).nullable(),
  isProjectConcern: z.boolean().nullable()
});

// === Validations CRUD ===

// Création de ville
export const createCitySchema = z.object({
  name: z.string().nonempty({ message: "Le nom est requis" }).nullable(),
  province: z.string().min(1, { message: "La province doit être sélectionnée" }).nullable()
});

// Mise à jour de ville
export const updateCitySchema = z.object({
  id: z.string().uuid({ message: "L'identifiant de la ville est invalide" }).nullable(),
  province: z.string().uuid({ message: "Le territoire est requis" }).nullable(),
  name: z.string().min(3, { message: "Le nom doit comporter au moins 3 caractères" }).nullable()
});

// Suppression de ville
export const deleteCitySchema = z.object({
  id: z.string().uuid({ message: "L'identifiant de la ville est invalide" }).nullable(),
  reason: z.enum(["Bad data", "Data created by mistake and more"], {
    message: "La raison est requise"
  })
});

// Ajout de village
export const addVillageSchema = z.object({
  name: z.string().min(3, { message: "Le nom du village est requis" }).nullable(),
  sector: z.string().uuid({ message: "Le secteur est requis" }).nullable(),
  projectSite: z.string().uuid({ message: "Le site du projet est requis" }).nullable(),
  committee: z.string().uuid({ message: "Le comité est requis" }).nullable()
});
