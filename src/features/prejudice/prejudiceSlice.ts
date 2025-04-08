import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { endpoints } from 'utils/endpoints';
import { deleteRequest, getRequest, parseError, postRequest, putRequest } from 'utils/verbes';

export interface Prejudice {
  name: string;
  id: string;
  slug: string;
  referenceNumber: string;
  typeName: string;
  typeId: string;
}

export interface CreatePrejudice {
  name: string;
  type: string;
}

export interface UpdatePrejudiceType extends Omit<Prejudice, 'referenceNumber' | 'slug' | 'typeName'> {}
export interface DeletePrejudiceType {
  id: string;
  reason: 'Bad data' | 'Data created by mistake and more';
}

export interface InitialState {
  prejudices: Array<Prejudice>;
  loading: boolean;
  error: string | null;
  deleteStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  updateStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: InitialState = {
  prejudices: [],
  loading: false,
  error: null,
  deleteStatus: 'idle',
  updateStatus: 'idle'
};

export const createPrejudiceAsync = createAsyncThunk<Prejudice, CreatePrejudice>(
  'prejudice/createPrejudice',
  async (prejudice, { rejectWithValue }) => {
    try {
      const response = await postRequest<Prejudice>(endpoints.prejudice.main, prejudice);
      return response.data;
    } catch (error) {
      return rejectWithValue(parseError(error));
    }
  }
);

export const fetchPrejudicesAsync = createAsyncThunk<Prejudice[]>('prejudice/fetchPrejudices', async (_, { rejectWithValue }) => {
  try {
    const response = await getRequest<Prejudice[]>(endpoints.prejudice.main);
    return response.data;
  } catch (error) {
    return rejectWithValue(parseError(error));
  }
});

export const updatePrejudiceAsync = createAsyncThunk<Prejudice, UpdatePrejudiceType>(
  'prejudice/updatePrejudice',
  async (prejudice, { rejectWithValue }) => {
    try {
      const response = await putRequest<Prejudice>(`${endpoints.prejudice.main}/${prejudice.id}`, prejudice);
      return response.data;
    } catch (error) {
      return rejectWithValue(parseError(error));
    }
  }
);

export const deletePrejudiceAsync = createAsyncThunk<string, DeletePrejudiceType>(
  'prejudice/deletePrejudice',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      await deleteRequest(`${endpoints.prejudice.main}/${id}`, { reason });
      return id;
    } catch (error) {
      return rejectWithValue(parseError(error));
    }
  }
);

const prejudiceSlice = createSlice({
  name: 'prejudice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createPrejudiceAsync.fulfilled, (state, action) => {
      state.loading = false;
      state.prejudices = [...state.prejudices, action.payload];
    });

    builder.addCase(fetchPrejudicesAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchPrejudicesAsync.fulfilled, (state, action) => {
      state.loading = false;
      state.prejudices = action.payload;
    });
    builder.addCase(fetchPrejudicesAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message as string;
    });

    builder.addCase(updatePrejudiceAsync.pending, (state) => {
      state.updateStatus = 'loading';
    });
    builder.addCase(updatePrejudiceAsync.fulfilled, (state, action) => {
      state.updateStatus = 'succeeded';
      const index = state.prejudices.findIndex((prejudice) => prejudice.id === action.payload.id);
      if (index !== -1) {
        state.prejudices[index] = action.payload;
      }
    });
    builder.addCase(updatePrejudiceAsync.rejected, (state) => {
      state.updateStatus = 'failed';
    });

    builder.addCase(deletePrejudiceAsync.pending, (state) => {
      state.deleteStatus = 'loading';
    });
    builder.addCase(deletePrejudiceAsync.fulfilled, (state, action) => {
      state.deleteStatus = 'succeeded';
      state.prejudices = state.prejudices.filter((prejudice) => prejudice.id !== action.payload);
    });
    builder.addCase(deletePrejudiceAsync.rejected, (state) => {
      state.deleteStatus = 'failed';
    });
  }
});

export default prejudiceSlice.reducer;
