import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ResponsibleEntity } from './responsibleEntityType';
import { getRequest, parseError } from 'utils/verbes';
import { endpoints } from 'utils/endpoints';

interface InitialState {
  responsibleEntities: ResponsibleEntity[];
  loading: boolean;
  error: string | null;
}

const initialState: InitialState = {
  responsibleEntities: [],
  loading: false,
  error: null
};

export const fetchResponsibleEntitiesAsync = createAsyncThunk<ResponsibleEntity[], void>(
  'responsibleEntity/fetchResponsibleEntities',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest<ResponsibleEntity[]>(endpoints.responsibleEntity.main);
      return response.data;
    } catch (error) {
      return rejectWithValue(parseError(error));
    }
  }
);

const responsibleEntitySlice = createSlice({
  name: 'responsibleEntity',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchResponsibleEntitiesAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchResponsibleEntitiesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.responsibleEntities = action.payload;
      })
      .addCase(fetchResponsibleEntitiesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      });
  }
});

export const { reducer: responsibleEntityReducer } = responsibleEntitySlice;
