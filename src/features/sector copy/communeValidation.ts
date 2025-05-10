import { z } from "zod"
// import { villageSchema } from "./communeValidation" // ou déplace ce fichier vers un dossier plus générique si nécessaire

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
  id: z.string().uuid({ message: "L'identifiant de la commune est invalide" }),
  name: z.string().min(1, { message: "Le nom est requis" }),
  slug: z.string().min(1, { message: "Le slug est requis" }),
  referenceNumber: z.string().min(1, { message: "Le numéro de référence est requis" }),
  villages: z.array(villageSchema),
})

// === CRUD ===

export const createSectorSchema = z.object({
  name: z.string().nonempty({ message: "Le nom est requis" }),
  city: z.string().min(1, { message: "La ville doit être sélectionnée" })
})

export const updateSectorSchema = z.object({
  id: z.string().uuid({ message: "L'identifiant est invalide" }),
  city: z.string().uuid({ message: "La ville est requise" }),
  name: z.string().min(3, { message: "Le nom doit comporter au moins 3 caractères" })
})

export const deleteSectorSchema = z.object({
  id: z.string().uuid({ message: "L'identifiant est invalide" }),
  reason: z.enum(["Bad data", "Data created by mistake and more"], {
    message: "La raison est requise"
  })
})
