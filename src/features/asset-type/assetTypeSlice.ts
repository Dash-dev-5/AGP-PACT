import { z } from 'zod';
import { CreateAssetTypeSchema, DeleteAssetTypeSchema, AssetTypeSchema, UpdateAssetTypeSchema } from './assetTypeType';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { deleteRequest, getRequest, parseError, postRequest, putRequest } from 'utils/verbes';

const InitialState = z.object({
  assetTypes: z.array(AssetTypeSchema),
  status: z.enum(['idle', 'loading', 'succeeded', 'failed']),
  createStatus: z.enum(['idle', 'loading', 'succeeded', 'failed']),
  deleteStatus: z.enum(['idle', 'loading', 'succeeded', 'failed']),
  updateStatus: z.enum(['idle', 'loading', 'succeeded', 'failed']),
  error: z.string().nullable(),
  createError: z.string().nullable(),
  deleteError: z.string().nullable(),
  updateError: z.string().nullable()
});

const initialState: z.infer<typeof InitialState> = {
  assetTypes: [],
  status: 'idle',
  createStatus: 'idle',
  deleteStatus: 'idle',
  updateStatus: 'idle',
  error: null,
  createError: null,
  deleteError: null,
  updateError: null
};

export const fetchAssetTypesAsync = createAsyncThunk('assetTypes/fetchAssetTypes', async (_, { rejectWithValue }) => {
  try {
    const response = await getRequest<z.infer<typeof AssetTypeSchema>[]>('/asset-type');
    return response.data;
  } catch (error) {
    return rejectWithValue(parseError(error));
  }
});

export const createAssetTypeAsync = createAsyncThunk(
  'assetTypes/createAssetType',
  async (data: z.infer<typeof CreateAssetTypeSchema>, { rejectWithValue }) => {
    try {
      const response = await postRequest<z.infer<typeof AssetTypeSchema>>('asset-type', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(parseError(error));
    }
  }
);

export const deleteAssetTypeAsync = createAsyncThunk(
  'assetTypes/deleteAssetType',
  async (data: z.infer<typeof DeleteAssetTypeSchema>, { rejectWithValue }) => {
    try {
      const response = await deleteRequest<z.infer<typeof AssetTypeSchema>>(`/asset-type/${data.id}`, { reason: data.reason });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(parseError(error));
    }
  }
);

export const updateAssetTypeAsync = createAsyncThunk(
  'assetTypes/updateAssetType',
  async (data: z.infer<typeof UpdateAssetTypeSchema>, { rejectWithValue }) => {
    try {
      const response = await putRequest<z.infer<typeof AssetTypeSchema>>(`/asset-type/${data.id}`, { name: data.name });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(parseError(error));
    }
  }
);

export const assetTypesSlice = createSlice({
  name: 'assetTypes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssetTypesAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAssetTypesAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.assetTypes = action.payload;
      })
      .addCase(fetchAssetTypesAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });

    builder
      .addCase(createAssetTypeAsync.pending, (state) => {
        state.createStatus = 'loading';
      })
      .addCase(createAssetTypeAsync.fulfilled, (state, action) => {
        state.createStatus = 'succeeded';
        state.assetTypes.push(action.payload);
      })
      .addCase(createAssetTypeAsync.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.createError = action.payload as string;
      });

    builder
      .addCase(deleteAssetTypeAsync.pending, (state) => {
        state.deleteStatus = 'loading';
      })
      .addCase(deleteAssetTypeAsync.fulfilled, (state, action) => {
        state.deleteStatus = 'succeeded';
        state.assetTypes = state.assetTypes.filter((assetType) => assetType.id !== action.payload.id);
      })
      .addCase(deleteAssetTypeAsync.rejected, (state, action) => {
        state.deleteStatus = 'failed';
        state.deleteError = action.payload as string;
      });

    builder
      .addCase(updateAssetTypeAsync.pending, (state) => {
        state.updateStatus = 'loading';
      })
      .addCase(updateAssetTypeAsync.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        const index = state.assetTypes.findIndex((assetType) => assetType.id === action.payload.id);
        if (index !== -1) {
          state.assetTypes[index] = action.payload;
        }
      })
      .addCase(updateAssetTypeAsync.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.updateError = action.payload as string;
      });
  }
});

export default assetTypesSlice.reducer;
