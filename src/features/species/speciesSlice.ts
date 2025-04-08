import { z } from 'zod';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  CreateSpeciesSchema,
  DeleteSpeciesSchema,
  CreateSpeciesPriceSchema,
  SpeciesSchema,
  updateSpeciesSchema,
  PriceSchema
} from './SpeciesTypes';
import { deleteRequest, getRequest, parseError, postRequest, putRequest } from 'utils/verbes';
import { AssetTypeSchema } from 'features/asset-type/assetTypeType';

interface InitialState {
  speciesList: z.infer<typeof SpeciesSchema>[];
  oneSpecies: z.infer<typeof SpeciesSchema> | null;
  speciesTypeList: z.infer<typeof SpeciesSchema>[];

  speciesTypeStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  speciesTypeError: string | null;

  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  createStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  createError: string | null;

  fetchOneError: string | null;
  fetchOneStatus: 'idle' | 'loading' | 'succeeded' | 'failed';

  updateStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  updateError: string | null;
  deleteStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  deleteError: string | null;

  createPriceStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  createPriceError: string | null;

  updatePriceStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  updatePriceError: string | null;

  deletePriceStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  deletePriceError: string | null;
}

const initialState: InitialState = {
  speciesList: [],
  oneSpecies: null,
  status: 'idle',
  error: null,
  speciesTypeList: [],

  speciesTypeStatus: 'idle',
  speciesTypeError: null,

  createStatus: 'idle',
  createError: null,
  updateStatus: 'idle',
  updateError: null,
  deleteStatus: 'idle',
  deleteError: null,

  fetchOneError: null,
  fetchOneStatus: 'idle',

  createPriceStatus: 'idle',
  createPriceError: null,

  updatePriceStatus: 'idle',
  updatePriceError: null,

  deletePriceStatus: 'idle',
  deletePriceError: null
};

export const createSpeciesAsync = createAsyncThunk<z.infer<typeof SpeciesSchema>, z.infer<typeof CreateSpeciesSchema>>(
  'species/createSpecies',
  async (species, { rejectWithValue }) => {
    try {
      const response = await postRequest<z.infer<typeof SpeciesSchema>>('asset-species', species);
      return response.data;
    } catch (error) {
      return rejectWithValue(parseError(error));
    }
  }
);

// Async thunk to fetch all species without pagination
export const fetchSpeciesAsync = createAsyncThunk<z.infer<typeof SpeciesSchema>[], void>(
  'species/fetchSpecies',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest<z.infer<typeof SpeciesSchema>[]>('asset-species');
      return response.data;
    } catch (error) {
      return rejectWithValue(parseError(error));
    }
  }
);

export const updateSpeciesAsync = createAsyncThunk<z.infer<typeof SpeciesSchema>, z.infer<typeof updateSpeciesSchema>>(
  'species/updateSpecies',
  async (data, { rejectWithValue }) => {
    try {
      const response = await putRequest<z.infer<typeof SpeciesSchema>>(`asset-species/${data.id}`, data.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(parseError(error));
    }
  }
);

export const deleteSpeciesAsync = createAsyncThunk(
  'units/deleteUnit',
  async (data: z.infer<typeof DeleteSpeciesSchema>, { rejectWithValue }) => {
    try {
      await deleteRequest<z.infer<typeof SpeciesSchema>>(`asset-species/${data.id}`, { reason: data.reason });
      return data.id;
    } catch (error: any) {
      return rejectWithValue(parseError(error));
    }
  }
);

export const fetchOneSpeciesAsync = createAsyncThunk<z.infer<typeof SpeciesSchema>, string>(
  'species/fetchOneSpecies',
  async (id, { rejectWithValue }) => {
    try {
      const response = await getRequest<z.infer<typeof SpeciesSchema>>(`asset-species/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(parseError(error));
    }
  }
);

// Async thunk to create a species price
export const createSpeciesPriceAsync = createAsyncThunk<z.infer<typeof PriceSchema>, z.infer<typeof CreateSpeciesPriceSchema>>(
  'species/createSpeciesPrice',
  async (speciesPrice, { rejectWithValue }) => {
    try {
      const response = await postRequest<z.infer<typeof PriceSchema>>('asset-species/prices', speciesPrice);
      return response.data;
    } catch (error) {
      return rejectWithValue(parseError(error));
    }
  }
);

export const deleteSpeciesPriceAsync = createAsyncThunk('species/deleteSpeciesPrice', async (id: string, { rejectWithValue }) => {
  try {
    await deleteRequest(`asset-species/prices/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(parseError(error));
  }
});

export const fetchSpeciesTypeAsync = createAsyncThunk<z.infer<typeof SpeciesSchema>[], string>(
  'species/fetchSpeciesType',
  async (id, { rejectWithValue }) => {
    try {
      const response = await getRequest<z.infer<typeof SpeciesSchema>[]>(`/asset-species/asset-type/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(parseError(error));
    }
  }
);

const speciesSlice = createSlice({
  name: 'species',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createSpeciesAsync.pending, (state) => {
        state.createStatus = 'loading';
        state.createError = null;
      })
      .addCase(createSpeciesAsync.fulfilled, (state, action) => {
        state.createStatus = 'succeeded';
        state.speciesList.unshift(action.payload);
      })
      .addCase(createSpeciesAsync.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.createError = action.payload as string;
      });

    builder
      .addCase(fetchSpeciesAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSpeciesAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.speciesList = action.payload;
      })
      .addCase(fetchSpeciesAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });

    builder
      .addCase(updateSpeciesAsync.pending, (state) => {
        state.updateStatus = 'loading';
        state.updateError = null;
      })
      .addCase(updateSpeciesAsync.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        const index = state.speciesList.findIndex((species) => species.id === action.payload.id);
        state.speciesList[index] = action.payload;
      })
      .addCase(updateSpeciesAsync.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.updateError = action.payload as string;
      });

    builder
      .addCase(deleteSpeciesAsync.pending, (state) => {
        state.deleteStatus = 'loading';
        state.deleteError = null;
      })
      .addCase(deleteSpeciesAsync.fulfilled, (state, action) => {
        state.deleteStatus = 'succeeded';
        state.speciesList = state.speciesList.filter((species) => species.id !== action.payload);
      })
      .addCase(deleteSpeciesAsync.rejected, (state, action) => {
        state.deleteStatus = 'failed';
        state.deleteError = action.payload as string;
      });

    builder
      .addCase(fetchOneSpeciesAsync.pending, (state) => {
        state.fetchOneStatus = 'loading';
        state.fetchOneError = null;
      })
      .addCase(fetchOneSpeciesAsync.fulfilled, (state, action) => {
        state.fetchOneStatus = 'succeeded';
        state.oneSpecies = action.payload;
      })
      .addCase(fetchOneSpeciesAsync.rejected, (state, action) => {
        state.fetchOneStatus = 'failed';
        state.fetchOneError = action.payload as string;
      });

    builder
      .addCase(createSpeciesPriceAsync.pending, (state) => {
        state.createPriceStatus = 'loading';
        state.createPriceError = null;
      })
      .addCase(createSpeciesPriceAsync.fulfilled, (state, action) => {
        state.createPriceStatus = 'succeeded';

        if (state.oneSpecies) {
          state.oneSpecies.prices = [...state.oneSpecies.prices, action.payload];
        }
      })
      .addCase(createSpeciesPriceAsync.rejected, (state, action) => {
        state.createPriceStatus = 'failed';
        state.createPriceError = action.payload as string;
      });

    builder
      .addCase(fetchSpeciesTypeAsync.pending, (state) => {
        state.speciesTypeStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchSpeciesTypeAsync.fulfilled, (state, action) => {
        state.speciesTypeStatus = 'succeeded';
        const autres = action.payload.find((species) => species.name === 'Autres');
        const others = action.payload.filter((species) => species.name !== 'Autres');

        if (autres) {
          state.speciesTypeList = [...others, autres];
        } else {
          state.speciesTypeList = action.payload;
        }
      })
      .addCase(fetchSpeciesTypeAsync.rejected, (state, action) => {
        state.speciesTypeStatus = 'failed';
        state.error = action.payload as string;
      });
  }
});

export default speciesSlice.reducer;
