import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice.js';
import topicReducer from './topicSlice.js';
import sourceReducer from './sourceSlice.js';
import mailReducer from './mailSlice.js';
import userStyleSampleReducer from './userStyleSampleSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    topics: topicReducer,
    sources: sourceReducer,
    mail: mailReducer,
    userStyleSamples: userStyleSampleReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});
