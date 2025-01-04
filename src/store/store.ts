// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './slices/authSlice';
import assessmentReducer from './slices/assessmentSlice';

// Persist configuration for auth
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user'], // Only persist user data in auth state
};

// Root reducer type that combines all reducers
const rootReducer = {
  auth: persistReducer(authPersistConfig, authReducer),
  assessment: assessmentReducer, // Assessment state doesn't need to be persisted
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore Redux Persist actions in serializable check
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;