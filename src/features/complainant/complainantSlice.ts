import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Complainant, ComplainantParams, CreateComplainant, WithPaggination } from './complainantType';
import { getRequest, parseError, postRequest } from 'utils/verbes';
import { endpoints } from 'utils/endpoints';

interface InitialState {
  complainants: WithPaggination<Complainant>;
}

const initialState: InitialState = {
  complainants: {
    currentPage: 0,
    pageSize: 0,
    totalItems: 0,
    data: []
  }
};

export const createComplainantAsync = createAsyncThunk<Complainant, CreateComplainant>(
  'complainant/createComplainant',
  async (complainant, { rejectWithValue }) => {
    try {
      const response = await postRequest<Complainant>(endpoints.complainant.main, complainant);
      return response.data;
    } catch (error) {
      return rejectWithValue(parseError(error));
    }
  }
);

export const fetchComplainantsAsync = createAsyncThunk<WithPaggination<Complainant>, ComplainantParams>(
  'complainant/fetchComplainants',
  async (params, { rejectWithValue }) => {
    try {
      const response = await getRequest<WithPaggination<Complainant>>(endpoints.complainant.main, params);
      return response.data;
    } catch (error) {
      return rejectWithValue(parseError(error));
    }
  }
);

const complainantSlice = createSlice({
  name: 'complainant',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createComplainantAsync.fulfilled, (state, action: PayloadAction<Complainant>) => {
      state.complainants.data.push(action.payload);
      state.complainants.totalItems += 1;
    });

    builder.addCase(fetchComplainantsAsync.fulfilled, (state, action: PayloadAction<WithPaggination<Complainant>>) => {
      state.complainants = action.payload;
    });
  }
});

export default complainantSlice.reducer;
