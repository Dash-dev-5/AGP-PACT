import { type PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { deleteRequest, getRequest, parseError, postRequest, putRequest } from "utils/verbes"
import { endpoints } from "utils/endpoints"

import type { CreateCity, UpdateCityType } from "./villeType"
import { z } from "zod"
import { citySchema } from "./cityValidation"

type statusType = "idle" | "loading" | "succeeded" | "failed"

// Update the interface to include territory property
interface ICity {
  id: string | null
  province: string | null
  name: string | null
  territory?: string
}

type InitialState = {
  cities: ICity[]
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

export const fetchCitiesByTerritory = createAsyncThunk<ICity[], { id: string }>(
  "city/fetchCity",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await getRequest<unknown>(endpoints.cities.getByProvince(id))
      console.log("2  viles ", response)

      const dataValidation = z.array(citySchema).safeParse(response.data)
      if (!dataValidation.success) {
        console.error("check cities validation", dataValidation.error)
        throw new Error("Les données ne sont pas correctement télécharger")
      }
      return dataValidation.data
    } catch (error) {
      return rejectWithValue(parseError(error))
    }
  },
)

export const addCity = createAsyncThunk<ICity, CreateCity>("ville/addCity", async (newCity, { rejectWithValue }) => {
  try {
    const response = await postRequest<ICity>("cities", newCity)
    // response.data.sectors = []
    console.log("response :", response)

    // const dataValidation = citySchema.safeParse(response.data)
    // if (!dataValidation.success) {
    //   console.error("check cities validation", dataValidation.error)
    //   throw new Error("Les données ne sont pas correctement télécharger")
    // }
    return response.data
  } catch (error) {
    return rejectWithValue(parseError(error))
  }
})

export const updateCity = createAsyncThunk<ICity, UpdateCityType>(
  "city/updateCity",
  async (params, { rejectWithValue }) => {
    try {
      if (!params.id) {
        return rejectWithValue("ID is required")
      }
      const response = await putRequest<ICity>(endpoints.cities.update(params.id), {
        name: params.name,
        province: params.province,
        // Only include territory if it exists in params
        ...(params.territory && { territory: params.territory }),
      })
      const dataValidation = citySchema.safeParse(response.data)
      if (!dataValidation.success) {
        console.error("check cities validation", dataValidation.error)
        throw new Error("Les données ne sont pas correctement télécharger")
      }
      return dataValidation.data
    } catch (error) {
      return rejectWithValue(parseError(error))
    }
  },
)

export const deleteCity = createAsyncThunk<
  string,
  { id: string | null; reason: "Bad data" | "Data created by mistake and more" },
  { rejectValue: string }
>("city/deleteCity", async (params, { rejectWithValue }) => {
  const { id, reason } = params

  if (!id) {
    return rejectWithValue("Invalid city ID")
  }

  try {
    await deleteRequest(`cities/${id}`, { reason })
    return id
  } catch (error) {
    return rejectWithValue(parseError(error))
  }
})

const citySlice = createSlice({
  name: "city",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCitiesByTerritory.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(fetchCitiesByTerritory.fulfilled, (state, action: PayloadAction<ICity[]>) => {
        state.status = "succeeded"
        state.cities = action.payload
      })
      .addCase(fetchCitiesByTerritory.rejected, (state, action) => {
        state.status = "failed"
        state.cities = []
        state.error = action.payload as string
      })

    builder
      .addCase(addCity.pending, (state) => {
        state.createStatus = "loading"
        state.createError = null
      })
      .addCase(addCity.fulfilled, (state, action: PayloadAction<ICity>) => {
        state.createStatus = "succeeded"
        state.cities.unshift(action.payload)
      })
      .addCase(addCity.rejected, (state, action) => {
        state.createStatus = "failed"
        state.createError = action.payload as string
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
