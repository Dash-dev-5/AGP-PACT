import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IncidentCause } from './incidentCauseType';
import { getRequest, parseError } from 'utils/verbes';
import { endpoints } from 'utils/endpoints';

interface InitialState {
  incidentCauses: IncidentCause[];
  loading: boolean;
  error: string | null;
}

const initialState: InitialState = {
  incidentCauses: [],
  loading: false,
  error: null
};

export const fetchIncidentCausesAsync = createAsyncThunk<IncidentCause[], void>(
  'incidentCause/fetchIncidentCauses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest<IncidentCause[]>(endpoints.complaintType.main);
      return response.data;
    } catch (error) {
      return rejectWithValue(parseError(error));
    }
  }
);

const incidentCauseSlice = createSlice({
  name: 'type',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIncidentCausesAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchIncidentCausesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.incidentCauses = action.payload;
      })
      .addCase(fetchIncidentCausesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      });
  }
});

export const { reducer: incidentCauseReducer } = incidentCauseSlice;
