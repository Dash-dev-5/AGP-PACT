import { z } from 'zod';

export const UnitSchema = z.object({
  name: z.string(),
  id: z.string(),
  slug: z.string(),
  referenceNumber: z.string()
});

export const CreateUnitSchema = z.object({
  name: z.string()
});

export const UpdateUnitSchema = z.object({
  name: z.string(),
  id: z.string()
});

export const DeleteUnitSchema = z.object({
  id: z.string(),
  reason: z.string()
});
