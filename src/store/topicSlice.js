import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { topicService } from '../services/topicService.js';

// Async thunks
export const fetchTopics = createAsyncThunk(
  'topics/fetchTopics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await topicService.getTopics();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch topics');
    }
  }
);

export const fetchUserTopics = createAsyncThunk(
  'topics/fetchUserTopics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await topicService.getUserTopics();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user topics');
    }
  }
);

export const updateUserTopics = createAsyncThunk(
  'topics/updateUserTopics',
  async (topicIds, { rejectWithValue }) => {
    try {
      const response = await topicService.updateUserTopics(topicIds);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update topics');
    }
  }
);

const initialState = {
  topics: [],
  userTopics: [],
  selectedTopics: [],
  loading: false,
  error: null
};

const topicSlice = createSlice({
  name: 'topics',
  initialState,
  reducers: {
    toggleTopicSelection: (state, action) => {
      const topicId = action.payload;
      if (state.selectedTopics.includes(topicId)) {
        state.selectedTopics = state.selectedTopics.filter(id => id !== topicId);
      } else {
        state.selectedTopics.push(topicId);
      }
    },
    setSelectedTopics: (state, action) => {
      state.selectedTopics = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch topics
      .addCase(fetchTopics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopics.fulfilled, (state, action) => {
        console.log('TopicSlice - fetchTopics fulfilled:', action.payload);
        state.loading = false;
        state.topics = action.payload.results || [];
        state.error = null;
        console.log('TopicSlice - topics set to:', state.topics);
      })
      .addCase(fetchTopics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch user topics
      .addCase(fetchUserTopics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserTopics.fulfilled, (state, action) => {
        console.log('TopicSlice - fetchUserTopics fulfilled:', action.payload);
        state.loading = false;
        state.userTopics = action.payload.results || [];
        // Extract topic IDs from the nested structure
        state.selectedTopics = (action.payload.results || []).map(userTopic => userTopic.topic.id);
        state.error = null;
        console.log('TopicSlice - userTopics set to:', state.userTopics);
        console.log('TopicSlice - selectedTopics set to:', state.selectedTopics);
      })
      .addCase(fetchUserTopics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update user topics
      .addCase(updateUserTopics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserTopics.fulfilled, (state, action) => {
        state.loading = false;
        // Update successful, refresh user topics
        state.error = null;
      })
      .addCase(updateUserTopics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { toggleTopicSelection, setSelectedTopics, clearError } = topicSlice.actions;
export default topicSlice.reducer;
