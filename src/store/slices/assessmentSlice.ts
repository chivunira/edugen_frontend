// src/store/slices/assessmentSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import contentApi from '../../api/content';
import { Assessment, AssessmentResult, QuestionFeedback, AssessmentSummary } from '../../types/assessment';

// Enhanced type for the state
interface AssessmentState {
  currentAssessment: Assessment | null;
  currentQuestionIndex: number;
  answers: Record<number, string>;
  feedback: Record<number, QuestionFeedback>;
  results: AssessmentResult | null;
  topicSummaries: Record<number, AssessmentSummary>;
  loading: boolean;
  error: string | null;
  submitLoading: boolean; // Added to track answer submission separately
  completionLoading: boolean; // Added to track assessment completion separately
}

const initialState: AssessmentState = {
  currentAssessment: null,
  currentQuestionIndex: 0,
  answers: {},
  feedback: {},
  results: null,
  topicSummaries: {},
  loading: false,
  error: null,
  submitLoading: false,
  completionLoading: false
};

// Enhanced error handling for thunks
interface ThunkError {
  message: string;
  statusCode?: number;
}

// Async thunks with improved error handling
export const startAssessment = createAsyncThunk<
  Assessment,
  number,
  { rejectValue: ThunkError }
>('assessment/start', async (topicId, { rejectWithValue }) => {
  try {
    const response = await contentApi.startAssessment(topicId);
    if (!response || !response.questions || !response.questions.length) {
      return rejectWithValue({
        message: 'Invalid assessment data received',
        statusCode: 400
      });
    }
    return response;
  } catch (error: any) {
    return rejectWithValue({
      message: error.response?.data?.error || 'Failed to start assessment',
      statusCode: error.response?.status
    });
  }
});

export const submitAnswer = createAsyncThunk<
  { questionId: number; answer: string; feedback: QuestionFeedback },
  { assessmentId: number; questionId: number; answer: string },
  { rejectValue: ThunkError }
>('assessment/submitAnswer', async ({ assessmentId, questionId, answer }, { rejectWithValue }) => {
  try {
    if (!answer.trim()) {
      return rejectWithValue({
        message: 'Answer cannot be empty',
        statusCode: 400
      });
    }

    const response = await contentApi.submitAnswer(assessmentId, questionId, answer);
    return { questionId, answer, feedback: response };
  } catch (error: any) {
    return rejectWithValue({
      message: error.response?.data?.error || 'Failed to submit answer',
      statusCode: error.response?.status
    });
  }
});

export const completeAssessment = createAsyncThunk<
  AssessmentResult,
  number,
  { rejectValue: ThunkError }
>('assessment/complete', async (assessmentId, { rejectWithValue }) => {
  try {
    const response = await contentApi.completeAssessment(assessmentId);
    if (!response || typeof response.score !== 'number') {
      return rejectWithValue({
        message: 'Invalid completion data received',
        statusCode: 400
      });
    }
    return response;
  } catch (error: any) {
    return rejectWithValue({
      message: error.response?.data?.error || 'Failed to complete assessment',
      statusCode: error.response?.status
    });
  }
});

export const fetchAssessmentSummary = createAsyncThunk<
  { topicId: number; summary: AssessmentSummary },
  number,
  { rejectValue: ThunkError }
>('assessment/fetchSummary', async (topicId, { rejectWithValue }) => {
  try {
    const response = await contentApi.getAssessmentSummary(topicId);
    if (!response) {
      return rejectWithValue({
        message: 'No summary available',
        statusCode: 404
      });
    }
    return { topicId, summary: response };
  } catch (error: any) {
    return rejectWithValue({
      message: error.response?.data?.error || 'Failed to fetch summary',
      statusCode: error.response?.status
    });
  }
});

const assessmentSlice = createSlice({
  name: 'assessment',
  initialState,
  reducers: {
    setCurrentQuestionIndex: (state, action) => {
      const maxIndex = (state.currentAssessment?.questions.length || 1) - 1;
      state.currentQuestionIndex = Math.min(Math.max(0, action.payload), maxIndex);
    },
    resetAssessment: () => initialState,
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Start Assessment
    builder.addCase(startAssessment.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(startAssessment.fulfilled, (state, action) => {
      state.loading = false;
      state.currentAssessment = action.payload;
      state.currentQuestionIndex = 0;
      state.answers = {};
      state.feedback = {};
      state.results = null;
    });
    builder.addCase(startAssessment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || 'Failed to start assessment';
    });

    // Submit Answer
    builder.addCase(submitAnswer.pending, (state) => {
      state.submitLoading = true;
      state.error = null;
    });
    builder.addCase(submitAnswer.fulfilled, (state, action) => {
      state.submitLoading = false;
      state.answers[action.payload.questionId] = action.payload.answer;
      state.feedback[action.payload.questionId] = action.payload.feedback;
    });
    builder.addCase(submitAnswer.rejected, (state, action) => {
      state.submitLoading = false;
      state.error = action.payload?.message || 'Failed to submit answer';
    });

    // Complete Assessment
    builder.addCase(completeAssessment.pending, (state) => {
      state.completionLoading = true;
      state.error = null;
    });
    builder.addCase(completeAssessment.fulfilled, (state, action) => {
      state.completionLoading = false;
      state.results = action.payload;
      if (state.currentAssessment) {
        state.currentAssessment.status = 'completed';
        state.currentAssessment.total_score = action.payload.score;
      }
    });
    builder.addCase(completeAssessment.rejected, (state, action) => {
      state.completionLoading = false;
      state.error = action.payload?.message || 'Failed to complete assessment';
    });

    // Fetch Assessment Summary
    builder.addCase(fetchAssessmentSummary.fulfilled, (state, action) => {
      if (action.payload.summary) {
        state.topicSummaries[action.payload.topicId] = action.payload.summary;
      }
    });
  },
});

export const {
  setCurrentQuestionIndex,
  resetAssessment,
  clearError
} = assessmentSlice.actions;

export default assessmentSlice.reducer;