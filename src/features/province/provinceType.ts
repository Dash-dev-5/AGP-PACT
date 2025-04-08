import { z } from 'zod';
import {
  addVillageSchema,
  citySchema,
  createCitySchema,
  createProvinceSchema,
  deleteCitySchema,
  deleteProvinceSchema,
  provinceSchema,
  sectorSchema,
  updateCitySchema,
  updateProvinceSchema,
  villageSchema
} from './provinceValidation';

export type IVillage = z.infer<typeof villageSchema>;

export type ISector = z.infer<typeof sectorSchema>;

export type ICity = z.infer<typeof citySchema>;

export type IProvince = z.infer<typeof provinceSchema>;
export type CreateProvince = z.infer<typeof createProvinceSchema>;
export type UpdateProvinceType = z.infer<typeof updateProvinceSchema>;
export type DeleteProvinceType = z.infer<typeof deleteProvinceSchema>;

export type AddVillage = z.infer<typeof addVillageSchema>;

export type CreateCity = z.infer<typeof createCitySchema>;
export type UpdateCityType = z.infer<typeof updateCitySchema>;
export type DeleteCityType = z.infer<typeof deleteCitySchema>;
