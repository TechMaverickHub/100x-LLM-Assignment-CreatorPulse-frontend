import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { sourceService } from '../services/sourceService.js';

// Async thunks
export const fetchSources = createAsyncThunk(
  'sources/fetchSources',
  async (_, { rejectWithValue }) => {
    try {
      const response = await sourceService.getSources();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch sources');
    }
  }
);

export const createSource = createAsyncThunk(
  'sources/createSource',
  async (sourceData, { rejectWithValue }) => {
    try {
      const response = await sourceService.createSource(sourceData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create source');
    }
  }
);

export const updateSource = createAsyncThunk(
  'sources/updateSource',
  async ({ id, sourceData }, { rejectWithValue }) => {
    try {
      const response = await sourceService.updateSource(id, sourceData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update source');
    }
  }
);

export const deleteSource = createAsyncThunk(
  'sources/deleteSource',
  async (id, { rejectWithValue }) => {
    try {
      await sourceService.deleteSource(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete source');
    }
  }
);

const initialState = {
  sources: [],
  loading: false,
  error: null,
  editingSource: null
};

const sourceSlice = createSlice({
  name: 'sources',
  initialState,
  reducers: {
    setEditingSource: (state, action) => {
      state.editingSource = action.payload;
    },
    clearEditingSource: (state) => {
      state.editingSource = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch sources
      .addCase(fetchSources.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSources.fulfilled, (state, action) => {
        state.loading = false;
        state.sources = action.payload;
        state.error = null;
      })
      .addCase(fetchSources.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create source
      .addCase(createSource.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSource.fulfilled, (state, action) => {
        state.loading = false;
        state.sources.push(action.payload);
        state.error = null;
      })
      .addCase(createSource.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update source
      .addCase(updateSource.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSource.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.sources.findIndex(source => source.id === action.payload.id);
        if (index !== -1) {
          state.sources[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateSource.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete source
      .addCase(deleteSource.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSource.fulfilled, (state, action) => {
        state.loading = false;
        state.sources = state.sources.filter(source => source.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteSource.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setEditingSource, clearEditingSource, clearError } = sourceSlice.actions;
export default sourceSlice.reducer;
