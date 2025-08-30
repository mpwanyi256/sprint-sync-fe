import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './slices/auth';
import { taskReducer } from './slices/task';
import { aiReducer } from './slices/ai';
import { uiReducer } from './slices/ui';
import { usersReducer } from './slices/users';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    task: taskReducer,
    ai: aiReducer,
    ui: uiReducer,
    users: usersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
