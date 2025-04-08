import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Commitees, CommitteesWithPagging, FetchCommiteeType } from 'types/commitee';
import { deleteRequest, getRequest, parseError, postRequest, putRequest } from 'utils/verbes';

export type CreateCommittee = Omit<Commitees, 'id'>;

export interface UpdateCommiteeType {
  id: string;
  name: string;
  group: string;
}

export interface DeleteCommiteeType {
  id: string;
  reason: string;
}
type StatusType = 'idle' | 'loading' | 'succeeded' | 'failed';

interface InitialState {
  committees: CommitteesWithPagging;
  error: string | null;
  status: StatusType;

  createStatus: StatusType;
  createError: string | null;

  updateStatus: StatusType;
  deleteStatus: StatusType;
}

const initialState: InitialState = {
  committees: {
    pageSize: 0,
    currentPage: 1,
    totalItems: 0,
    data: []
  },
  error: null,
  status: 'idle',

  createError: null,
  createStatus: 'idle',

  updateStatus: 'idle',
  deleteStatus: 'idle'
};

export const createCommitteeAsync = createAsyncThunk<Commitees, CreateCommittee>(
  'committee/createCommittee',
  async (committee: CreateCommittee, { rejectWithValue }) => {
    try {
      const response = await postRequest<Commitees>('committees', committee);
      return response.data;
    } catch (error) {
      return rejectWithValue(parseError(error));
    }
  }
);

// Action to retrieve committees with pagination and filtering
export const fetchCommitteesAsync = createAsyncThunk<CommitteesWithPagging, FetchCommiteeType>(
  'committee/fetchCommittees',
  async (params, { rejectWithValue }) => {
    try {
      const response = await getRequest<CommitteesWithPagging>('committees', params);
      return response.data;
    } catch (error) {
      return rejectWithValue(parseError(error));
    }
  }
);

export const updateCommittee = createAsyncThunk<Commitees, UpdateCommiteeType>(
  'committee/updateCommittee',
  async (params, { rejectWithValue }) => {
    try {
      // console.log({ name: params.name, group: params.group });
      // console.log(params.id);

      const response = await putRequest<Commitees>(`committees/${params.id}`, { name: params.name, group: params.group });
      return response.data;
    } catch (error) {
      return rejectWithValue(parseError(error));
    }
  }
);

export const deleteCommittee = createAsyncThunk<string, DeleteCommiteeType>(
  'committee/deleteCommittee',
  async (params, { rejectWithValue }) => {
    try {
      await deleteRequest(`committees/${params.id}`, { reason: params.reason });

      return params.id;
    } catch (error) {
      return rejectWithValue(parseError(error));
    }
  }
);

const committeeSlice = createSlice({
  name: 'committee',
  initialState,
  reducers: {
    setCurrentPage(state, action: PayloadAction<number>) {
      state.committees.currentPage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCommitteeAsync.pending, (state) => {
        state.createStatus = 'loading';
        state.error = null;
      })
      .addCase(createCommitteeAsync.fulfilled, (state, action: PayloadAction<Commitees>) => {
        state.createStatus = 'succeeded';
        if (state.committees) {
          state.committees.data.push(action.payload);
          state.committees.totalItems += 1;
        }
      })
      .addCase(createCommitteeAsync.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.createError = action.payload as string;
      });

    builder
      .addCase(fetchCommitteesAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCommitteesAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.committees = action.payload;
      })
      .addCase(fetchCommitteesAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });

    builder
      .addCase(updateCommittee.pending, (state) => {
        state.updateStatus = 'loading';
      })
      .addCase(updateCommittee.rejected, (state) => {
        state.updateStatus = 'failed';
      })
      .addCase(updateCommittee.fulfilled, (state, action: PayloadAction<Commitees>) => {
        const index = state.committees.data.findIndex((committee: Commitees) => committee.id === action.payload.id);
        if (index !== -1) {
          state.committees.data[index] = action.payload;
        }
        state.updateStatus = 'succeeded';
      });

    builder.addCase(deleteCommittee.pending, (state) => {
      state.deleteStatus = 'loading';
    });

    builder.addCase(deleteCommittee.fulfilled, (state, action: PayloadAction<string>) => {
      state.committees.data = state.committees.data.filter((committee: Commitees) => committee.id !== action.payload);
      state.committees.totalItems -= 1;
      state.deleteStatus = 'succeeded';
    });

    builder.addCase(deleteCommittee.rejected, (state) => {
      state.deleteStatus = 'failed';
    });
  }
});

export const { setCurrentPage } = committeeSlice.actions;
export default committeeSlice.reducer;
