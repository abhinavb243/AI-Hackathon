import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

// Define types
export interface RegulationDiff {
  id: string
  source: string
  title: string
  summary: string
  url: string
  published_date: string
  content: string
  previous_version: string
  changes: Array<{
    section: string
    old_text: string
    new_text: string
  }>
}

interface RegulationsState {
  items: RegulationDiff[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

// Initial state
const initialState: RegulationsState = {
  items: [],
  status: 'idle',
  error: null
}

// Async thunks
export const fetchRegulations = createAsyncThunk(
  'regulations/fetchRegulations',
  async () => {
    const response = await axios.get('/api/reg-intel/diffs')
    return response.data
  }
)

export const scrapeRegulations = createAsyncThunk(
  'regulations/scrapeRegulations',
  async () => {
    const response = await axios.post('/api/reg-intel/scrape')
    return response.data
  }
)

// Create slice
const regulationsSlice = createSlice({
  name: 'regulations',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRegulations.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchRegulations.fulfilled, (state, action: PayloadAction<RegulationDiff[]>) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchRegulations.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to fetch regulations'
      })
      .addCase(scrapeRegulations.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(scrapeRegulations.fulfilled, (state) => {
        state.status = 'succeeded'
        // We'll need to refetch the regulations after scraping
      })
      .addCase(scrapeRegulations.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to scrape regulations'
      })
  }
})

export default regulationsSlice.reducer 