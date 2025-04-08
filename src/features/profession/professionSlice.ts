import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { endpoints } from 'utils/endpoints';
import { getRequest, parseError } from 'utils/verbes';

export interface IProfession {
  name: string;
  id: string;
  slug?: string | null;
  referenceNumber: string;
}

interface InitialState {
  professions: IProfession[];
}

export const initialState: InitialState = {
  professions: []
};

export const fetchProfession = createAsyncThunk<IProfession[], void>('profession/fetchProfession', async (_, { rejectWithValue }) => {
  try {
    const response = await getRequest<IProfession[]>(endpoints.profession.get);
    return response.data;
  } catch (error) {
    return rejectWithValue(parseError(error));
  }
});

const professionSlice = createSlice({
  name: 'profession',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProfession.fulfilled, (state, action) => {
      const autres = action.payload.find((profession) => profession.name === 'Autres');
      const others = action.payload.filter((profession) => profession.name !== 'Autres');

      if (autres) {
        state.professions = [...others, autres];
      } else {
        state.professions = action.payload;
      }
    });
  }
});

export default professionSlice.reducer;
