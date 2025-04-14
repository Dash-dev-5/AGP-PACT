export interface CreateComplainant {
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female';
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  username: string;
  password: string;
  confirmPassword?: string;
  province: string;
  city: string;
  sector: string;
  village: string;
  profession: string;
}

export interface Complainant {
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female';
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  fullName: string;
  otherProfession: string;
  legalPersonality: string;
  organizationStatus: string;
  id: string;
  slug: string;
  referenceNumber: string;
  complainantHasAccount: boolean;
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
  professionName: string;
  professionId: string;
  vulnerabilityLevelName: string;
  vulnerabilityLevelId: string;
  role: string;
  type: string;
}

export interface WithPaggination<T> {
  pageSize: number;
  currentPage: number;
  totalItems: number;
  data: Array<T>;
}

export interface ComplainantParams {
  pageSize?: number;
  pageNo?: number;
  filter?: string;
  sortBy?: string;
}
