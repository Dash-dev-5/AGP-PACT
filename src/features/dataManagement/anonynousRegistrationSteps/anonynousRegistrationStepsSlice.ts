import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AnonymousRegistrationForm } from './anonynousRegistrationStepsType';
import { parseError, postRequest } from 'utils/verbes';
import { SpeciesType, VictimeType } from '../dataManagementType';

interface InitialState {
  step: number;
  formData: AnonymousRegistrationForm;
}

const initialState: InitialState = {
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
    isSensitive: false,
    complainant: undefined,
    province: '',
    city: '',
    sector: '',
    village: '',
    type: '',
    victims: [],
    species: []
  }
};

export const submitAnonymousRegstrationForm = createAsyncThunk(
  'complainantComplaintSteps/submit',
  async (newComplaint: AnonymousRegistrationForm, { rejectWithValue }) => {
    try {
      const response = await postRequest('complaints/anonymous', newComplaint);
      return response.data;
    } catch (error) {
      return rejectWithValue(parseError(error));
    }
  }
);

const anonynousRegistrationSteps = createSlice({
  name: 'anonynousRegistrationSteps',
  initialState,
  reducers: {
    nextAnonymousStep: (state) => {
      state.step += 1;
    },
    prevAnonymousStep: (state) => {
      state.step -= 1;
    },
    saveAnonymousStepData: (state, action: PayloadAction<Partial<AnonymousRegistrationForm>>) => {
      state.formData = { ...state.formData, ...action.payload };
      state.step += 1;
    },
    resetAnonymousForm: (state) => {
      state.formData = initialState.formData;
      state.step = 1;
    },
    saveSpeciesAnonymousData: (state, action: PayloadAction<SpeciesType>) => {
      state.formData.species = [...state.formData.species, action.payload];
    },
    updateAnonymousSpeciesByIndex: (state, action: PayloadAction<{ index: number; data: SpeciesType }>) => {
      state.formData.species[action.payload.index] = action.payload.data;
    },
    deleteAnonymousSpeciesByIndex: (state, action: PayloadAction<number>) => {
      state.formData.species = state.formData.species.filter((_, index) => index !== action.payload);
    },
    saveVictimesAnonymousData: (state, action: PayloadAction<VictimeType>) => {
      state.formData.victims = [...state.formData.victims, action.payload];
    },
    deleteAnonymousVictimeByIndex: (state, action: PayloadAction<number>) => {
      state.formData.victims = state.formData.victims.filter((_, index) => index !== action.payload);
    },
    updateAnonymousVictimeByIndex: (state, action: PayloadAction<{ index: number; data: VictimeType }>) => {
      state.formData.victims[action.payload.index] = action.payload.data;
    }
  }
});

export const {
  nextAnonymousStep,
  prevAnonymousStep,
  saveAnonymousStepData,
  resetAnonymousForm,
  saveSpeciesAnonymousData,
  updateAnonymousSpeciesByIndex,
  deleteAnonymousSpeciesByIndex,
  saveVictimesAnonymousData,
  deleteAnonymousVictimeByIndex,
  updateAnonymousVictimeByIndex
} = anonynousRegistrationSteps.actions;

export default anonynousRegistrationSteps.reducer;
