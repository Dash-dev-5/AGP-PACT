import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { getRequest, postRequest, putRequest, deleteRequest, parseError } from "utils/verbes"
import { z } from "zod"
import { sectorSchema } from "./communeValidation"
import type { ISector, CreateSector, DeleteSectorType } from "./communeType"

type statusType = "idle" | "loading" | "succeeded" | "failed"

type InitialState = {
  sectors: ISector[]
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
  sectors: [],
  status: "idle",
  error: null,
  createStatus: "idle",
  createError: null,
  updateStatus: "idle",
  updateError: null,
  deleteStatus: "idle",
  deleteError: null,
}

// Fetch communes par ville
export const fetchSectors = createAsyncThunk<ISector[], { id: string }>(
  "sector/fetchSectors",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await getRequest(`sectors/city/${id}`)
      const result = z.array(sectorSchema).safeParse(response.data)
      if (!result.success) {
        console.error("Erreur de validation des communes", result.error)
        throw new Error("Données invalides")
      }
      return result.data
    } catch (error) {
      return rejectWithValue(parseError(error))
    }
  },
)
export const createSector = createAsyncThunk<ISector, CreateSector, { rejectValue: string }>(
  "sector/createSector",
  async (newSector, { rejectWithValue }) => {
    try {
      const response = await postRequest("sectors", newSector)

      const validationResult = sectorSchema.safeParse(response.data)
      if (!validationResult.success) {
        console.error("Validation error:", validationResult.error)
        return rejectWithValue("Invalid data received from server")
      }

      return validationResult.data
    } catch (error) {
      return rejectWithValue(parseError(error))
    }
  },
)

export const updateSector = createAsyncThunk<
  ISector, // type de retour attendu (fulfilled)
  { id: string; name: string; city: string }, // paramètres d'entrée (payload)
  { rejectValue: string } // optionnel : type de la valeur de rejet
>("sector/updateSector", async ({ id, name, city }, { rejectWithValue }) => {
  try {
    const response = await putRequest<ISector>(`sectors/${id}`, { name, city })
    return response.data
  } catch (error) {
    return rejectWithValue(parseError(error))
  }
})

export const deleteSector = createAsyncThunk<string, DeleteSectorType>(
  "sector/deleteSector",
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      if (!id) {
        return rejectWithValue("ID is required")
      }
      await deleteRequest(`sectors/${id}`, { reason })
      return id
    } catch (error) {
      return rejectWithValue(parseError(error))
    }
  },
)

const sectorSlice = createSlice({
  name: "sector",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSectors.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(fetchSectors.fulfilled, (state, action: PayloadAction<ISector[]>) => {
        state.status = "succeeded"
        state.sectors = action.payload
      })
      .addCase(fetchSectors.rejected, (state, action) => {
        state.status = "failed"
        state.sectors = []
        state.error = action.payload as string
      })

    builder
      .addCase(createSector.pending, (state) => {
        state.createStatus = "loading"
        state.createError = null
      })
      .addCase(createSector.fulfilled, (state, action: PayloadAction<ISector>) => {
        state.createStatus = "succeeded"
        state.sectors.unshift(action.payload)
      })
      .addCase(createSector.rejected, (state, action) => {
        state.createStatus = "failed"
        state.createError = action.payload as string
      })

    builder
      .addCase(updateSector.pending, (state) => {
        state.updateStatus = "loading"
        state.updateError = null
      })
      .addCase(updateSector.fulfilled, (state, action: PayloadAction<ISector>) => {
        state.updateStatus = "succeeded"
        const index = state.sectors.findIndex((s) => s.id === action.payload.id)
        if (index !== -1) state.sectors[index] = action.payload
      })
      .addCase(updateSector.rejected, (state, action) => {
        state.updateStatus = "failed"
        state.updateError = action.payload as string
      })

    builder
      .addCase(deleteSector.pending, (state) => {
        state.deleteStatus = "loading"
        state.deleteError = null
      })
      .addCase(deleteSector.fulfilled, (state, action: PayloadAction<string>) => {
        state.deleteStatus = "succeeded"
        state.sectors = state.sectors.filter((s) => s.id !== action.payload)
      })
      .addCase(deleteSector.rejected, (state, action) => {
        state.deleteStatus = "failed"
        state.deleteError = action.payload as string
      })
  },
})

export default sectorSlice.reducer
