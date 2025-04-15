import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RegerationFormType } from './registrationStepsType';
import { parseError, postRequest } from 'utils/verbes';
import { endpoints } from 'utils/endpoints';
import { SpeciesType, VictimeType } from '../dataManagementType';

interface InitialState {
  step: number;
  step1Done: boolean;
  formData: RegerationFormType;
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

export const submitRegstrationForm = createAsyncThunk<any, RegerationFormType>(
  'registrationSteps/submit',
  async (registrationComplaint, { rejectWithValue }) => {
    try {
      const response = await postRequest<any>(endpoints.complainant.main, registrationComplaint);
      console.log('£££ response', response);
      return response.data;
    } catch (error) {
      console.log('£££ error', error);
      return rejectWithValue(parseError(error));
    }
  }
);

const registrationSteps = createSlice({
  name: 'registrationSteps',
  initialState,
  reducers: {
    nextStep: (state) => {
      state.step += 1;
    },
    prevStep: (state) => {
      state.step -= 1;
    },
    saveStepData: (state, action: PayloadAction<Partial<RegerationFormType>>) => {
      state.formData = { ...state.formData, ...action.payload };
      state.step += 1;
    },
    resetForm: (state) => {
      state.formData = initialState.formData;
      state.step = 1;
    },
    saveSpeciesData: (state, action: PayloadAction<SpeciesType>) => {
      state.formData.species = [...state.formData.species, action.payload];
    },
    updateSpeciesByIndex: (state, action: PayloadAction<{ index: number; data: SpeciesType }>) => {
      state.formData.species[action.payload.index] = action.payload.data;
    },
    deleteSpeciesByIndex: (state, action: PayloadAction<number>) => {
      state.formData.species = state.formData.species.filter((_, index) => index !== action.payload);
    },
    saveVictimesData: (state, action: PayloadAction<VictimeType>) => {
      state.formData.victims = [...state.formData.victims, action.payload];
    },
    deleteVictimeByIndex: (state, action: PayloadAction<number>) => {
      state.formData.victims = state.formData.victims.filter((_, index) => index !== action.payload);
    },
    updateVictimeByIndex: (state, action: PayloadAction<{ index: number; data: VictimeType }>) => {
      state.formData.victims[action.payload.index] = action.payload.data;
    }
  }
});

export const {
  nextStep,
  prevStep,
  saveStepData,
  saveSpeciesData,
  updateSpeciesByIndex,
  deleteSpeciesByIndex,
  saveVictimesData,
  deleteVictimeByIndex,
  updateVictimeByIndex,
  resetForm
} = registrationSteps.actions;

export default registrationSteps.reducer;
