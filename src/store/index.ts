import { configureStore, combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { authReducer } from './slices/auth';
import { taskReducer } from './slices/task';
import { aiReducer } from './slices/ai';
import { uiReducer } from './slices/ui';
import { usersReducer } from './slices/users';
import { persistReducer, persistStore } from 'redux-persist';
import { isDev } from '@/lib/constants';

const rootReducer = combineReducers({
  auth: authReducer,
  task: taskReducer,
  ai: aiReducer,
  ui: uiReducer,
  users: usersReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: isDev,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
