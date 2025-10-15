import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { mailService } from '../services/mailService.js';
import { handleApiError } from '../utils/errorHandler.js';

// Async thunks
export const fetchNewsletterList = createAsyncThunk(
  'mail/fetchNewsletterList',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await mailService.getNewsletterListWithFilter(params);
      return response;
    } catch (error) {
      const errorMessage = handleApiError(error);
      return rejectWithValue(errorMessage);
    }
  }
);

const initialState = {
  newsletters: [],
  pagination: {
    count: 0,
    next: null,
    previous: null,
    currentPage: 1
  },
  loading: false,
  error: null,
  filters: {
    status: '',
    email: ''
  }
};

const mailSlice = createSlice({
  name: 'mail',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        status: '',
        email: ''
      };
    },
    clearError: (state) => {
      state.error = null;
    },
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch newsletter list
      .addCase(fetchNewsletterList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNewsletterList.fulfilled, (state, action) => {
        state.loading = false;
        state.newsletters = action.payload.results || [];
        state.pagination = {
          count: action.payload.count || 0,
          next: action.payload.next,
          previous: action.payload.previous,
          currentPage: state.pagination.currentPage
        };
        state.error = null;
      })
      .addCase(fetchNewsletterList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setFilters, clearFilters, clearError, setCurrentPage } = mailSlice.actions;
export default mailSlice.reducer;
