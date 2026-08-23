// import { configureStore } from '@reduxjs/toolkit';
// import authReducer from './slices/authAppSlice';
// import testReducer from './slices/testSlice';

// export const store = configureStore({
//   reducer: {
//     authApp: authReducer,
//     test: testReducer,
//   },
// });

// // Infer the `RootState` and `AppDispatch` types from the store itself
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import authAppSlice from './slices/authAppSlice';
import testReducer from './slices/testSlice';
const authPersistConfig = {
  key: 'authApp',
  storage: AsyncStorage,
  // whitelist: ['authApp'],
  blacklist: ['isRegisterLoading', 'isLoginLoading', 'isError'],
};

const combinedReducer = combineReducers({
  authApp: persistReducer(authPersistConfig, authAppSlice),
  test: testReducer,
});

const rootReducer = (state: any, action: any) => {
  return combinedReducer(state, action as never);
};

const store = configureStore({
  reducer: rootReducer,
  // FIX 1: Ignore serializable check for redux-persist actions
  // A non-serializable value was detected in an action, in the path: `register`.
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  // FIX 2: Correct way to add Reactotron enhancers
  enhancers: getDefaultEnhancers => {
    if (__DEV__) {
    }
    return getDefaultEnhancers();
  },
});

export default store;
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
