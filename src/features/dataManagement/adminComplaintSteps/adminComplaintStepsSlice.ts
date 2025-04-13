import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { parseError, postRequest } from 'utils/verbes';
import { endpoints } from 'utils/endpoints';
import { SpeciesType, VictimeType } from '../dataManagementType';
import { AdminRegerationFormType } from './adminComplaintStepsType';

interface InitialState {
  step: number;
  step1Done: boolean;
  formData: AdminRegerationFormType;
}

const initialState: InitialState = {
  step1Done: false,
  step: 1,
  formData: {
    description: '',
    latitude: undefined,
    longitude: undefined,
    incidentStartDate: '',
    incidentEndDate: '',
    addressLine1: undefined,
    addressLine2: undefined,
    isComplainantAffected: 'false',
    province: '',
    city: '',
    sector: '',
    village: '',
    type: '',
    isSensitive: false,
    victims: [],
    species: [],
    complainant: {
      firstName: '',
      lastName: '',
      middleName: undefined,
      dateOfBirth: '',
      gender: 'Male',
      addressLine1: '',
      addressLine2: '',
      fullName: '',
      legalPersonality: 'Natural Person',
      organizationStatus: undefined,
      province: '',
      city: '',
      sector: '',
      village: '',
      profession: '',
      username: '',
      password: ''
    }
  }
};

export const submitRegstrationForm = createAsyncThunk<any, AdminRegerationFormType>(
  'adminRegistrationSteps/submit',
  async (registrationComplaint, { rejectWithValue }) => {
    try {
      const response = await postRequest<any>(endpoints.complaint.main, registrationComplaint);
      console.log('########## submitRegstrationForm ', response);
      return response.data;
    } catch (error) {
      return rejectWithValue(parseError(error));
    }
  }
);

const adminRegistrationSteps = createSlice({ 
  name: 'adminRegistrationSteps',
  initialState,
  reducers: {
    nextAdminStep: (state) => {
      state.step += 1;
    },
    prevAdminStep: (state) => {
      state.step -= 1;
    },
    saveAdminStepData: (state, action: PayloadAction<Partial<AdminRegerationFormType>>) => {
      state.formData = { ...state.formData, ...action.payload };
      state.step += 1;
    },
    resetAdminForm: (state) => {
      state.formData = initialState.formData;
      state.step = 1;
    },
    saveAdminSpeciesData: (state, action: PayloadAction<SpeciesType>) => {
      state.formData.species = [...state.formData.species, action.payload];
    },
    updateAdminSpeciesByIndex: (state, action: PayloadAction<{ index: number; data: SpeciesType }>) => {
      state.formData.species[action.payload.index] = action.payload.data;
    },
    deleteAdminSpeciesByIndex: (state, action: PayloadAction<number>) => {
      state.formData.species = state.formData.species.filter((_, index) => index !== action.payload);
    },
    saveAdminVictimesData: (state, action: PayloadAction<VictimeType>) => {
      state.formData.victims = [...state.formData.victims, action.payload];
    },
    deleteAdminVictimeByIndex: (state, action: PayloadAction<number>) => {
      state.formData.victims = state.formData.victims.filter((_, index) => index !== action.payload);
    },
    updateAdminVictimeByIndex: (state, action: PayloadAction<{ index: number; data: VictimeType }>) => {
      state.formData.victims[action.payload.index] = action.payload.data;
    }
  }
});

export const {
  nextAdminStep,
  prevAdminStep,
  saveAdminStepData,
  saveAdminSpeciesData,
  updateAdminSpeciesByIndex,
  deleteAdminSpeciesByIndex,
  saveAdminVictimesData,
  deleteAdminVictimeByIndex,
  updateAdminVictimeByIndex,
  resetAdminForm
} = adminRegistrationSteps.actions;

export default adminRegistrationSteps.reducer;
