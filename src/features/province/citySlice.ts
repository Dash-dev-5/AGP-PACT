import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { deleteRequest, getRequest, parseError, postRequest, putRequest } from 'utils/verbes';
import { endpoints } from 'utils/endpoints';

import { CreateCity, DeleteCityType, ICity, IProvince, UpdateCityType } from './provinceType';
import { z } from 'zod';
import { citySchema, provinceSchema } from './provinceValidation';

type statusType = 'idle' | 'loading' | 'succeeded' | 'failed';

type InitialState = {
  cities: ICity[];
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
  cities: [],
  status: 'idle',
  error: null,

  createStatus: 'idle',
  createError: null,

  deleteStatus: 'idle',
  deleteError: null,

  updateStatus: 'idle',
  updateError: null
};

export const fetchCitiesByProvince = createAsyncThunk<ICity[], string>('city/fetchCity', async (id, { rejectWithValue }) => {
  try {
    const response = await getRequest<unknown>(endpoints.cities.getByProvince(id));

    const dataValidation = z.array(citySchema).safeParse(response.data);
    if (!dataValidation.success) {
      console.error('check cities validation', dataValidation.error);
      throw new Error('Les données ne sont pas correctement télécharger');
    }
    return dataValidation.data;
  } catch (error) {
    return rejectWithValue(parseError(error));
  }
});

export const addCity = createAsyncThunk<ICity, CreateCity>('city/addCity', async (newCity, { rejectWithValue }) => {
  try {
    const response = await postRequest<ICity>(endpoints.cities.create, newCity);
    response.data.sectors = [];
    const dataValidation = citySchema.safeParse(response.data);
    if (!dataValidation.success) {
      console.error('check cities validation', dataValidation.error);
      throw new Error('Les données ne sont pas correctement télécharger');
    }
    return dataValidation.data;
  } catch (error) {
    return rejectWithValue(parseError(error));
  }
});

export const updateCity = createAsyncThunk<ICity, UpdateCityType>('city/updateCity', async (params, { rejectWithValue }) => {
  try {
    const response = await putRequest<ICity>(endpoints.cities.update(params.id), { name: params.name, province: params.province });
    const dataValidation = citySchema.safeParse(response.data);
    if (!dataValidation.success) {
      console.error('check cities validation', dataValidation.error);
      throw new Error('Les données ne sont pas correctement télécharger');
    }
    return dataValidation.data;
  } catch (error) {
    return rejectWithValue(parseError(error));
  }
});

export const deleteCity = createAsyncThunk<string, DeleteCityType>('city/deleteCity', async (params, { rejectWithValue }) => {
  try {
    await deleteRequest(endpoints.cities.delete(params.id), { reason: params.reason });
    return params.id;
  } catch (error) {
    return rejectWithValue(parseError(error));
  }
});

const citySlice = createSlice({
  name: 'city',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCitiesByProvince.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCitiesByProvince.fulfilled, (state, action: PayloadAction<ICity[]>) => {
        state.status = 'succeeded';
        state.cities = action.payload;
      })
      .addCase(fetchCitiesByProvince.rejected, (state, action) => {
        state.status = 'failed';
        state.cities = [];
        state.error = action.payload as string;
      });

    builder
      .addCase(addCity.pending, (state) => {
        state.createStatus = 'loading';
        state.createError = null;
      })
      .addCase(addCity.fulfilled, (state, action: PayloadAction<ICity>) => {
        state.createStatus = 'succeeded';
        state.cities.unshift(action.payload);
      })
      .addCase(addCity.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.createError = action.payload as string;
      });

    builder
      .addCase(deleteCity.pending, (state) => {
        state.deleteStatus = 'loading';
        state.deleteError = null;
      })
      .addCase(deleteCity.fulfilled, (state, action: PayloadAction<string>) => {
        state.deleteStatus = 'succeeded';
        state.cities = state.cities.filter((city) => city.id !== action.payload);
      })
      .addCase(deleteCity.rejected, (state, action) => {
        state.deleteStatus = 'failed';
        state.deleteError = action.payload as string;
      });
  }
});

export default citySlice.reducer;
