import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import RegulationsPage from './pages/RegulationsPage'
import FindingsPage from './pages/FindingsPage'
import ActionItemsPage from './pages/ActionItemsPage'
import ReportsPage from './pages/ReportsPage'
import Layout from './components/Layout'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/regulations" element={<RegulationsPage />} />
        <Route path="/findings" element={<FindingsPage />} />
        <Route path="/action-items" element={<ActionItemsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
      </Routes>
    </Layout>
  )
}

export default App 