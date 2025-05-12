import type { z } from "zod"
import type { sectorSchema, createSectorSchema, deleteSectorSchema } from "./communeValidation"

export type ISector = z.infer<typeof sectorSchema>
export type CreateSector = z.infer<typeof createSectorSchema>
export type UpdateSectorType = {
  id: string
  name: string
  city: string
}
export type DeleteSectorType = z.infer<typeof deleteSectorSchema>
