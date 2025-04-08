import { z } from 'zod';

export const PapSchema = z.object({
  id: z.string().uuid(),
  code: z.string(),
  fullName: z.string(),
  gender: z.enum(['Male', 'Female']), // Ajustez
  age: z.string().regex(/^\d+$/, "L'âge doit être une chaîne numérique"),
  phone: z
    .string()
    .optional()
    .or(
      z
        .string()
        .regex(/^\+243/, 'Le numéro doit commencer par +243 (RDC uniquement)')
        .regex(/^\+243[0-9]{9}$/, 'Le numéro de téléphone doit contenir exactement 9 chiffres après +243')
    ),
  identityDocumentNumber: z.string(),
  propertyType: z.string(), // Considérez remplacer par z.enum si des valeurs spécifiques sont autorisées
  territory: z.string(),
  village: z.string(),
  longitude: z.string().regex(/^-?\d+(\.\d+)?$/, 'Format de longitude invalide'),
  latitude: z.string().regex(/^-?\d+(\.\d+)?$/, 'Format de latitude invalide'),
  referenceKilometerPoint: z.string(),
  orientation: z.string(),
  isVulnerable: z.boolean(),
  vulnerabilityType: z.string().optional(),
  coordonnees: z.string().regex(/^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/, 'Format de coordonnées invalide'),
  surface: z.number(),
  cu: z.number(),
  plusValue: z.number(),
  annexeSurface: z.number(),
  activiteCommerciale: z.string().optional(),
  arbreAffectee: z.string().optional(),
  nombreJours: z.number(),
  equivalentDollars: z.number(),
  perteRevenuLocatif: z.number(),
  assistanceDemenagement: z.number(),
  assistance_personne_vulnerable: z.number(),
  accordLiberationLieu: z.boolean()
});

export const importPapSchema = z.object({
  excel: z
    .instanceof(File, { message: 'Veuillez sélectionner un fichier.' }) // Validates that the input is a File instance
    .refine(
      (file) =>
        file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      {
        message: 'Le fichier doit être un fichier Excel valide (.xls ou .xlsx).'
      }
    )
});

export const CreatePapSchema = z.object({
  code: z.string(),
  fullName: z.string(),
  gender: z.enum(['Male', 'Female']), // Ajustez
  age: z.string().regex(/^\d+$/, "L'âge doit être une chaîne numérique"),
  phone: z
    .string()
    .optional()
    .or(
      z
        .string()
        .regex(/^\+243/, 'Le numéro doit commencer par +243 (RDC uniquement)')
        .regex(/^\+243[0-9]{9}$/, 'Le numéro de téléphone doit contenir exactement 9 chiffres après +243')
    ),
  identityDocumentNumber: z.string(),
  propertyType: z.string(), // Considérez remplacer par z.enum si des valeurs spécifiques sont autorisées
  territory: z.string(),
  village: z.string(),
  longitude: z.string().regex(/^-?\d+(\.\d+)?$/, 'Format de longitude invalide'),
  latitude: z.string().regex(/^-?\d+(\.\d+)?$/, 'Format de latitude invalide'),
  referenceKilometerPoint: z.string(),
  orientation: z.string(),
  isVulnerable: z.boolean(),
  vulnerabilityType: z.string().optional(),
  coordonnees: z.string().regex(/^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/, 'Format de coordonnées invalide'),
  surface: z.number(),
  cu: z.number(),
  plusValue: z.number(),
  annexeSurface: z.number(),
  activiteCommerciale: z.string().optional(),
  arbreAffectee: z.string().optional(),
  nombreJours: z.number(),
  equivalentDollars: z.number(),
  perteRevenuLocatif: z.number(),
  assistanceDemenagement: z.number(),
  assistance_personne_vulnerable: z.number(),
  accordLiberationLieu: z.boolean()
});

export const DeletePapSchema = z.object({
  id: z.string(),
  reason: z.string()
});

export const UpdatePapSchema = z.object({
  id: z.string(),
  data: CreatePapSchema
});

export const fetchPapSchema = z.object({
  pageNo: z.number().optional(),
  pageSize: z.number().optional(),
  sortBy: z.string().optional(),
  filter: z.string().optional()
});
