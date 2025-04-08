// Type pour une entité géographique (province, ville, secteur, village, etc.)
type GeoEntity = string | null;

export interface Victim {
  firstName?: string | null;
  lastName?: string | null;
  middleName?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  email?: string | null;
  phone?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  relationshipToComplainant?: string | null;
  province?: GeoEntity;
  city?: GeoEntity;
  sector?: GeoEntity;
  village?: GeoEntity;
  vulnerabilityLevel?: GeoEntity;
}

export interface Complainant {
  firstName?: string | null;
  lastName?: string | null;
  middleName?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  email?: string | null;
  phone?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  fullName?: string | null;
  legalPersonality?: string | null;
  organizationStatus?: string | null;
  province?: GeoEntity;
  city?: GeoEntity;
  sector?: GeoEntity;
  village?: GeoEntity;
  profession?: GeoEntity;
}

export interface ComplaintForm {
  typeSend: string;
  description: string;
  latitude?: string | null;  
  longitude?: string | null; 
  incidentStartDate?: string | null;
  incidentEndDate?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  isComplainantAffected?: string | null;
  province?: GeoEntity;
  city?: GeoEntity;
  sector?: GeoEntity;
  village?: GeoEntity;
  prejudice?: GeoEntity;
  site?: GeoEntity;
  incidentCause?: GeoEntity;
  repairType?: GeoEntity;
  responsibleEntity?: GeoEntity;
  complainant: Complainant;
  victims?: Victim[];  
}
