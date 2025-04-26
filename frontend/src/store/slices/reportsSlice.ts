import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

// Define types
export interface Report {
  id: string
  title: string
  regulation_diff_id: string
  created_at: string
  url: string
}

export interface ReportRequest {
  regulation_diff_id: string
  include_findings: boolean
  include_action_items: boolean
}

interface ReportsState {
  items: Report[]
  currentReport: any | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

// Initial state
const initialState: ReportsState = {
  items: [],
  currentReport: null,
  status: 'idle',
  error: null
}

// Async thunks
export const fetchReports = createAsyncThunk(
  'reports/fetchReports',
  async () => {
    const response = await axios.get('/api/report/list')
    return response.data
  }
)

export const generateReport = createAsyncThunk(
  'reports/generateReport',
  async (request: ReportRequest) => {
    const response = await axios.post('/api/report/generate', request)
    return response.data
  }
)

export const downloadReport = createAsyncThunk(
  'reports/downloadReport',
  async (reportId: string) => {
    const response = await axios.get(`/api/report/download/${reportId}`)
    return response.data
  }
)

// Create slice
const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    clearCurrentReport: (state) => {
      state.currentReport = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchReports.fulfilled, (state, action: PayloadAction<Report[]>) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to fetch reports'
      })
      .addCase(generateReport.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(generateReport.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.currentReport = action.payload.report
      })
      .addCase(generateReport.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to generate report'
      })
      .addCase(downloadReport.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(downloadReport.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.currentReport = action.payload
      })
      .addCase(downloadReport.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to download report'
      })
  }
})

export const { clearCurrentReport } = reportsSlice.actions
export default reportsSlice.reducer 