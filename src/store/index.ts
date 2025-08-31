import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { authReducer } from './slices/auth';
import { taskReducer } from './slices/task';
import { aiReducer } from './slices/ai';
import { uiReducer } from './slices/ui';
import { usersReducer } from './slices/users';
import { analyticsReducer } from './slices/analytics';
import { persistReducer, persistStore } from 'redux-persist';
import { isDev } from '@/lib/constants';

const rootReducer = combineReducers({
  auth: authReducer,
  task: taskReducer,
  ai: aiReducer,
  ui: uiReducer,
  users: usersReducer,
  analytics: analyticsReducer,
});

// Create store factory for SSR compatibility
export const makeStore = () => {
  const isServer = typeof window === 'undefined';

  if (isServer) {
    // On server, return store without persistence
    return configureStore({
      reducer: rootReducer,
      devTools: isDev,
    });
  } else {
    // On client, use persistence
    const storage = require('redux-persist/lib/storage').default;

    const persistConfig = {
      key: 'root',
      storage,
      whitelist: ['auth'],
    };

    const persistedReducer = persistReducer(persistConfig, rootReducer);

    const store = configureStore({
      reducer: persistedReducer,
      middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
          serializableCheck: {
            ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
          },
        }),
      devTools: isDev,
    });

    return store;
  }
};

export const store = makeStore();
export const persistor =
  typeof window !== 'undefined' ? persistStore(store) : null;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
