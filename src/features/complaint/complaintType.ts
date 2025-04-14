import { Complainant } from 'features/complainant/complainantType';
import { Prejudice } from 'features/prejudice/prejudiceSlice';
import { ComplaintType } from 'types/complaintType';

export interface CreateComplaint {
  typeSend: 'Nominal' | 'Anonymous';
  description: string;
  latitude: number;
  longitude: number;
  incidentStartDate: string;
  incidentEndDate: string;
  addressLine1: string;
  addressLine2?: string;
  isComplainantAffected: string;
  province: string;
  city: string;
  sector: string;
  village: string;
  complaintType?: string;
  prejudice: string;
  site: string;
  incidentCause: string;
  repairType: string;
  responsibleEntity: string;
  complainant: LocalComplainant;
  victims: Array<CreateVictim>;
}

export interface LocalComplainant {
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female';
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  fullName: string;
  legalPersonality: 'Juridical Person' | 'Natural Person';
  organizationStatus: 'Public Organization' | 'Private Organization' | 'ONG' | 'Other Association';
  province: string;
  city: string;
  sector: string;
  village: string;
  profession: string;
}

export interface CreateVictim {
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female';
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  relationshipToComplainant: 'Spouse' | 'Child' | 'Acquaintance' | 'Other family member';
  province: string;
  city: string;
  sector: string;
  village: string;
  vulnerabilityLevel: string;
}

// complaints list
export interface Complaint {
  typeSend: 'Anonymous' | 'Nominal';
  description: string;
  code: string;
  latitude: string;
  longitude: string;
  isEligible: boolean;
  incidentStartDate: string;
  incidentEndDate: string;
  addressLine1: string;
  addressLine2?: string;
  isComplainantAffected: boolean;
  id: string;
  slug: string;
  referenceNumber: string;
  totalPrice: string;
  isSensitive: string;
  category: string;
  countryName: string;
  countryId: string;
  provinceName: string;
  provinceId: string;
  cityName: string;
  cityId: string;
  sectorName: string;
  sectorId: string;
  villageName: string;
  villageId: string;
  status?: string;
  site: Site;
  incidentActivityCause: ComplaintType;
  repairType: RepairType;
  responsibleEntity: ResponsibleEntity;
  complainant: Complainant;
  prejudice: Prejudice;
  victims: Victim[];
  tracking?: Tracking[];
  currentStep?: CurrentStep;
  species?: Species[];
  createdAt?: string;
}

interface Site {
  name: string;
  id: string;
  slug: string;
  referenceNumber: string;
}
interface Species {
  quantity: number;
  otherSpecies: string;
  id: string;
  slug: string;
  referenceNumber: string;
  speciesName: string;
  speciesId: string;
  totalPrice: number;
}

interface Victim {
  firstName: string;
  lastName: string;
  middleName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female';
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  relationshipToComplainant: string;
  id: string;
  slug: string;
  referenceNumber: string;
  countryName: string;
  countryId: string;
  provinceName: string;
  provinceId: string;
  cityName: string;
  cityId: string;
  sectorName: string;
  sectorId: string;
  villageName: string;
  villageId: string;
  vulnerabilityLevelName: string;
  vulnerabilityLevelId: string;
}

interface ResponsibleEntity {
  name: string;
  id: string;
  slug: string;
  referenceNumber: string;
}

interface RepairType {
  name: string;
  id: string;
  slug: string;
  referenceNumber: string;
}

// interface complaintTypeSlice {
//   name: string;
//   id: string;
//   slug: string;
//   referenceNumber: string;
// }

type TrackingStep = {
  name: string;
  position: number;
  deadlineForNormalComplaint: number | null;
  deadlineForPriorityComplaint: number | null;
  deadlineForUrgentComplaint: number | null;
  id: string;
  slug: string;
  referenceNumber: string;
};

export type proposedSolution = {
  response: string;
  id: string;
  slug: string;
  referenceNumber: string;
  position: string | null;
  refusalReason: string;
  isSolutionAccepted: boolean;
};

type Tracking = {
  comment: string;
  id: string;
  slug: string;
  referenceNumber: string;
  position: number;
  status: string;
  type: string;
  startDate: string;
  endDate: string | null;
  dueDate: string;
  step: TrackingStep;
  proposedSolution: proposedSolution;
  satisfactionRating: SatisfactionRating;
};
type CurrentStep = {
  name: string;
  position: number;
  deadlineForNormalComplaint: number | null;
  deadlineForPriorityComplaint: number | null;
  deadlineForUrgentComplaint: number | null;
  id: string;
  slug: string;
  referenceNumber: string;
};

type SatisfactionRating = {
  id: string;
  slug: string;
  referenceNumber: string;
  position: number;
  reason: string | null;
  rating: string;
  isComplainantSatisfied: boolean;
};
