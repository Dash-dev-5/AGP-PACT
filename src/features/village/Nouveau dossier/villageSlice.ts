import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { getRequest, postRequest, putRequest, deleteRequest, parseError } from "utils/verbes"
import { z } from "zod"
import { villageSchema } from "./villageValidation"
import type { IVillage, CreateVillage, UpdateVillageType, DeleteVillageType } from "./villageType"

type statusType = "idle" | "loading" | "succeeded" | "failed"

type InitialState = {
  villages: IVillage[]
  status: statusType
  error: string | null
  createStatus: statusType
  createError: string | null
  updateStatus: statusType
  updateError: string | null
  deleteStatus: statusType
  deleteError: string | null
}

const initialState: InitialState = {
  villages: [],
  status: "idle",
  error: null,
  createStatus: "idle",
  createError: null,
  updateStatus: "idle",
  updateError: null,
  deleteStatus: "idle",
  deleteError: null,
}

// Fetch quartiers/villages par ville
export const fetchVillages = createAsyncThunk<IVillage[], { id: string }>(
  "village/fetchVillages",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await getRequest(`villages/city/${id}`)
      const result = z.array(villageSchema).safeParse(response.data)
      if (!result.success) {
        console.error("Erreur de validation des quartiers/villages", result.error)
        throw new Error("Données invalides")
      }
      return result.data
    } catch (error) {
      return rejectWithValue(parseError(error))
    }
  }
)

export const createVillage = createAsyncThunk<IVillage, CreateVillage>(
  "village/createVillage",
  async (newVillage, { rejectWithValue }) => {
    try {
      const response = await postRequest("villages", newVillage)
      return response.data
    } catch (error) {
      return rejectWithValue(parseError(error))
    }
  }
)

export const updateVillage = createAsyncThunk<IVillage, UpdateVillageType>(
  'village/updateVillage',
  async ({ id, ...rest }, { rejectWithValue }) => {
    try {
      const response = await putRequest(`villages/${id}`, rest); // rest contient { name, city }
      return response.data;
    } catch (error) {
      return rejectWithValue(parseError(error));
    }
  }
);

export const deleteVillage = createAsyncThunk<string, DeleteVillageType>(
  "village/deleteVillage",
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      await deleteRequest(`villages/${id}`, { reason })
      return id
    } catch (error) {
      return rejectWithValue(parseError(error))
    }
  }
)

const villageSlice = createSlice({
  name: "village",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVillages.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(fetchVillages.fulfilled, (state, action: PayloadAction<IVillage[]>) => {
        state.status = "succeeded"
        state.villages = action.payload
      })
      .addCase(fetchVillages.rejected, (state, action) => {
        state.status = "failed"
        state.villages = []
        state.error = action.payload as string
      })

    builder
      .addCase(createVillage.pending, (state) => {
        state.createStatus = "loading"
        state.createError = null
      })
      .addCase(createVillage.fulfilled, (state, action: PayloadAction<IVillage>) => {
        state.createStatus = "succeeded"
        state.villages.unshift(action.payload)
      })
      .addCase(createVillage.rejected, (state, action) => {
        state.createStatus = "failed"
        state.createError = action.payload as string
      })

    builder
      .addCase(updateVillage.pending, (state) => {
        state.updateStatus = "loading"
        state.updateError = null
      })
      .addCase(updateVillage.fulfilled, (state, action: PayloadAction<IVillage>) => {
        state.updateStatus = "succeeded"
        const index = state.villages.findIndex(v => v.id === action.payload.id)
        if (index !== -1) state.villages[index] = action.payload
      })
      .addCase(updateVillage.rejected, (state, action) => {
        state.updateStatus = "failed"
        state.updateError = action.payload as string
      })

    builder
      .addCase(deleteVillage.pending, (state) => {
        state.deleteStatus = "loading"
        state.deleteError = null
      })
      .addCase(deleteVillage.fulfilled, (state, action: PayloadAction<string>) => {
        state.deleteStatus = "succeeded"
        state.villages = state.villages.filter(v => v.id !== action.payload)
      })
      .addCase(deleteVillage.rejected, (state, action) => {
        state.deleteStatus = "failed"
        state.deleteError = action.payload as string
      })
  },
})

export default villageSlice.reducer
