import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { getRequest, parseError } from 'utils/verbes';

export interface TraitementSchema {
  name: string;
  position: number;
  deadlineForNormalComplaint?: any;
  deadlineForPriorityComplaint?: any;
  deadlineForUrgentComplaint?: any;
  id: string;
  slug: string;
  referenceNumber: string;
}

interface Traitement {
  traitementData: TraitementSchema[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

const initialState: Traitement = {
  traitementData: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 0,
  pageSize: 10
};

export const getTraitements = createAsyncThunk('getTraitements', async (_, { rejectWithValue }) => {
  try {
    const response = await getRequest<TraitementSchema[]>('processing-step');

    return response.data;
  } catch (error) {
    return rejectWithValue(parseError(error));
  }
});

const traitementSlice = createSlice({
  name: 'traitement',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getTraitements.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getTraitements.fulfilled, (state, action) => {
      state.loading = false;
      state.traitementData = action.payload;
    });
    builder.addCase(getTraitements.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  }
});

export default traitementSlice.reducer;
