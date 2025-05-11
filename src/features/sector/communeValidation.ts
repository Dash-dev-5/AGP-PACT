import { z } from "zod"
// import { villageSchema } from "./communeValidation" // ou déplace ce fichier vers un dossier plus générique si nécessaire

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
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  referenceNumber: z.string().nullable(),
  villages: z.array(villageSchema).nullable(), // Accepte soit un tableau soit null
});

// === CRUD ===

export const createSectorSchema = z.object({
  name: z.string().nonempty({ message: "Le nom est requis" }).nullable(),
  city: z.string().min(1, { message: "La ville doit être sélectionnée" }).nullable()
})

export const updateSectorSchema = z.object({
  id: z.string().uuid({ message: "L'identifiant est invalide" }).nullable(),
  city: z.string().uuid({ message: "La ville est requise" }).nullable(),
  name: z.string().min(3, { message: "Le nom doit comporter au moins 3 caractères" }).nullable()
})

export const deleteSectorSchema = z.object({
  id: z.string().uuid({ message: "L'identifiant est invalide" }).nullable(),
  reason: z.enum(["Bad data", "Data created by mistake and more"], {
    message: "La raison est requise"
  })
})
