import { z } from 'zod';
import { CreateProjectSiteSchema, DeleteProjectSiteSchema, ProjectSiteSchema, UpdateProjectSiteSchema } from './projectSiteType';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { deleteRequest, getRequest, parseError, postRequest, putRequest } from 'utils/verbes';

const InitialState = z.object({
  projectSites: z.array(ProjectSiteSchema),
  status: z.enum(['idle', 'loading', 'succeeded', 'failed']),
  createStatus: z.enum(['idle', 'loading', 'succeeded', 'failed']),
  deleteStatus: z.enum(['idle', 'loading', 'succeeded', 'failed']),
  updateStatus: z.enum(['idle', 'loading', 'succeeded', 'failed']),
  error: z.string().nullable(),
  createError: z.string().nullable(),
  deleteError: z.string().nullable(),
  updateError: z.string().nullable()
});

const initialState: z.infer<typeof InitialState> = {
  projectSites: [],
  status: 'idle',
  createStatus: 'idle',
  deleteStatus: 'idle',
  updateStatus: 'idle',
  error: null,
  createError: null,
  deleteError: null,
  updateError: null
};

export const fetchProjectSitesAsync = createAsyncThunk('projectSites/fetchProjectSites', async (_, { rejectWithValue }) => {
  try {
    const response = await getRequest<z.infer<typeof ProjectSiteSchema>[]>('/project-site');
    return response.data;
  } catch (error) {
    return rejectWithValue(parseError(error));
  }
});

export const createProjectSiteAsync = createAsyncThunk(
  'projectSites/createProjectSite',
  async (data: z.infer<typeof CreateProjectSiteSchema>, { rejectWithValue }) => {
    try {
      const response = await postRequest<z.infer<typeof ProjectSiteSchema>>('project-site', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(parseError(error));
    }
  }
);

export const deleteProjectSiteAsync = createAsyncThunk(
  'projectSites/deleteProjectSite',
  async (data: z.infer<typeof DeleteProjectSiteSchema>, { rejectWithValue }) => {
    try {
      await deleteRequest<z.infer<typeof ProjectSiteSchema>>(`/project-site/${data.id}`, { reason: data.reason });
      return data.id as string;
    } catch (error: any) {
      return rejectWithValue(parseError(error));
    }
  }
);

export const updateProjectSiteAsync = createAsyncThunk(
  'projectSites/updateProjectSite',
  async (data: z.infer<typeof UpdateProjectSiteSchema>, { rejectWithValue }) => {
    try {
      const response = await putRequest<z.infer<typeof ProjectSiteSchema>>(`/project-site/${data.id}`, { name: data.name });
      return response.data;
    } catch (error) {
      return rejectWithValue(parseError(error));
    }
  }
);

export const projectSitesSlice = createSlice({
  name: 'projectSites',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectSitesAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProjectSitesAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.projectSites = action.payload;
      })
      .addCase(fetchProjectSitesAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });

    builder
      .addCase(createProjectSiteAsync.pending, (state) => {
        state.createStatus = 'loading';
      })
      .addCase(createProjectSiteAsync.fulfilled, (state, action) => {
        state.createStatus = 'succeeded';
        state.projectSites.push(action.payload);
      })
      .addCase(createProjectSiteAsync.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.createError = action.payload as string;
      });

    builder
      .addCase(deleteProjectSiteAsync.pending, (state) => {
        state.deleteStatus = 'loading';
      })
      .addCase(deleteProjectSiteAsync.fulfilled, (state, action) => {
        state.deleteStatus = 'succeeded';
        state.projectSites = state.projectSites.filter((projectSite) => projectSite.id !== action.payload);
      })
      .addCase(deleteProjectSiteAsync.rejected, (state, action) => {
        state.deleteStatus = 'failed';
        state.deleteError = action.payload as string;
      });

    builder
      .addCase(updateProjectSiteAsync.pending, (state) => {
        state.updateStatus = 'loading';
      })
      .addCase(updateProjectSiteAsync.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        const index = state.projectSites.findIndex((projectSite) => projectSite.id === action.payload.id);
        if (index !== -1) {
          state.projectSites[index] = action.payload;
        }
      })
      .addCase(updateProjectSiteAsync.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.updateError = action.payload as string;
      });
  }
});

export default projectSitesSlice.reducer;
