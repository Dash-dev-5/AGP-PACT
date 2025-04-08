import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AddVillage, Village } from 'types/village';
import { deleteRequest, getRequest, parseError, postRequest } from 'utils/verbes';

interface InitialState {
  villages: Village[];
  loading: boolean;
  error: string | null;
  deleteStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

export interface DeleteVillageType {
  id: string;
  reason: string;
}

const initialState: InitialState = {
  villages: [],
  loading: false,
  error: null,
  deleteStatus: 'idle'
};

export const createVillage = createAsyncThunk<Village, AddVillage>('village/createVillage', async (newVillage, { rejectWithValue }) => {
  try {
    const response = await postRequest<Village>('villages', newVillage);
    return response.data;
  } catch (error) {
    return rejectWithValue(parseError(error));
  }
});

export const fetchVillages = createAsyncThunk<Village[]>('village/fetchVillages', async (_, { rejectWithValue }) => {
  try {
    const response = await getRequest<Village[]>('villages');
    return response.data;
  } catch (error) {
    return rejectWithValue(parseError(error));
  }
});

export const deleteVillage = createAsyncThunk<string, DeleteVillageType>('village/deleteVillage', async (params, { rejectWithValue }) => {
  try {
    await deleteRequest(`villages/${params.id}`, { reason: params.reason });
    return params.id;
  } catch (error) {
    return rejectWithValue(parseError(error));
  }
});

const villageSlice = createSlice({
  name: 'village',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createVillage.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createVillage.fulfilled, (state, action) => {
      state.villages.push(action.payload);
      state.loading = false;
    });
    builder.addCase(createVillage.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message as string;
    });

    builder.addCase(fetchVillages.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchVillages.fulfilled, (state, action) => {
      state.villages = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchVillages.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message as string;
    });
    builder.addCase(deleteVillage.pending, (state) => {
      state.deleteStatus = 'loading';
    });
    builder.addCase(deleteVillage.fulfilled, (state, action) => {
      state.villages = state.villages.filter((village) => village.id !== action.payload);
      state.deleteStatus = 'succeeded';
    });
    builder.addCase(deleteVillage.rejected, (state) => {
      state.deleteStatus = 'failed';
    });
  }
});

export default villageSlice.reducer;
