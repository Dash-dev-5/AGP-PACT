import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GroupCommitees } from 'types/commitee';
import { deleteRequest, getRequest, parseError, postRequest, putRequest } from 'utils/verbes';

export interface DeleteCommiteeGroupType {
  id: string;
  reason: string;
}

export interface UpdateCommiteeGroupType {
  id: string;
  name: string;
}

type StatusType = 'idle' | 'loading' | 'succeeded' | 'failed';

interface InitialState {
  groupCommittees: GroupCommitees[];

  error: string | null;
  status: StatusType;

  createError: string | null;
  createStatus: StatusType;

  deleteError: string | null;
  deleteStatus: StatusType;

  updateError: string | null;
  updateStatus: StatusType;
}

const initialState: InitialState = {
  groupCommittees: [],

  error: null,
  status: 'idle',

  createError: null,
  createStatus: 'idle',

  updateError: null,
  updateStatus: 'idle',

  deleteError: null,
  deleteStatus: 'idle'
};

export const createGroupCommitees = createAsyncThunk<GroupCommitees, GroupCommitees>(
  'groupCommittees/createGroupCommitees',
  async (newGroupCommitees, { rejectWithValue }) => {
    try {
      const response = await postRequest<GroupCommitees>('committee-group', newGroupCommitees);
      return response.data;
    } catch (error) {
      return rejectWithValue(parseError(error));
    }
  }
);

export const fetchGroupCommitees = createAsyncThunk<GroupCommitees[]>(
  'groupCommittees/fetchGroupCommitees',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest<GroupCommitees[]>('committee-group');
      return response.data;
    } catch (error) {
      return rejectWithValue(parseError(error));
    }
  }
);

export const deleteGroupCommitees = createAsyncThunk<string, DeleteCommiteeGroupType>(
  'groupCommittees/deleteGroupCommitees',
  async (params, { rejectWithValue }) => {
    try {
      await deleteRequest(`committee-group/${params.id}`, { reason: params.reason });
      return params.id;
    } catch (error) {
      return rejectWithValue(parseError(error));
    }
  }
);

export const updateGroupCommitees = createAsyncThunk<GroupCommitees, UpdateCommiteeGroupType>(
  'groupCommittees/updateGroupCommitees',
  async (params, { rejectWithValue }) => {
    try {
      const response = await putRequest<GroupCommitees>(`committee-group/${params.id}`, { name: params.name });
      return response.data;
    } catch (error) {
      return rejectWithValue(parseError(error));
    }
  }
);

const groupCommiteesSlice = createSlice({
  name: 'groupCommittees',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createGroupCommitees.pending, (state) => {
      state.createStatus = 'loading';
      state.createError = null;
    });
    builder.addCase(createGroupCommitees.fulfilled, (state, action: PayloadAction<GroupCommitees>) => {
      state.groupCommittees.push(action.payload);
      state.createStatus = 'succeeded';
    });
    builder.addCase(createGroupCommitees.rejected, (state, action) => {
      state.createStatus = 'failed';
      state.createError = action.error.message as string;
    });

    builder.addCase(fetchGroupCommitees.pending, (state) => {
      state.status = 'loading';
      state.error = null;
    });
    builder.addCase(fetchGroupCommitees.fulfilled, (state, action: PayloadAction<GroupCommitees[]>) => {
      state.groupCommittees = action.payload;
      state.status = 'succeeded';
    });
    builder.addCase(fetchGroupCommitees.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message as string;
    });

    builder.addCase(deleteGroupCommitees.pending, (state) => {
      state.deleteStatus = 'loading';
    });
    builder.addCase(deleteGroupCommitees.fulfilled, (state, action: PayloadAction<string>) => {
      state.groupCommittees = state.groupCommittees.filter((groupCommittee) => groupCommittee.id !== action.payload);
      state.deleteStatus = 'succeeded';
    });
    builder.addCase(deleteGroupCommitees.rejected, (state) => {
      state.deleteStatus = 'failed';
    });

    builder.addCase(updateGroupCommitees.pending, (state) => {
      state.updateStatus = 'loading';
    });
    builder.addCase(updateGroupCommitees.rejected, (state) => {
      state.updateStatus = 'failed';
    });
    builder.addCase(updateGroupCommitees.fulfilled, (state, action: PayloadAction<GroupCommitees>) => {
      const index = state.groupCommittees.findIndex((groupCommittee) => groupCommittee.id === action.payload.id);
      if (index !== -1) {
        state.groupCommittees[index] = action.payload;
      }
      state.updateStatus = 'succeeded';
    });
  }
});

export default groupCommiteesSlice.reducer;
