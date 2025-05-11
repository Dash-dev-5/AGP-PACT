import { type PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { deleteRequest, getRequest, parseError, postRequest, putRequest } from "utils/verbes"

import type {
  AddVillage,
  CreateTerritory,
  DeleteTerritoryType,
  ITerritory,
  IVillage,
  UpdateTerritoryType,
} from "./territoryType"
import { z } from "zod"
import { territorySchema } from "./territoryValidation"

type statusType = "idle" | "loading" | "succeeded" | "failed"

type InitialState = {
  territories: ITerritory[]
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
  territories: [],
  status: "idle",
  error: null,

  createStatus: "idle",
  createError: null,

  deleteStatus: "idle",
  deleteError: null,

  updateStatus: "idle",
  updateError: null,
}

export const createVillage = createAsyncThunk<IVillage, AddVillage>(
  "village/createVillage",
  async (newVillage, { rejectWithValue }) => {
    try {
      const response = await postRequest<IVillage>("villages", newVillage)
      return response.data
    } catch (error) {
      return rejectWithValue(parseError(error))
    }
  },
)

export const updateVillage = createAsyncThunk<IVillage, { id: string; village: AddVillage }>(
  "village/updateVillage",
  async (params, { rejectWithValue }) => {
    try {
      const response = await putRequest<IVillage>(`villages/${params.id}`, params.village)
      return response.data
    } catch (error) {
      return rejectWithValue(parseError(error))
    }
  },
)

export const fetchTerritories = createAsyncThunk<ITerritory[], { id: string }, { rejectValue: string }>(
  "territory/fetchTerritory",
  async ({ id }, { rejectWithValue }) => {
    try {
      console.log(" id ", id)
      const response = await getRequest<unknown>(`territories/province/${id}`)
      console.log("fact :", response)

      const dataValidation = z.array(territorySchema).safeParse(response.data)
      if (!dataValidation.success) {
        console.error("check territories validation", dataValidation.error)
        throw new Error("Les données ne sont pas correctement télécharger")
      }
      return response.data as ITerritory[]
    } catch (error) {
      return rejectWithValue(parseError(error))
    }
  },
)

export const addTerritory = createAsyncThunk<ITerritory, CreateTerritory>(
  "territories/addTerritory",
  async (newTerritory, { rejectWithValue }) => {
    console.log("test ", newTerritory)
    try {
      const response = await postRequest<ITerritory>("territories", JSON.stringify(newTerritory))
      console.log("Réponse backend:", response)

      // response.data.cities = []
      const dataValidation = territorySchema.safeParse(response.data)

      // if (!dataValidation.success) {
      //   console.error("check territories validation", dataValidation.error)
      //   throw new Error("Les données ne sont pas correctement télécharger")
      // }
      return response.data
    } catch (error) {
      console.log("Erreur attrapée :", parseError(error))

      return rejectWithValue(parseError(error))
    }
  },
)

export const updateTerritory = createAsyncThunk<ITerritory, UpdateTerritoryType>(
  "territory/updateTerritory",
  async (params, { rejectWithValue }) => {
    try {
      const response = await putRequest<ITerritory>(`territories/${params.id}`, { name: params.name })

      const dataValidation = territorySchema.safeParse(response.data)
      if (!dataValidation.success) {
        console.error("check territories validation", dataValidation.error)
        throw new Error("Les données ne sont pas correctement télécharger")
      }
      return dataValidation.data
    } catch (error) {
      return rejectWithValue(parseError(error))
    }
  },
)

export const deleteTerritory = createAsyncThunk<string, DeleteTerritoryType>(
  "territory/deleteTerritory",
  async (params, { rejectWithValue }) => {
    try {
      await deleteRequest(`territories/${params.id}`, { reason: params.reason })
      return params.id
    } catch (error) {
      return rejectWithValue(parseError(error))
    }
  },
)

const territorySlice = createSlice({
  name: "territory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTerritories.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(fetchTerritories.fulfilled, (state, action: PayloadAction<ITerritory[]>) => {
        state.status = "succeeded"
        state.territories = action.payload
      })
      .addCase(fetchTerritories.rejected, (state, action) => {
        state.status = "failed"
        state.territories = []
        state.error = action.payload as string
      })

    builder
      .addCase(addTerritory.pending, (state) => {
        state.createStatus = "loading"
        state.createError = null
      })
      .addCase(addTerritory.fulfilled, (state, action: PayloadAction<ITerritory>) => {
        state.createStatus = "succeeded"
        state.territories.unshift(action.payload)
      })
      .addCase(addTerritory.rejected, (state, action) => {
        state.createStatus = "failed"
        state.createError = action.payload as string
      })

    builder
      .addCase(updateTerritory.pending, (state) => {
        state.updateStatus = "loading"
        state.updateError = null
      })
      .addCase(updateTerritory.fulfilled, (state, action: PayloadAction<ITerritory>) => {
        state.updateStatus = "succeeded"
        const index = state.territories.findIndex((territory) => territory.id === action.payload.id)
        if (index !== -1) {
          state.territories[index] = action.payload
        }
      })
      .addCase(updateTerritory.rejected, (state, action) => {
        state.updateStatus = "failed"
        state.updateError = action.payload as string
      })

    builder
      .addCase(deleteTerritory.pending, (state) => {
        state.deleteStatus = "loading"
        state.deleteError = null
      })
      .addCase(deleteTerritory.fulfilled, (state, action: PayloadAction<string>) => {
        state.deleteStatus = "succeeded"
        state.territories = state.territories.filter((territory) => territory.id !== action.payload)
      })
      .addCase(deleteTerritory.rejected, (state, action) => {
        state.deleteStatus = "failed"
        state.deleteError = action.payload as string
      })

    builder.addCase(updateVillage.fulfilled, (state, action: PayloadAction<IVillage>) => {
      const updatedVillage = action.payload

      // Traverse territories, cities, and sectors to locate the village
      if (state.territories) {
        for (const territory of state.territories) {
          if (territory.cities) {
            for (const city of territory.cities) {
              for (const sector of city.sectors || []) {
                const villageIndex = sector.villages?.findIndex((v: IVillage) => v.id === updatedVillage.id) ?? -1

                // If village is found, update it
                if (villageIndex !== -1 && sector.villages) {
                  sector.villages[villageIndex] = updatedVillage
                  return // Stop the loop once the village is updated
                }
              }
            }
          }
        }
      }
    })
  },
})

export default territorySlice.reducer
