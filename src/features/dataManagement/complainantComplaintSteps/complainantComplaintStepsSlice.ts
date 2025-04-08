import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ComplaintRegistrationForm } from './complainantComplaintStepsType';
import { SpeciesType, VictimeType } from '../dataManagementType';
import { parseError, postRequest } from 'utils/verbes';

interface InitialState {
  step: number;
  formData: ComplaintRegistrationForm;
}

const initialState: InitialState = {
  step: 1,
  formData: {
    description: '',
    code: undefined,
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
    complainant: '',
    incidentCause: '',
    victims: [],
    species: []
  }
};

export const submitComplainantRegstrationForm = createAsyncThunk(
  'complainantComplaintSteps/submit',
  async (newComplaint: ComplaintRegistrationForm, { rejectWithValue }) => {
    try {
      const response = await postRequest('complaints/account-connected', newComplaint);
      return response.data;
    } catch (error) {
      return rejectWithValue(parseError(error));
    }
  }
);

const complainantComplaintStepsSlice = createSlice({
  name: 'complainantComplaintSteps',
  initialState,
  reducers: {
    nextComplainantStep: (state) => {
      state.step += 1;
    },
    prevComplainantStep: (state) => {
      state.step -= 1;
    },
    saveComplainantStepData: (state, action: PayloadAction<Partial<ComplaintRegistrationForm>>) => {
      state.formData = { ...state.formData, ...action.payload };
      state.step += 1;
    },
    resetComplainantForm: (state) => {
      state.formData = initialState.formData;
      state.step = 1;
    },
    saveSpeciesComplainantData: (state, action: PayloadAction<SpeciesType>) => {
      state.formData.species = [...state.formData.species, action.payload];
    },
    updateComplainantSpeciesByIndex: (state, action: PayloadAction<{ index: number; data: SpeciesType }>) => {
      state.formData.species[action.payload.index] = action.payload.data;
    },
    deleteComplainantSpeciesByIndex: (state, action: PayloadAction<number>) => {
      state.formData.species = state.formData.species.filter((_, index) => index !== action.payload);
    },

    saveVictimesComplainantData: (state, action: PayloadAction<VictimeType>) => {
      state.formData.victims = [...state.formData.victims, action.payload];
    },
    deleteComplainantVictimeByIndex: (state, action: PayloadAction<number>) => {
      state.formData.victims = state.formData.victims.filter((_, index) => index !== action.payload);
    },
    updateComplainantVictimeByIndex: (state, action: PayloadAction<{ index: number; data: VictimeType }>) => {
      state.formData.victims[action.payload.index] = action.payload.data;
    }
  }
});

export const {
  nextComplainantStep,
  prevComplainantStep,
  saveComplainantStepData,
  resetComplainantForm,
  saveSpeciesComplainantData,
  updateComplainantSpeciesByIndex,
  deleteComplainantSpeciesByIndex,
  saveVictimesComplainantData,
  deleteComplainantVictimeByIndex,
  updateComplainantVictimeByIndex
} = complainantComplaintStepsSlice.actions;
export default complainantComplaintStepsSlice.reducer;
