import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

// Define types
export interface ActionItem {
  id: string
  title: string
  description: string
  priority: 'High' | 'Medium' | 'Low'
  assigned_to: string
  due_date: string
  status: 'pending' | 'in_progress' | 'completed' | 'blocked'
  finding_id: string
}

interface ActionItemsState {
  items: ActionItem[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

// Initial state
const initialState: ActionItemsState = {
  items: [],
  status: 'idle',
  error: null
}

// Async thunks
export const fetchActionItems = createAsyncThunk(
  'actionItems/fetchActionItems',
  async () => {
    const response = await axios.get('/api/planner/action-items')
    return response.data
  }
)

export const createImplementationPlan = createAsyncThunk(
  'actionItems/createImplementationPlan',
  async (finding_id: string) => {
    const response = await axios.post(`/api/planner/plan/${finding_id}`)
    return response.data
  }
)

export const updateActionItem = createAsyncThunk(
  'actionItems/updateActionItem',
  async (actionItem: ActionItem) => {
    const response = await axios.put(`/api/planner/action-items/${actionItem.id}`, actionItem)
    return response.data
  }
)

// Create slice
const actionItemsSlice = createSlice({
  name: 'actionItems',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActionItems.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchActionItems.fulfilled, (state, action: PayloadAction<ActionItem[]>) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchActionItems.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to fetch action items'
      })
      .addCase(createImplementationPlan.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(createImplementationPlan.fulfilled, (state) => {
        state.status = 'succeeded'
        // We'll need to refetch the action items after plan creation
      })
      .addCase(createImplementationPlan.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to create implementation plan'
      })
      .addCase(updateActionItem.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(updateActionItem.fulfilled, (state, action: PayloadAction<ActionItem>) => {
        state.status = 'succeeded'
        const index = state.items.findIndex(item => item.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
      .addCase(updateActionItem.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to update action item'
      })
  }
})

export default actionItemsSlice.reducer 