import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice.js';
import topicReducer from './topicSlice.js';
import sourceReducer from './sourceSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    topics: topicReducer,
    sources: sourceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});
