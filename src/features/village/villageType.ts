import { z } from "zod";
import {
  villageSchema,
  createVillageSchema,
  updateVillageSchema,
  deleteVillageSchema,
} from "./villageValidation";

// Types inférés pour l'utilisation avec Zod
export type IVillage = z.infer<typeof villageSchema>;
export type CreateVillage = z.infer<typeof createVillageSchema>;
export type UpdateVillageType = z.infer<typeof updateVillageSchema>;
export type DeleteVillageType = z.infer<typeof deleteVillageSchema>;
