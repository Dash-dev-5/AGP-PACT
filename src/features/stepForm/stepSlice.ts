import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  UpdateStepFiveOnePayload,
  UpdateStepFourPayload,
  UpdateStepNinePayload,
  UpdateStepSevenOnePayload,
  UpdateStepSevenTwoPayload,
  UpdateStepSixPayload,
  UpdateStepThreePayload,
  UpdateStepTwoPayload
} from 'types/stepFormType';
import { parseError, putRequest } from 'utils/verbes';

interface StepState {
  data: UpdateStepTwoPayload | null;
  dataStepThree: UpdateStepThreePayload | null;
  dataStepFour: UpdateStepFourPayload | null;
  dataStepFiveOne: UpdateStepFiveOnePayload | null;
  dataStepFiveTwo: UpdateStepFourPayload | null;
  dataStepSix: UpdateStepSixPayload | null;
  dataStepSevenOne: UpdateStepSevenOnePayload | null;
  dataStepSevenTwo: UpdateStepSevenTwoPayload | null;
  dataStepEight: UpdateStepFourPayload | null;
  dataStepEightTwo: UpdateStepFiveOnePayload | null;
  dataStepNine: UpdateStepNinePayload | null;
  loadingStepThree: boolean;
  loadingStepFour: boolean;
  loadingStepFiveTwo: boolean;
  loadingStepSix: boolean;
  loadingStepSevenOne: boolean;
  loadingStepSevenTwo: boolean;
  loading: boolean;
  error: string | null;
  errorThree: string | null;
  errorFour: string | null;
  errorFiveTwo: string | null;
  errorSix: string | null;
  errorSevenOne: string | null;
  errorSevenTwo: string | null;
}

const initialState: StepState = {
  data: null,
  dataStepThree: null,
  dataStepFour: null,
  dataStepFiveTwo: null,
  dataStepFiveOne: null,
  dataStepSix: null,
  dataStepSevenOne: null,
  dataStepSevenTwo: null,
  dataStepEight: null,
  dataStepEightTwo: null,
  dataStepNine: null,
  loading: false,
  loadingStepThree: false,
  loadingStepFour: false,
  loadingStepFiveTwo: false,
  loadingStepSix: false,
  loadingStepSevenOne: false,
  loadingStepSevenTwo: false,
  error: null,
  errorThree: null,
  errorFour: null,
  errorFiveTwo: null,
  errorSix: null,
  errorSevenOne: null,
  errorSevenTwo: null
};

export const updateSecondStep = createAsyncThunk('step/updateSecondStep', async (payload: UpdateStepTwoPayload, { rejectWithValue }) => {
  try {
    const response = await putRequest<UpdateStepTwoPayload>('processing-step/update-second-step', payload);
    return response.data;
  } catch (error) {
    return rejectWithValue(parseError(error));
  }
});

export const updateThreeStep = createAsyncThunk('step/updateThreeStep', async (payload: UpdateStepThreePayload, { rejectWithValue }) => {
  try {
    const response = await putRequest<UpdateStepThreePayload>('processing-step/update-third-step', payload);
    return response.data;
  } catch (error) {
    return rejectWithValue(parseError(error));
  }
});

export const updateFourStep = createAsyncThunk('step/updateFourStep', async (payload: UpdateStepFourPayload, { rejectWithValue }) => {
  try {
    const response = await putRequest<UpdateStepFourPayload>('processing-step/update-fourth-step', payload);
    return response.data;
  } catch (error) {
    return rejectWithValue(parseError(error));
  }
});

export const updateFiveStepOne = createAsyncThunk(
  'step/updateFiveStepOne',
  async (payload: UpdateStepFiveOnePayload, { rejectWithValue }) => {
    try {
      const response = await putRequest<UpdateStepFiveOnePayload>('processing-step/update-fifth-step-part-one', payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(parseError(error));
    }
  }
);
export const updateFiveStepTwo = createAsyncThunk('step/updateFiveStepTwo', async (payload: UpdateStepFourPayload, { rejectWithValue }) => {
  try {
    const response = await putRequest<UpdateStepFourPayload>('processing-step/update-fifth-step-part-two', payload);
    return response.data;
  } catch (error) {
    return rejectWithValue(parseError(error));
  }
});
export const updateStepSix = createAsyncThunk('step/updateStepSix', async (payload: UpdateStepSixPayload, { rejectWithValue }) => {
  try {
    const response = await putRequest<UpdateStepSixPayload>('processing-step/update-fifth-step', payload);
    return response.data;
  } catch (error) {
    return rejectWithValue(parseError(error));
  }
});
export const updateStepSevenOne = createAsyncThunk(
  'step/updateStepSevenOne',
  async (payload: UpdateStepSevenOnePayload, { rejectWithValue }) => {
    try {
      const response = await putRequest<UpdateStepSevenOnePayload>('processing-step/update-seventh-step-part-one', payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(parseError(error));
    }
  }
);
export const updateStepSevenTwo = createAsyncThunk(
  'step/updateStepSevenTwo',
  async (payload: UpdateStepSevenTwoPayload, { rejectWithValue }) => {
    try {
      const response = await putRequest<UpdateStepSevenTwoPayload>('processing-step/update-seventh-step-part-two', payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(parseError(error));
    }
  }
);
export const updateEightStepOne = createAsyncThunk(
  'step/updateEightStepOne',
  async (payload: UpdateStepFourPayload, { rejectWithValue }) => {
    try {
      const response = await putRequest<UpdateStepFourPayload>('processing-step/update-eighth-step-part-one', payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(parseError(error));
    }
  }
);

export const updateEightStepTwo = createAsyncThunk(
  'step/updateEightStepTwo',
  async (payload: UpdateStepFiveOnePayload, { rejectWithValue }) => {
    try {
      const response = await putRequest<UpdateStepFiveOnePayload>('processing-step/update-eighth-step-part-two', payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(parseError(error));
    }
  }
);
export const updateStepNine = createAsyncThunk('step/updateStepNine', async (payload: UpdateStepNinePayload, { rejectWithValue }) => {
  try {
    const response = await putRequest<UpdateStepNinePayload>('processing-step/update-ninth-step', payload);
    return response.data;
  } catch (error) {
    return rejectWithValue(parseError(error));
  }
});

const stepSlice = createSlice({
  name: 'step',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(updateSecondStep.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateSecondStep.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
    builder.addCase(updateSecondStep.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(updateThreeStep.pending, (state) => {
      state.loadingStepThree = true;
      state.errorThree = null;
    });
    builder.addCase(updateThreeStep.fulfilled, (state, action) => {
      state.loadingStepThree = false;
      state.dataStepThree = action.payload;
      state.errorThree = null;
    });
    builder.addCase(updateThreeStep.rejected, (state, action) => {
      state.loadingStepThree = false;
      state.errorThree = action.payload as string;
    });

    builder.addCase(updateFourStep.pending, (state) => {
      state.loadingStepFour = true;
      state.errorFour = null;
    });
    builder.addCase(updateFourStep.fulfilled, (state, action) => {
      state.loadingStepFour = false;
      state.dataStepFour = action.payload;
      state.errorFour = null;
    });
    builder.addCase(updateFourStep.rejected, (state, action) => {
      state.loadingStepFour = false;
      state.errorFour = action.payload as string;
    });
    builder.addCase(updateFiveStepTwo.pending, (state) => {
      state.loadingStepFiveTwo = true;
      state.errorFiveTwo = null;
    });
    builder.addCase(updateFiveStepTwo.fulfilled, (state, action) => {
      state.loadingStepFiveTwo = false;
      state.dataStepFiveTwo = action.payload;
      state.errorFiveTwo = null;
    });
    builder.addCase(updateFiveStepTwo.rejected, (state, action) => {
      state.loadingStepFiveTwo = false;
      state.errorFiveTwo = action.payload as string;
    });
    builder.addCase(updateStepSix.pending, (state) => {
      state.loadingStepSix = true;
      state.errorSix = null;
    });
    builder.addCase(updateStepSix.fulfilled, (state, action) => {
      state.loadingStepSix = false;
      state.dataStepSix = action.payload;
      state.errorSix = null;
    });
    builder.addCase(updateStepSix.rejected, (state, action) => {
      state.loadingStepSix = false;
      state.errorSix = action.payload as string;
    });

    builder.addCase(updateFiveStepOne.fulfilled, (state, action) => {
      // state.loadingStepSix = false;
      state.dataStepFiveOne = action.payload;
      // state.errorSix = null;
    });

    builder.addCase(updateStepSevenOne.pending, (state) => {
      state.loadingStepSevenOne = true;
      state.errorSevenOne = null;
    });
    builder.addCase(updateStepSevenOne.fulfilled, (state, action) => {
      state.loadingStepSevenOne = false;
      state.dataStepSevenOne = action.payload;
      state.errorSevenOne = null;
    });
    builder.addCase(updateStepSevenOne.rejected, (state, action) => {
      state.loadingStepSevenOne = false;
      state.errorSevenOne = action.payload as string;
    });
    builder.addCase(updateStepSevenTwo.pending, (state) => {
      state.loadingStepSevenTwo = true;
      state.errorSevenTwo = null;
    });
    builder.addCase(updateStepSevenTwo.fulfilled, (state, action) => {
      state.loadingStepSevenTwo = false;
      state.dataStepSevenTwo = action.payload;
      state.errorSevenTwo = null;
    });
    builder.addCase(updateStepSevenTwo.rejected, (state, action) => {
      state.loadingStepSevenTwo = false;
      state.errorSevenTwo = action.payload as string;
    });
    builder.addCase(updateEightStepOne.fulfilled, (state, action) => {
      // state.loadingStepFour = false;
      state.dataStepEight = action.payload;
      // state.errorFour = null;
    });
    builder.addCase(updateEightStepTwo.fulfilled, (state, action) => {
      // state.loadingStepFour = false;
      state.dataStepEightTwo = action.payload;
      // state.errorFour = null;
    });
    builder.addCase(updateStepNine.fulfilled, (state, action) => {
      // state.loadingStepFour = false;
      state.dataStepNine = action.payload;
      // state.errorFour = null;
    });
  }
});

export default stepSlice.reducer;
