import { SpeciesType, VictimeType } from '../dataManagementType';

export interface ComplaintRegistrationForm {
  description: string;
  code?: string;
  latitude?: string;
  longitude?: string;
  incidentStartDate: string;
  incidentEndDate: string;
  addressLine1?: string;
  addressLine2?: string;
  isComplainantAffected: string;
  province: string;
  city: string;
  sector: string;
  village: string;
  complainant: any;
  type: string;
  victims: VictimeType[];
  species: SpeciesType[];
}
