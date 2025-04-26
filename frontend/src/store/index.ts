import { configureStore } from '@reduxjs/toolkit'
import regulationsReducer from './slices/regulationsSlice'
import findingsReducer from './slices/findingsSlice'
import actionItemsReducer from './slices/actionItemsSlice'
import reportsReducer from './slices/reportsSlice'

export const store = configureStore({
  reducer: {
    regulations: regulationsReducer,
    findings: findingsReducer,
    actionItems: actionItemsReducer,
    reports: reportsReducer,
  },
  devTools: true,
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch 