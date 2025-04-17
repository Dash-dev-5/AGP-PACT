import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { getRequest, parseError, postRequest } from 'utils/verbes';

export interface Complaint {
  description: string;
  latitude: string;
  longitude: string;
  incidentStartDate: string;
  incidentEndDate: string;
  addressLine1: string;
  addressLine2: string;
  isComplainantAffected: string;
  province: string;
  city: string;
  sector: string;
  village: string;
  type: string;
  victims: Victim[];
  species: Species[];
}

export interface Victim {
  firstName: string;
  lastName: string;
  middleName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  relationshipToComplainant: string;
  vulnerabilityLevel: string;
}

export interface Species {
  quantity: number;
  species: string;
}

interface Complaints {
  complaintData: Complaint[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

const initialState: Complaints = {
  complaintData: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 0,
  pageSize: 10
};

export const addAnonymousComplaint = createAsyncThunk('addComplaint', async (newComplaint: Complaint, { rejectWithValue }) => {
  try {
    const response = await postRequest<Complaint>('complaints/anonymous', newComplaint);

    return response.data;
  } catch (error) {
    return rejectWithValue(parseError(error));
  }
});

const anonymousComplaintSlice = createSlice({
  name: 'Complaints',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(addAnonymousComplaint.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addAnonymousComplaint.fulfilled, (state, action: PayloadAction<Complaint>) => {
      state.loading = false;
      state.complaintData.push(action.payload);
      toast.success('Plainte envoyer avec succès', { autoClose: 2000 });
    });
    builder.addCase(addAnonymousComplaint.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      toast.error(state.error);
    });
  }
});

export default anonymousComplaintSlice.reducer;
