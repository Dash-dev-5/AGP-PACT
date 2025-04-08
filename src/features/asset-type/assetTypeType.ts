import { z } from 'zod';

export const AssetTypeSchema = z.object({
  name: z.string(),
  id: z.string(),
  slug: z.string(),
  referenceNumber: z.string()
});

export const DeleteAssetTypeSchema = z.object({
  id: z.string().nonempty("L'ID est requis."),
  reason: z.string().nonempty('Une raison est requise.')
});

export const CreateAssetTypeSchema = z.object({
  name: z.string().nonempty('Le nom est requis.')
});

export const UpdateAssetTypeSchema = z.object({
  name: z.string(),
  id: z.string()
});
