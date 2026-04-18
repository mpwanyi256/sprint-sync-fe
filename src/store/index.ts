import { isDev } from '@/lib/constants';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import { adminReducer } from './slices/admin';
import { aiReducer } from './slices/ai';
import { analyticsReducer } from './slices/analytics';
import { authReducer } from './slices/auth';
import { selectedTaskReducer } from './slices/selectedTask';
import { taskReducer } from './slices/task';
import { uiReducer } from './slices/ui';
import { usersReducer } from './slices/users';

const rootReducer = combineReducers({
  auth: authReducer,
  task: taskReducer,
  ai: aiReducer,
  ui: uiReducer,
  users: usersReducer,
  analytics: analyticsReducer,
  admin: adminReducer,
  selectedTask: selectedTaskReducer,
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
