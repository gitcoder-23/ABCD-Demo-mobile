import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authAppSlice';

export const store = configureStore({
  reducer: {
    authApp: authReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
