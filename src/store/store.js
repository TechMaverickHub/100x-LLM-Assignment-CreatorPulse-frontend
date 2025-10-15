import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice.js';
import topicReducer from './topicSlice.js';
import sourceReducer from './sourceSlice.js';
import mailReducer from './mailSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    topics: topicReducer,
    sources: sourceReducer,
    mail: mailReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});
