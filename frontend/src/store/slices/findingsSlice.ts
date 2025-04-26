import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

// Define types
export interface Finding {
  id: string
  regulation_diff_id: string
  title: string
  description: string
  regulation_section: string
  confidence: number
  exposures: Array<{
    id: string
    financial_impact: number
    description: string
    affected_departments: string[]
    timeframe: string
  }>
  severity: string
  impact_areas: string[]
  estimated_cost: number
  created_at: string
}

interface FindingsState {
  items: Finding[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

// Initial state
const initialState: FindingsState = {
  items: [],
  status: 'idle',
  error: null
}

// Async thunks
export const fetchFindings = createAsyncThunk(
  'findings/fetchFindings',
  async () => {
    const response = await axios.get('/api/impact/findings')
    return response.data
  }
)

export const assessImpact = createAsyncThunk(
  'findings/assessImpact',
  async (regulation_diff_id: string) => {
    const response = await axios.post(`/api/impact/assess/${regulation_diff_id}`)
    return response.data
  }
)

// Create slice
const findingsSlice = createSlice({
  name: 'findings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFindings.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchFindings.fulfilled, (state, action: PayloadAction<Finding[]>) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchFindings.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to fetch findings'
      })
      .addCase(assessImpact.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(assessImpact.fulfilled, (state, action) => {
        state.status = 'succeeded'
        // We'll need to refetch the findings after assessment
      })
      .addCase(assessImpact.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to assess impact'
      })
  }
})

export default findingsSlice.reducer 