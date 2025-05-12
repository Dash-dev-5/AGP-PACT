import type { z } from "zod"
import type {
  addVillageSchema,
  citySchema,
  createCitySchema,
  deleteCitySchema,
  updateCitySchema,
  villageSchema,
} from "./cityValidation" // Assure-toi d'avoir un fichier cityValidation.ts avec ces schémas

// Les types pour la ville et les autres entités liées à la ville
export type IVillage = z.infer<typeof villageSchema> // Type pour le village

export type ICity = z.infer<typeof citySchema> // Type pour la ville

export type CreateCity = z.infer<typeof createCitySchema> // Type pour la création d'une ville

export type UpdateCityType = z.infer<typeof updateCitySchema> & {
  territory?: string // Add territory as optional property
} // Type pour la mise à jour d'une ville

export type DeleteCityType = z.infer<typeof deleteCitySchema> // Type pour la suppression d'une ville

export type AddVillage = z.infer<typeof addVillageSchema> // Type pour l'ajout d'un village
