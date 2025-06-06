import { SpeciesType, VictimeType } from '../dataManagementType';

export interface AdminRegerationFormType {
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
  type: string;
  isSensitive: Boolean;
  victims: VictimeType[];
  species: SpeciesType[];
  complainant: {
    firstName: string;
    lastName: string;
    middleName?: string;
    dateOfBirth: string;
    gender: 'Male' | 'Female';
    email?: string;
    phone?: string;
    addressLine1: string;
    addressLine2: string;
    fullName: string;
    legalPersonality: 'Juridical Person' | 'Natural Person';
    organizationStatus: 'Public' | 'Private' | 'Other' | undefined;
    province: string;
    city: string;
    sector: string;
    village: string;
    profession: string;
    otherProfession?: string;
    username: string;
    password: string;
    vulnerabilityLevel?: string;
  };
}
