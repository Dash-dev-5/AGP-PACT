import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Question } from 'types/faq';
import axios from 'utils/axios';
import { deleteRequest, getRequest, parseError, postRequest, putRequest } from 'utils/verbes';

export interface DeleteQuestionType {
  id: string;
  reason: string;
}

export interface UpdateQuestionType {
  id: string;
  name: string;
}
interface InitialState {
  questions: Question[];
  loading: boolean;
  error: string | null;
  deleteStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  updateStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: InitialState = {
  questions: [],
  loading: false,
  error: null,
  updateStatus: 'idle',
  deleteStatus: 'idle'
};

export const createQuestion = createAsyncThunk<Question, Question>('questions/createQuestion', async (newQuestion, { rejectWithValue }) => {
  try {
    const response = await postRequest<Question>('faq-question', newQuestion);

    return response.data;
  } catch (error) {
    return rejectWithValue(parseError(error));
  }
});

export const fetchQuestions = createAsyncThunk<Question[]>('questions/fetchQuestions', async (_, { rejectWithValue }) => {
  try {
    const response = await getRequest<Question[]>('faq-question');
    return response.data;
  } catch (error) {
    return rejectWithValue(parseError(error));
  }
});

export const updateQuestion = createAsyncThunk<Question, UpdateQuestionType>(
  'questions/updateQuestion',
  async (params, { rejectWithValue }) => {
    try {
      const response = await putRequest<Question>(`faq-question/${params.id}`, { name: params.name });
      return response.data;
    } catch (error) {
      return rejectWithValue(parseError(error));
    }
  }
);

export const deleteQuestion = createAsyncThunk<string, DeleteQuestionType>(
  'questions/deleteQuestion',
  async (params, { rejectWithValue }) => {
    try {
      await deleteRequest(`faq-question/${params.id}`, { reason: params.reason });
      return params.id;
    } catch (error) {
      return rejectWithValue(parseError(error));
    }
  }
);

const questionsSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createQuestion.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createQuestion.fulfilled, (state, action: PayloadAction<Question>) => {
      state.questions.push(action.payload);
      state.loading = false;
    });
    builder.addCase(createQuestion.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message as string;
    });

    builder.addCase(fetchQuestions.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchQuestions.fulfilled, (state, action: PayloadAction<Question[]>) => {
      state.questions = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchQuestions.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message as string;
    });

    builder.addCase(updateQuestion.pending, (state) => {
      state.updateStatus = 'loading';
    });
    builder.addCase(updateQuestion.rejected, (state) => {
      state.updateStatus = 'failed';
    });
    builder.addCase(updateQuestion.fulfilled, (state, action: PayloadAction<Question>) => {
      const index = state.questions.findIndex((question) => question.id === action.payload.id);
      if (index !== -1) {
        state.questions[index] = action.payload;
      }
      state.updateStatus = 'succeeded';
    });

    builder.addCase(deleteQuestion.pending, (state) => {
      state.deleteStatus = 'loading';
    });
    builder.addCase(deleteQuestion.fulfilled, (state, action: PayloadAction<string>) => {
      state.questions = state.questions.filter((question) => question.id !== action.payload);
      state.deleteStatus = 'succeeded';
    });
    builder.addCase(deleteQuestion.rejected, (state) => {
      state.deleteStatus = 'failed';
    });
  }
});

export default questionsSlice.reducer;
