import { z } from 'zod';

export const VillageSchema = z.object({
  name: z.string(),
  id: z.string(),
  slug: z.string(),
  referenceNumber: z.string(),
  committeeName: z.string(),
  committeeId: z.string(),
  projectSiteName: z.string(),
  projectSiteId: z.string()
});

export const ProjectSiteSchema = z.object({
  name: z.string(),
  id: z.string(),
  slug: z.string(),
  referenceNumber: z.string(),
  villages: z.array(VillageSchema)
});

export const CreateProjectSiteSchema = z.object({
  name: z.string()
});

export const UpdateProjectSiteSchema = z.object({
  name: z.string(),
  id: z.string()
});

export const DeleteProjectSiteSchema = z.object({
  id: z.string(),
  reason: z.string()
});
