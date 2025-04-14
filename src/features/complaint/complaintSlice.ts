import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Complaint, CreateComplaint } from './complaintType';
import { getRequest, parseError, postRequest } from 'utils/verbes';
import { endpoints } from 'utils/endpoints';
import { WithPaggination } from 'features/complainant/complainantType';

interface InitialState {
  complaints: WithPaggination<Complaint>;
  oneComplaint: Complaint | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: InitialState = {
  complaints: {
    currentPage: 0,
    pageSize: 0,
    totalItems: 0,
    data: []
  },
  isLoading: false,
  error: null,
  oneComplaint: null
};

export const createComplaint = createAsyncThunk<Complaint, CreateComplaint>(
  'complaint/createComplaint',
  async (newComplaint, { rejectWithValue }) => {
    try {
      const response = await postRequest<Complaint>(endpoints.complaint.main, newComplaint);
      return response.data;
    } catch (error) {
      return rejectWithValue(parseError(error));
    }
  }
);

export const fetchComplaints = createAsyncThunk<
  WithPaggination<Complaint>,
  { pageSize?: number; currentPage?: number; filter?: string; village?: string; site?: string }
>('complaint/fetchComplaint', async ({ pageSize, currentPage, filter, village, site }, { rejectWithValue }) => {
  let url = `${endpoints.complaint.main}?pageNo=${currentPage}&pageSize=${pageSize}`;
  if (filter) url += `&filter=${filter}`;
  if (village) url += `&village=${village}`;
  if (site) url += `&site=${site}`;
  try {
    const response = await getRequest<WithPaggination<Complaint>>(url);
    console.log('#### response', response);
    return response.data;
  } catch (error) {
    return rejectWithValue(parseError(error));
  }
});

// Fetch a single complaint by its ID
export const fetchComplaintById = createAsyncThunk<Complaint, string>('complaint/fetchComplaintById', async (id, { rejectWithValue }) => {
  try {
    const response = await getRequest<Complaint>(`${endpoints.complaint.main}/${id}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(parseError(error));
  }
});

const complaintSlice = createSlice({
  name: 'complaint',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createComplaint.fulfilled, (state, action: PayloadAction<Complaint>) => {
      state.complaints.data.push(action.payload);
    });
    builder.addCase(fetchComplaints.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder
      .addCase(fetchComplaints.fulfilled, (state, action: PayloadAction<WithPaggination<Complaint>>) => {
        state.complaints = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchComplaints.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    // Handle fetching a single complaint by its ID
    builder.addCase(fetchComplaintById.fulfilled, (state, action: PayloadAction<Complaint>) => {
      state.oneComplaint = action.payload;
    });
  }
});

export default complaintSlice.reducer;
