export interface SpeciesType {
  quantity: string;
  species: string;
  speciesName: string;
  assetName: string;
  assetType: string;
  unit?: string;
  otherSpecies?: string;
}

export interface VictimeType {
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female';
  email?: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  relationshipToComplainant: string;
  vulnerabilityLevel: string;
}
