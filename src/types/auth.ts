import { ReactElement } from 'react';

// ==============================|| TYPES - AUTH  ||============================== //

export type GuardProps = {
  children: ReactElement | null;
};

export type UserProfile = {
  id?: string;
  email?: string;
  avatar?: string;
  image?: string;
  name?: string;
  role?: string;
  tier?: string;
};

export interface AuthProps {
  isLoggedIn: boolean;
  isInitialized?: boolean;
  user?: User | null;
  token?: string | null;
}

export interface AuthActionProps {
  type: string;
  payload?: AuthProps;
}

export interface InitialLoginContextProps {
  isLoggedIn: boolean;
  isInitialized?: boolean;
  user?: User | null | undefined;
}

export interface JWTDataProps {
  userId: string;
}

export type JWTContextType = {
  isLoggedIn: boolean;
  isInitialized?: boolean;
  user?: User | null | undefined;
  logout: () => void;
  login: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: VoidFunction;
};

export interface User {
  username: string;
  firstName: string;
  lastName: string;
  middleName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female';
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  id: string;
  slug: string;
  referenceNumber: string;
  role: string;
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
  token: string;
  vulnerabilityLevelName: string;
  vulnerabilityLevelId: string;
}
export type Manager = {
  firstName: string;
  lastName: string;
  middleName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  role?: string;
  username: string;
  password: string;
  province: Province;
  city: City;
  sector: Sector;
  village: Village;
  cityName?: string;
  provinceName?: string;
  committee?: string;
  committeeName?: string;
};

export interface Province {
  id: string;
  name: string;
}
export interface City {
  id: string;
  name: string;
}
export interface Sector {
  id: string;
  name: string;
}
export interface Village {
  id: string;
  name: string;
}

export interface Provinces {
  name: string;
  id: string;
  slug: string;
  referenceNumber: string;
  cities: Cities[];
}

export interface Cities {
  name: string;
  id: string;
  slug: string;
  referenceNumber: string;
  sectors: Sectors[];
}

export interface Sectors {
  name: string;
  id: string;
  slug: string;
  referenceNumber: string;
  villages: Villages[];
}

export interface Villages {
  name: string;
  id: string;
  slug: string;
  referenceNumber: string;
}

export type ResposableEntity = {
  name: string;
  id: string;
  slug: string;
  referenceNumber: string;
};

export type ProjeSite = {
  name: string;
  id: string;
  slug: string;
  referenceNumber: string;
};

export type Prejiduce = {
  name: string;
  id: string;
  slug: string;
  referenceNumber: string;
  typeName: string;
  typeId: string;
};
