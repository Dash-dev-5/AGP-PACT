import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RepairRequest } from './repairRequestType';
import { getRequest, parseError } from 'utils/verbes';
import { endpoints } from 'utils/endpoints';

interface InitialState {
  repairRequests: RepairRequest[];
  loading: boolean;
  error: string | null;
}

const initialState: InitialState = {
  repairRequests: [],
  loading: false,
  error: null
};

export const fetchRepairRequestsAsync = createAsyncThunk<RepairRequest[], void>(
  'repairRequest/fetchRepairRequests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest<RepairRequest[]>(endpoints.repairRequest.main);
      return response.data;
    } catch (error) {
      return rejectWithValue(parseError(error));
    }
  }
);

const repairRequestSlice = createSlice({
  name: 'repairRequest',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRepairRequestsAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRepairRequestsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.repairRequests = action.payload;
      })
      .addCase(fetchRepairRequestsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'An error occurred';
      });
  }
});

export const { reducer: repairRequestReducer } = repairRequestSlice;
