import { z } from 'zod';
import { CreateUnitSchema, DeleteUnitSchema, UnitSchema, UpdateUnitSchema } from './unitsType';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { deleteRequest, getRequest, parseError, postRequest, putRequest } from 'utils/verbes';

const InitialState = z.object({
  units: z.array(UnitSchema),
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
  units: [],
  status: 'idle',
  createStatus: 'idle',
  deleteStatus: 'idle',
  updateStatus: 'idle',
  error: null,
  createError: null,
  deleteError: null,
  updateError: null
};

export const fetchUnitsAsync = createAsyncThunk('units/fetchUnits', async (_, { rejectWithValue }) => {
  try {
    const response = await getRequest<z.infer<typeof UnitSchema>[]>('/units');
    return response.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const createUnitAsync = createAsyncThunk('units/createUnit', async (data: z.infer<typeof CreateUnitSchema>, { rejectWithValue }) => {
  try {
    const response = await postRequest<z.infer<typeof UnitSchema>>('units', data);
    return response.data;
  } catch (error) {
    return rejectWithValue(parseError(error));
  }
});

export const deleteUnitAsync = createAsyncThunk('units/deleteUnit', async (data: z.infer<typeof DeleteUnitSchema>, { rejectWithValue }) => {
  try {
    await deleteRequest<z.infer<typeof UnitSchema>>(`/units/${data.id}`, { reason: data.reason });
    return data.id;
  } catch (error) {
    return rejectWithValue(parseError(error));
  }
});

export const updateUnitAsync = createAsyncThunk('units/updateUnit', async (data: z.infer<typeof UpdateUnitSchema>, { rejectWithValue }) => {
  try {
    const response = await putRequest<z.infer<typeof UnitSchema>>(`/units/${data.id}`, { name: data.name });
    return response.data;
  } catch (error) {
    return rejectWithValue(parseError(error));
  }
});

export const unitsSlice = createSlice({
  name: 'units',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUnitsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUnitsAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.units = action.payload;
      })
      .addCase(fetchUnitsAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });

    builder
      .addCase(createUnitAsync.pending, (state) => {
        state.createStatus = 'loading';
      })
      .addCase(createUnitAsync.fulfilled, (state, action) => {
        state.createStatus = 'succeeded';
        state.units.push(action.payload);
      })
      .addCase(createUnitAsync.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.createError = action.payload as string;
      });

    builder
      .addCase(deleteUnitAsync.pending, (state) => {
        state.deleteStatus = 'loading';
      })
      .addCase(deleteUnitAsync.fulfilled, (state, action) => {
        state.deleteStatus = 'succeeded';
        state.units = state.units.filter((unit) => unit.id !== action.payload);
      })
      .addCase(deleteUnitAsync.rejected, (state, action) => {
        state.deleteStatus = 'failed';
        state.deleteError = action.payload as string;
      });

    builder
      .addCase(updateUnitAsync.pending, (state) => {
        state.updateStatus = 'loading';
      })
      .addCase(updateUnitAsync.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        const index = state.units.findIndex((unit) => unit.id === action.payload.id);
        if (index !== -1) {
          state.units[index] = action.payload;
        }
      })
      .addCase(updateUnitAsync.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.updateError = action.payload as string;
      });
  }
});

export default unitsSlice.reducer;
