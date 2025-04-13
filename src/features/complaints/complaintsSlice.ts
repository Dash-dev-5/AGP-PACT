import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { getRequest, parseError, postRequest } from 'utils/verbes';

export interface Plaintes {
  typeSend: string;
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
  prejudice: string;
  site: string;
  type: string;
  repairType: string;
  responsibleEntity: string;
  victims: Victim[];
  species: Species[];
  complainant: Complainant;
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
  province: string;
  city: string;
  sector: string;
  village: string;
  vulnerabilityLevel: string;
}

export interface Species {
  quantity: number;
  species: string;
}

export interface Complainant {
  firstName: string;
  lastName: string;
  middleName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  fullName: string;
  legalPersonality: string;
  organizationStatus: string;
  province: string;
  city: string;
  sector: string;
  village: string;
  profession: string;
  username?: string;
  password?: string;
}

interface Plainte {
  plainteData: Plaintes[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

const initialState: Plainte = {
  plainteData: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 0,
  pageSize: 10
};

export const addComplaint = createAsyncThunk('addComplaint', async (newPlainte: Plaintes, { rejectWithValue }) => {
  try {
    const response = await postRequest<Plaintes>('users/complainant', newPlainte);

    return response.data;
  } catch (error: any) {
    return rejectWithValue(parseError(error));
  }
});

export const getPlaintes = createAsyncThunk('getPlaintes', async (idSchool: string, { rejectWithValue }) => {
  try {
    const response = await getRequest<Plaintes[]>(`accounts/Plaintes/schools/${idSchool}`);

    return response.data;
  } catch (error: any) {
    return rejectWithValue(parseError(error));
  }
});

const complaintsSlice = createSlice({
  name: 'Plainte',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(addComplaint.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addComplaint.fulfilled, (state, action: PayloadAction<Plaintes>) => {
      state.loading = false;
      state.plainteData.push(action.payload);
      // toast.success("Plainte created successfully");
    });
    builder.addCase(addComplaint.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      // toast.error(state.error);
    });
    builder.addCase(getPlaintes.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getPlaintes.fulfilled, (state, action: PayloadAction<Plaintes[]>) => {
      state.loading = false;
      state.plainteData = action.payload;
    });
    builder.addCase(getPlaintes.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  }
});

export default complaintsSlice.reducer;
