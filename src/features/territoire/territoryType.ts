import type { z } from "zod"
import type {
  addVillageSchema,
  citySchema,
  createCitySchema,
  createTerritorySchema,
  deleteCitySchema,
  deleteTerritorySchema,
  territorySchema,
  sectorSchema,
  updateCitySchema,
  updateTerritorySchema,
  villageSchema,
} from "./territoryValidation"

export type IVillage = z.infer<typeof villageSchema>

export type ISector = z.infer<typeof sectorSchema>

export type ICity = z.infer<typeof citySchema>

export type ITerritory = z.infer<typeof territorySchema>
export type CreateTerritory = z.infer<typeof createTerritorySchema>
export type UpdateTerritoryType = z.infer<typeof updateTerritorySchema>
export type DeleteTerritoryType = z.infer<typeof deleteTerritorySchema>

export type AddVillage = z.infer<typeof addVillageSchema>

export type CreateCity = z.infer<typeof createCitySchema>
export type UpdateCityType = z.infer<typeof updateCitySchema>
export type DeleteCityType = z.infer<typeof deleteCitySchema>
