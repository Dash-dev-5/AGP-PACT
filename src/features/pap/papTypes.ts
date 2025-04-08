import { z } from 'zod';
import { CreatePapSchema, DeletePapSchema, fetchPapSchema, importPapSchema, PapSchema, UpdatePapSchema } from './papSchema';

export type ImportPapFormData = z.infer<typeof importPapSchema>;
export type PapType = z.infer<typeof PapSchema>;

export type CreatePap = z.infer<typeof CreatePapSchema>;
export type DeletePapType = z.infer<typeof DeletePapSchema>;
export type UpdatePapType = z.infer<typeof UpdatePapSchema>;

export type FetchPapType = z.infer<typeof fetchPapSchema>;
