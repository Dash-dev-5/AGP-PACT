import type { z } from "zod"
import type {
  villageSchema,
  createVillageSchema,
  updateVillageSchema,
  deleteVillageSchema,
} from "./villageValidation"

export type IVillage = z.infer<typeof villageSchema>
export type CreateVillage = z.infer<typeof createVillageSchema>
export type UpdateVillageType = z.infer<typeof updateVillageSchema>
export type DeleteVillageType = z.infer<typeof deleteVillageSchema>
