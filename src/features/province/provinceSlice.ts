import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { deleteRequest, getRequest, parseError, postRequest, putRequest } from 'utils/verbes';
import { endpoints } from 'utils/endpoints';

import { AddVillage, CreateProvince, DeleteProvinceType, IProvince, IVillage, UpdateProvinceType } from './provinceType';
import { z } from 'zod';
import { provinceSchema } from './provinceValidation';

type statusType = 'idle' | 'loading' | 'succeeded' | 'failed';

type InitialState = {
  provinces: IProvince[];
  status: statusType;
  error: string | null;

  createStatus: statusType;
  createError: string | null;

  deleteStatus: statusType;
  deleteError: string | null;

  updateStatus: statusType;
  updateError: string | null;
};

const initialState: InitialState = {
  provinces: [],
  status: 'idle',
  error: null,

  createStatus: 'idle',
  createError: null,

  deleteStatus: 'idle',
  deleteError: null,

  updateStatus: 'idle',
  updateError: null
};

export const createVillage = createAsyncThunk<IVillage, AddVillage>('village/createVillage', async (newVillage, { rejectWithValue }) => {
  try {
    const response = await postRequest<IVillage>('villages', newVillage);
    return response.data;
  } catch (error) {
    return rejectWithValue(parseError(error));
  }
});

export const updateVillage = createAsyncThunk<IVillage, { id: string; village: AddVillage }>(
  'village/updateVillage',
  async (params, { rejectWithValue }) => {
    try {
      const response = await putRequest<IVillage>(`villages/${params.id}`, params.village);
      return response.data;
    } catch (error) {
      return rejectWithValue(parseError(error));
    }
  }
);

export const fetchProvinces = createAsyncThunk<IProvince[], void>('province/fetchProvince', async (_, { rejectWithValue }) => {
  try {
    const response = await getRequest<unknown>(endpoints.provinces.get); 

    const dataValidation = z.array(provinceSchema).safeParse(response.data);
    if (!dataValidation.success) {
      console.error('check provinces validation', dataValidation.error);
      throw new Error('Les données ne sont pas correctement télécharger');
    }
    return dataValidation.data;
  } catch (error) {
    return rejectWithValue(parseError(error));
  }
});

export const addProvince = createAsyncThunk<IProvince, CreateProvince>('province/addProvince', async (newProvince, { rejectWithValue }) => {
  try {
    const response = await postRequest<IProvince>(endpoints.provinces.create, newProvince);
    response.data.cities = [];
    const dataValidation = provinceSchema.safeParse(response.data);
    if (!dataValidation.success) {
      console.error('check provinces validation', dataValidation.error);
      throw new Error('Les données ne sont pas correctement télécharger');
    }
    return dataValidation.data;
  } catch (error) {
    return rejectWithValue(parseError(error));
  }
});

export const updateProvince = createAsyncThunk<IProvince, UpdateProvinceType>(
  'province/updateProvince',
  async (params, { rejectWithValue }) => {
    try {
      const response = await putRequest<IProvince>(endpoints.provinces.update(params.id), { name: params.name });
      const dataValidation = provinceSchema.safeParse(response.data);
      if (!dataValidation.success) {
        console.error('check provinces validation', dataValidation.error);
        throw new Error('Les données ne sont pas correctement télécharger');
      }
      return dataValidation.data;
    } catch (error) {
      return rejectWithValue(parseError(error));
    }
  }
);

export const deleteProvince = createAsyncThunk<string, DeleteProvinceType>(
  'province/deleteProvince',
  async (params, { rejectWithValue }) => {
    try {
      await deleteRequest(endpoints.provinces.delete(params.id), { reason: params.reason });
      return params.id;
    } catch (error) {
      return rejectWithValue(parseError(error));
    }
  }
);

const provinceSlice = createSlice({
  name: 'province',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProvinces.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProvinces.fulfilled, (state, action: PayloadAction<IProvince[]>) => {
        state.status = 'succeeded';
        state.provinces = action.payload;
      })
      .addCase(fetchProvinces.rejected, (state, action) => {
        state.status = 'failed';
        state.provinces = [];
        state.error = action.payload as string;
      });

    builder
      .addCase(addProvince.pending, (state) => {
        state.createStatus = 'loading';
        state.createError = null;
      })
      .addCase(addProvince.fulfilled, (state, action: PayloadAction<IProvince>) => {
        state.createStatus = 'succeeded';
        state.provinces.unshift(action.payload);
      })
      .addCase(addProvince.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.createError = action.payload as string;
      });

    builder
      .addCase(updateProvince.pending, (state) => {
        state.updateStatus = 'loading';
        state.updateError = null;
      })
      .addCase(updateProvince.fulfilled, (state, action: PayloadAction<IProvince>) => {
        state.updateStatus = 'succeeded';
        const index = state.provinces.findIndex((province) => province.id === action.payload.id);
        if (index !== -1) {
          state.provinces[index] = action.payload;
        }
      })
      .addCase(updateProvince.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.updateError = action.payload as string;
      });

    builder
      .addCase(deleteProvince.pending, (state) => {
        state.deleteStatus = 'loading';
        state.deleteError = null;
      })
      .addCase(deleteProvince.fulfilled, (state, action: PayloadAction<string>) => {
        state.deleteStatus = 'succeeded';
        state.provinces = state.provinces.filter((province) => province.id !== action.payload);
      })
      .addCase(deleteProvince.rejected, (state, action) => {
        state.deleteStatus = 'failed';
        state.deleteError = action.payload as string;
      });

    builder.addCase(updateVillage.fulfilled, (state, action: PayloadAction<IVillage>) => {
      const updatedVillage = action.payload;

      // Traverse provinces, cities, and sectors to locate the village
      if (state.provinces) {
        for (const province of state.provinces) {
          for (const city of province.cities) {
            for (const sector of city.sectors) {
              const villageIndex = sector.villages.findIndex((v) => v.id === updatedVillage.id);

              // If village is found, update it
              if (villageIndex !== -1) {
                sector.villages[villageIndex] = updatedVillage;
                return; // Stop the loop once the village is updated
              }
            }
          }
        }
      }
    });
  }
});

export default provinceSlice.reducer;
