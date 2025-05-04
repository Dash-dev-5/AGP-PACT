import { z } from 'zod';

export const PriceSchema = z.object({
  price: z.number({ invalid_type_error: 'Le prix doit être un nombre.' }).min(0, { message: 'Le prix doit être un nombre positif.' }),
  id: z.string().uuid({ message: "L'ID doit être un UUID valide." }),
  slug: z.string().nonempty({ message: 'Le slug est requis.' }),
  referenceNumber: z.string().nonempty({ message: 'Le numéro de référence est requis.' }),
  speciesName: z.string().nonempty({ message: "Le nom de l'espèce est requis." }),
  speciesId: z.string().nonempty({ message: "L'ID de l'espèce est requis." }),
  projectSiteName: z.string().nonempty({ message: 'Le nom du site de projet est requis.' }),
  projectSiteId: z.string().nonempty({ message: "L'ID du site de projet est requis." })
});

export const SpeciesSchema = z.object({
  name: z.string(),
  id: z.string().uuid(),
  slug: z.string(),
  referenceNumber: z.string(),
  typeName: z.string(),
  typeId: z.string().uuid(),
  unitName: z.string(),
  unitId: z.string().uuid(),
  prices: z.array(PriceSchema)
});

export const CreateSpeciesPriceSchema = z.object({
  price: z.number({ invalid_type_error: 'Le prix est requis' }).min(0, 'Le prix doit être un nombre positif'),
  projectSite: z.string().uuid('Le tronçon est requis'),
  species: z.string().uuid("L'espèce est requise")
});

export const CreateSpeciesSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  type: z.string().uuid("Le type d'actif est requis"),
  unit: z.string().uuid("L'unité de mesure est requise")
});

export const CreateVulnerabiliteSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  
});

export const updateSpeciesSchema = z.object({
  id: z.string().uuid(),
  data: CreateSpeciesSchema.extend({
    unit: z.string().uuid("L'unité de mesure est requise").optional()
  })
});

export const DeleteSpeciesSchema = z.object({
  id: z.string(),
  reason: z.string()
});
