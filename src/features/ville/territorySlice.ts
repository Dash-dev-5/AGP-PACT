import { type PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { deleteRequest, getRequest, parseError, postRequest, putRequest } from "utils/verbes"

// import type {
//   AddVillage,
//   CreateCity,
//   DeleteCityType,
//   ICity,
//   IVillage,
//   UpdateCityType,
// } from "./cityType"
import type { 
  AddVillage,
  CreateCity,
  DeleteCityType,
  ICity,
  IVillage,
  UpdateCityType,
} from "./villeType"
import { z } from "zod"
import { citySchema } from "./cityValidation" // Assure-toi que tu as un fichier cityValidation.ts avec les bonnes règles de validation

type statusType = "idle" | "loading" | "succeeded" | "failed"

type InitialState = {
  cities: ICity[] // Remplace `territories` par `cities` pour gérer les villes
  status: statusType
  error: string | null

  createStatus: statusType
  createError: string | null

  deleteStatus: statusType
  deleteError: string | null

  updateStatus: statusType
  updateError: string | null
}

const initialState: InitialState = {
  cities: [],
  status: "idle",
  error: null,

  createStatus: "idle",
  createError: null,

  deleteStatus: "idle",
  deleteError: null,

  updateStatus: "idle",
  updateError: null,
}

export const createCity = createAsyncThunk<ICity, CreateCity>(
  "city/createCity",
  async (newCity, { rejectWithValue }) => {
    try {
      const response = await postRequest<ICity>("cities", newCity)
      return response.data
    } catch (error) {
      return rejectWithValue(parseError(error))
    }
  },
)

export const updateCity = createAsyncThunk<ICity, { id: string; city: CreateCity }>(
  "city/updateCity",
  async (params, { rejectWithValue }) => {
    try {
      const response = await putRequest<ICity>(`cities/${params.id}`, params.city)
      return response.data
    } catch (error) {
      return rejectWithValue(parseError(error))
    }
  },
)

export const fetchCities = createAsyncThunk<ICity[], { id: string }>(
  "city/fetchCities", // Action pour récupérer les villes d'un territoire
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await getRequest<unknown>(`cities/territory/${id}`)
      const dataValidation = z.array(citySchema).safeParse(response.data)
      if (!dataValidation.success) {
        console.error("check cities validation", dataValidation.error)
        throw new Error("Les données ne sont pas correctement téléchargées")
      }
      return dataValidation.data
    } catch (error) {
      return rejectWithValue(parseError(error))
    }
  },
)

export const deleteCity = createAsyncThunk<string, DeleteCityType>(
  "city/deleteCity",
  async (params, { rejectWithValue }) => {
    try {
      await deleteRequest(`cities/${params.id}`, { reason: params.reason })
      return params.id
    } catch (error) {
      return rejectWithValue(parseError(error))
    }
  },
)

const citySlice = createSlice({
  name: "city",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCities.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(fetchCities.fulfilled, (state, action: PayloadAction<ICity[]>) => {
        state.status = "succeeded"
        state.cities = action.payload
      })
      .addCase(fetchCities.rejected, (state, action) => {
        state.status = "failed"
        state.cities = []
        state.error = action.payload as string
      })

    builder
      .addCase(createCity.pending, (state) => {
        state.createStatus = "loading"
        state.createError = null
      })
      .addCase(createCity.fulfilled, (state, action: PayloadAction<ICity>) => {
        state.createStatus = "succeeded"
        state.cities.unshift(action.payload)
      })
      .addCase(createCity.rejected, (state, action) => {
        state.createStatus = "failed"
        state.createError = action.payload as string
      })

    builder
      .addCase(updateCity.pending, (state) => {
        state.updateStatus = "loading"
        state.updateError = null
      })
      .addCase(updateCity.fulfilled, (state, action: PayloadAction<ICity>) => {
        state.updateStatus = "succeeded"
        const index = state.cities.findIndex((city) => city.id === action.payload.id)
        if (index !== -1) {
          state.cities[index] = action.payload
        }
      })
      .addCase(updateCity.rejected, (state, action) => {
        state.updateStatus = "failed"
        state.updateError = action.payload as string
      })

    builder
      .addCase(deleteCity.pending, (state) => {
        state.deleteStatus = "loading"
        state.deleteError = null
      })
      .addCase(deleteCity.fulfilled, (state, action: PayloadAction<string>) => {
        state.deleteStatus = "succeeded"
        state.cities = state.cities.filter((city) => city.id !== action.payload)
      })
      .addCase(deleteCity.rejected, (state, action) => {
        state.deleteStatus = "failed"
        state.deleteError = action.payload as string
      })
  },
})

export default citySlice.reducer
