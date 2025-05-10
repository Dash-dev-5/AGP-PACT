import type { z } from "zod"
import type {
  sectorSchema,
  createSectorSchema,
  updateSectorSchema,
  deleteSectorSchema,
} from "./communeValidation"

export type ISector = z.infer<typeof sectorSchema>
export type CreateSector = z.infer<typeof createSectorSchema>
export type UpdateSectorType = z.infer<typeof updateSectorSchema>
export type DeleteSectorType = z.infer<typeof deleteSectorSchema>
