import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IncidentCause } from './incidentCauseType';
import { getRequest, parseError } from 'utils/verbes';
import { endpoints } from 'utils/endpoints';

interface InitialState {
  incidentCauses: IncidentCause[]; 
  loading: boolean;
  error: string | null;
  
}

const initialState: InitialState = {
  incidentCauses: [],
  loading: false,
  error: null
};

/**
 * Asynchronous thunk action to fetch a list of incident causes.
 *
 * This function uses `createAsyncThunk` to define an asynchronous action
 * that retrieves incident causes from the server. It handles the API request
 * and processes the response or error accordingly.
 *
 * @returns {Promise<IncidentCause[]>} A promise that resolves to an array of incident causes.
 *
 * @throws {RejectedAction} If the API request fails, the error is parsed and returned
 *                          using `rejectWithValue`.
 */
export const fetchIncidentCausesAsync = createAsyncThunk<IncidentCause[], void>(
  'incidentCause/fetchIncidentCauses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest<IncidentCause[]>(endpoints.complaintType.main);
      console.log('########## IncidentCause ',response);
      return response.data;
    } catch (error) {
      return rejectWithValue(parseError(error));
    }
  }
);

/**
 * A Redux slice for managing the state of incident causes.
 * 
 * This slice handles the loading state, the list of incident causes, 
 * and any errors that may occur during the asynchronous fetching of incident causes.
 * 
 * - **Name**: `type`
 * - **Initial State**: `initialState`
 * - **Reducers**: No synchronous reducers are defined.
 * - **Extra Reducers**:
 *   - Handles the `fetchIncidentCausesAsync.pending` action to set the loading state to `true`.
 *   - Handles the `fetchIncidentCausesAsync.fulfilled` action to populate the `incidentCauses` state with the fetched data and set the loading state to `false`.
 *   - Handles the `fetchIncidentCausesAsync.rejected` action to capture the error message and set the loading state to `false`.
 * 
 * @see {@link https://redux-toolkit.js.org/api/createSlice | Redux Toolkit createSlice API}
 */
const incidentCauseSlice = createSlice({
  name: 'type',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIncidentCausesAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchIncidentCausesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.incidentCauses = action.payload;
      })
      .addCase(fetchIncidentCausesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      });
  }
});

export const { reducer: incidentCauseReducer } = incidentCauseSlice;
