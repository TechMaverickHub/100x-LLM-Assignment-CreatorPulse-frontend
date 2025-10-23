import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userStyleSampleService from '../services/userStyleSampleService.js';

// Async thunks
export const fetchUserStyleSamples = createAsyncThunk(
  'userStyleSamples/fetchUserStyleSamples',
  async ({ page = 1, pageSize = 10 } = {}) => {
    const response = await userStyleSampleService.getUserStyleSamplesList(page, pageSize);
    return response;
  }
);

export const addUserStyleSample = createAsyncThunk(
  'userStyleSamples/addUserStyleSample',
  async (text) => {
    const response = await userStyleSampleService.addUserStyleSample(text);
    return response;
  }
);

export const updateUserStyleSample = createAsyncThunk(
  'userStyleSamples/updateUserStyleSample',
  async ({ id, text }) => {
    const response = await userStyleSampleService.updateUserStyleSample(id, text);
    return response;
  }
);

export const deleteUserStyleSample = createAsyncThunk(
  'userStyleSamples/deleteUserStyleSample',
  async (id) => {
    await userStyleSampleService.deleteUserStyleSample(id);
    return id;
  }
);

export const fetchUserStyleSample = createAsyncThunk(
  'userStyleSamples/fetchUserStyleSample',
  async (id) => {
    const response = await userStyleSampleService.getUserStyleSample(id);
    return response;
  }
);

const initialState = {
  samples: [],
  currentSample: null,
  pagination: {
    count: 0,
    next: null,
    previous: null,
    currentPage: 1,
    pageSize: 10
  },
  loading: false,
  error: null,
  addLoading: false,
  updateLoading: false,
  deleteLoading: false
};

const userStyleSampleSlice = createSlice({
  name: 'userStyleSamples',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentSample: (state) => {
      state.currentSample = null;
    },
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch user style samples list
      .addCase(fetchUserStyleSamples.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserStyleSamples.fulfilled, (state, action) => {
        state.loading = false;
        state.samples = action.payload.results;
        state.pagination = {
          count: action.payload.count,
          next: action.payload.next,
          previous: action.payload.previous,
          currentPage: state.pagination.currentPage,
          pageSize: state.pagination.pageSize
        };
      })
      .addCase(fetchUserStyleSamples.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Add user style sample
      .addCase(addUserStyleSample.pending, (state) => {
        state.addLoading = true;
        state.error = null;
      })
      .addCase(addUserStyleSample.fulfilled, (state, action) => {
        state.addLoading = false;
        // Add the new sample to the beginning of the list
        state.samples.unshift(action.payload.results);
        state.pagination.count += 1;
      })
      .addCase(addUserStyleSample.rejected, (state, action) => {
        state.addLoading = false;
        state.error = action.error.message;
      })
      
      // Update user style sample
      .addCase(updateUserStyleSample.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateUserStyleSample.fulfilled, (state, action) => {
        state.updateLoading = false;
        const updatedSample = action.payload.results;
        const index = state.samples.findIndex(sample => sample.pk === updatedSample.pk);
        if (index !== -1) {
          state.samples[index] = updatedSample;
        }
        if (state.currentSample && state.currentSample.pk === updatedSample.pk) {
          state.currentSample = updatedSample;
        }
      })
      .addCase(updateUserStyleSample.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.error.message;
      })
      
      // Delete user style sample
      .addCase(deleteUserStyleSample.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteUserStyleSample.fulfilled, (state, action) => {
        state.deleteLoading = false;
        const deletedId = action.payload;
        state.samples = state.samples.filter(sample => sample.pk !== deletedId);
        state.pagination.count -= 1;
        if (state.currentSample && state.currentSample.pk === deletedId) {
          state.currentSample = null;
        }
      })
      .addCase(deleteUserStyleSample.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.error.message;
      })
      
      // Fetch single user style sample
      .addCase(fetchUserStyleSample.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserStyleSample.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSample = action.payload.results;
      })
      .addCase(fetchUserStyleSample.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { clearError, clearCurrentSample, setCurrentPage } = userStyleSampleSlice.actions;
export default userStyleSampleSlice.reducer;
