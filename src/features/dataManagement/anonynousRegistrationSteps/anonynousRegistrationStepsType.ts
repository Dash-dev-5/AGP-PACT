import { SpeciesType, VictimeType } from '../dataManagementType';

export interface AnonymousRegistrationForm {
  description: string;
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
  complainant: undefined;
  incidentCause: string;
  victims: VictimeType[];
  species: SpeciesType[];
}
