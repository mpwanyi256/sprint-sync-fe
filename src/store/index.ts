import { configureStore } from '@reduxjs/toolkit'
import { authReducer } from './slices/auth'
import { taskReducer } from './slices/task'
import { uiReducer } from './slices/ui'
import { aiReducer } from './slices/ai'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: taskReducer,
    ui: uiReducer,
    ai: aiReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
