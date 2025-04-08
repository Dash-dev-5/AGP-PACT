import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { endpoints } from 'utils/endpoints';
import { deleteRequest, getRequest, parseError, postRequest, putRequest } from 'utils/verbes';

export interface ComplaintType {
  name: string;
  isSensitive: boolean;
  id: string;
  slug: string;
  referenceNumber: string;
}

export interface UpdateComplaintType extends Omit<ComplaintType, 'referenceNumber' | 'slug'> {}
export interface CreateComplaintType {
  name: string;
  isSensitive: boolean | string;
}

export interface DeleteComplaintType {
  id: string;
  reason: 'Bad data' | 'Data created by mistake and more';
}

export interface InitialState {
  complaintTypes: Array<ComplaintType>;
  loading: boolean;
  error: string | null;
  deleteStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  updateStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: InitialState = {
  complaintTypes: [],
  loading: false,
  error: null,
  deleteStatus: 'idle',
  updateStatus: 'idle'
};

export const createComplaintTypeAsync = createAsyncThunk<ComplaintType, CreateComplaintType>(
  'complaintType/createComplaintType',
  async (complaintType, { rejectWithValue }) => {
    try {
      const response = await postRequest<ComplaintType>(endpoints.complaintType.main, complaintType);
      return response.data;
    } catch (error) {
      return rejectWithValue(parseError(error));
    }
  }
);

export const fetchComplaintTypesAsync = createAsyncThunk<ComplaintType[]>(
  'complaintType/fetchComplaintTypes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest<ComplaintType[]>(endpoints.complaintType.main);
      return response.data;
    } catch (error) {
      return rejectWithValue(parseError(error));
    }
  }
);

export const deleteComplaintTypeAsync = createAsyncThunk<string, DeleteComplaintType>(
  'complaintType/deleteComplaintType',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      await deleteRequest(`${endpoints.complaintType.main}/${id}`, { reason });
      return id;
    } catch (error) {
      return rejectWithValue(parseError(error));
    }
  }
);

export const updateComplaintTypeAsync = createAsyncThunk<ComplaintType, UpdateComplaintType>(
  'complaintType/updateComplaintType',
  async ({ isSensitive, name, id }, { rejectWithValue }) => {
    try {
      const response = await putRequest<ComplaintType>(`${endpoints.complaintType.main}/${id}`, {
        isSensitive,
        name
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(parseError(error));
    }
  }
);

const complaintTypeSlice = createSlice({
  name: 'complaintType',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createComplaintTypeAsync.fulfilled, (state, action) => {
      state.loading = false;
      state.complaintTypes = [...state.complaintTypes, action.payload];
    });

    builder.addCase(fetchComplaintTypesAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchComplaintTypesAsync.fulfilled, (state, action) => {
      state.loading = false;
      state.complaintTypes = action.payload;
    });
    builder.addCase(fetchComplaintTypesAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message as string;
    });

    builder.addCase(deleteComplaintTypeAsync.pending, (state) => {
      state.deleteStatus = 'loading';
    });
    builder.addCase(deleteComplaintTypeAsync.fulfilled, (state, action) => {
      state.deleteStatus = 'succeeded';
      state.complaintTypes = state.complaintTypes.filter((complaintType) => complaintType.id !== action.payload);
    });
    builder.addCase(deleteComplaintTypeAsync.rejected, (state) => {
      state.deleteStatus = 'failed';
    });

    builder.addCase(updateComplaintTypeAsync.pending, (state) => {
      state.updateStatus = 'loading';
    });
    builder.addCase(updateComplaintTypeAsync.fulfilled, (state, action) => {
      state.updateStatus = 'succeeded';
      const index = state.complaintTypes.findIndex((complaintType) => complaintType.id === action.payload.id);
      if (index !== -1) {
        state.complaintTypes[index] = action.payload;
      }
    });
    builder.addCase(updateComplaintTypeAsync.rejected, (state) => {
      state.updateStatus = 'failed';
    });
  }
});

export default complaintTypeSlice.reducer;
