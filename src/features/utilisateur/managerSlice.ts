import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Manager } from 'types/auth';
import { getRequest, parseError, postRequest } from 'utils/verbes';

export type CreateManager = Omit<Manager, 'id'>;

interface InitialState {
  managers: Manager[];
  isLoading: boolean;
  error: string | null;
  totalItems: number;
  currentPage: number;
}

const initialState: InitialState = {
  managers: [],
  isLoading: false,
  error: null,
  totalItems: 0,
  currentPage: 1
};

export const createManagerAsync = createAsyncThunk<Manager, CreateManager>(
  'manager/createManager',
  async (manager: CreateManager, { rejectWithValue }) => {
    try {
      const response = await postRequest<Manager>('users/manager', manager);
      return response.data;
    } catch (error) {
      return rejectWithValue(parseError(error));
    }
  }
);

export const fetchManagersAsync = createAsyncThunk<
  { managers: Manager[]; totalItems: number; currentPage: number },
  { pageSize: number; currentPage: number; filter?: string }
>('manager/fetchManagers', async ({ pageSize, currentPage, filter }, { rejectWithValue }) => {
  try {
    const url = `users/manager?pageNo=${currentPage}&pageSize=${pageSize}${filter ? `&filter=${encodeURIComponent(filter)}` : ''}`;
    const response = await getRequest<{ data: Manager[]; totalItems: number; currentPage: number }>(url);
    return { managers: response.data.data, totalItems: response.data.totalItems, currentPage: response.data.currentPage };
  } catch (error) {
    return rejectWithValue(parseError(error));
  }
});

const managerSlice = createSlice({
  name: 'manager',
  initialState,
  reducers: {
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createManagerAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createManagerAsync.fulfilled, (state, action: PayloadAction<Manager>) => {
        state.isLoading = false;
        state.managers.push(action.payload);
      })
      .addCase(createManagerAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchManagersAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchManagersAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.managers = action.payload.managers;
        state.totalItems = action.payload.totalItems;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchManagersAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});
export const { setCurrentPage } = managerSlice.actions;
export default managerSlice.reducer;
