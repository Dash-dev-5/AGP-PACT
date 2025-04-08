import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { postFormDataRequest, getRequest, parseError, postRequest, deleteRequest, patchRequest, putRequest } from 'utils/verbes';
import { ImportPapFormData, PapType, CreatePap, DeletePapType, UpdatePapType, FetchPapType } from './papTypes';

/* -------------------------------------------------------------------------- */
/*                                ZOD SCHEMAS                                 */
/* -------------------------------------------------------------------------- */

type PapListType = {
  pageSize: number;
  currentPage: number;
  totalItems: number;
  data: PapType[];
};

type PapState = {
  papList: PapType[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  deleteStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  deleteError: string | null;
  singlePap: PapType | undefined;
};

const initialState: PapState = {
  papList: [],
  currentPage: 0,
  pageSize: 10,
  totalItems: 0,
  status: 'idle',
  error: null,
  deleteStatus: 'idle',
  deleteError: null,
  singlePap: undefined
};

/* -------------------------------------------------------------------------- */
/*                             ASYNC THUNKS                                   */
/* -------------------------------------------------------------------------- */

// Fetch all PAP data from the API
export const fetchPapAsync = createAsyncThunk<PapListType, FetchPapType>('pap/fetchPap', async (params, { rejectWithValue }) => {
  try {
    const response = await getRequest<PapListType>('/pap', params); // Adjust API endpoint as needed
    console.log(response.data);

    return response.data;
  } catch (error) {
    return rejectWithValue(parseError(error));
  }
});

// Fetch a single PAP entry by ID
export const fetchPapByIdAsync = createAsyncThunk<PapType, string>('pap/fetchPapById', async (id, { rejectWithValue }) => {
  try {
    const response = await getRequest<PapType>(`/pap/${id}`); // Adjust API endpoint as needed
    return response.data;
  } catch (error) {
    return rejectWithValue(parseError(error));
  }
});

// Create a new PAP entry
export const createPapAsync = createAsyncThunk<PapType, CreatePap>('pap/createPap', async (newPap, { rejectWithValue }) => {
  try {
    const response = await postRequest<PapType>('/pap', newPap); // Adjust API endpoint as needed
    return response.data;
  } catch (error) {
    return rejectWithValue(parseError(error));
  }
});

// Upload an Excel file to generate PAP data
export const createPapFileAsync = createAsyncThunk<void, ImportPapFormData>('pap/createPapFile', async ({ excel }, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append('file', excel);

    // Make POST request with multipart/form-data
    await postFormDataRequest<void>('/pap/import/excel', formData); // Adjust API endpoint as needed
  } catch (error) {
    return rejectWithValue(parseError(error));
  }
});

// Update a PAP entry
export const updatePapAsync = createAsyncThunk<PapType, UpdatePapType>('pap/updatePap', async (params, { rejectWithValue }) => {
  try {
    const response = await putRequest<PapType>(`/pap/${params.id}`, params.data); // Adjust API endpoint as needed
    return response.data;
  } catch (error) {
    return rejectWithValue(parseError(error));
  }
});

// Delete a PAP entry
export const deletePapAsync = createAsyncThunk<string, DeletePapType>('pap/deletePap', async (params, { rejectWithValue }) => {
  try {
    await deleteRequest<void>(`/pap/${params.id}`, { reason: params.reason }); // Adjust API endpoint as needed
    return params.id;
  } catch (error) {
    return rejectWithValue(parseError(error));
  }
});

/* -------------------------------------------------------------------------- */
/*                               PAP SLICE                                    */
/* -------------------------------------------------------------------------- */
const papSlice = createSlice({
  name: 'pap',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    /* -------------------- FETCH PAP DATA -------------------- */
    builder
      .addCase(fetchPapAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPapAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.papList = action.payload.data;
        state.pageSize = action.payload.pageSize;
        state.currentPage = action.payload.currentPage;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(fetchPapAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });

    /* -------------------- FETCH PAP BY ID -------------------- */
    builder
      .addCase(fetchPapByIdAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPapByIdAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.singlePap = action.payload;
      })
      .addCase(fetchPapByIdAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });

    /* -------------------- CREATE PAP FILE -------------------- */
    builder
      .addCase(createPapFileAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createPapFileAsync.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(createPapFileAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });

    /* -------------------- CREATE PAP -------------------- */
    builder
      .addCase(createPapAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createPapAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.papList.push(action.payload);
      })
      .addCase(createPapAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });

    /* -------------------- DELETE PAP -------------------- */
    builder
      .addCase(deletePapAsync.pending, (state) => {
        state.deleteStatus = 'loading';
        state.deleteError = null;
      })
      .addCase(deletePapAsync.fulfilled, (state, action) => {
        state.deleteStatus = 'succeeded';
        state.papList = state.papList.filter((pap) => pap.id !== action.payload);
      })
      .addCase(deletePapAsync.rejected, (state, action) => {
        state.deleteStatus = 'failed';
        state.deleteError = action.payload as string;
      });

    /* -------------------- UPDATE PAP -------------------- */
    builder
      .addCase(updatePapAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updatePapAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.papList.findIndex((pap) => pap.id === action.payload.id);
        if (index !== -1) {
          state.papList[index] = action.payload;
        }
      })
      .addCase(updatePapAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  }
});

export default papSlice.reducer;
