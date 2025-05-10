import { z } from "zod"

// === Village individuel ===
export const villageSchema = z.object({
  id: z.string().uuid({ message: "L'identifiant du village est invalide" }),
  name: z.string().min(1, { message: "Le nom est requis" }),
  slug: z.string().min(1, { message: "Le slug est requis" }),
  referenceNumber: z.string().min(1, { message: "Le numéro de référence est requis" }),
  committeeName: z.string().nullable(),
  committeeId: z.string().uuid().nullable(),
  projectSiteName: z.string().nullable(),
  projectSiteId: z.string().uuid().nullable(),
});

// === CRUD ===

export const createVillageSchema = z.object({
  name: z.string().nonempty({ message: "Le nom est requis" }),

});


export const updateVillageSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Le nom est requis'),
  city: z.string().min(1, 'La ville est requise'),
  committeeName: z.string().optional(),
  referenceNumber: z.string().optional(),
});

export const deleteVillageSchema = z.object({
  id: z.string().uuid({ message: "L'identifiant est invalide" }),
  reason: z.enum(["Bad data", "Data created by mistake and more"], {
    message: "La raison est requise"
  })
});
