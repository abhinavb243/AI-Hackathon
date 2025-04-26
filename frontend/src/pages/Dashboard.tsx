import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { AppDispatch, RootState } from '../store'
import { fetchRegulations } from '../store/slices/regulationsSlice'
import { fetchFindings } from '../store/slices/findingsSlice'
import { fetchActionItems } from '../store/slices/actionItemsSlice'
import { fetchReports } from '../store/slices/reportsSlice'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>()
  const regulations = useSelector((state: RootState) => state.regulations.items)
  const findings = useSelector((state: RootState) => state.findings.items)
  const actionItems = useSelector((state: RootState) => state.actionItems.items)
  const reports = useSelector((state: RootState) => state.reports.items)
  
  useEffect(() => {
    dispatch(fetchRegulations())
    dispatch(fetchFindings())
    dispatch(fetchActionItems())
    dispatch(fetchReports())
  }, [dispatch])
  
  // Calculate statistics
  const totalRegulations = regulations.length
  const totalFindings = findings.length
  const totalActionItems = actionItems.length
  const completeActionItems = actionItems.filter(item => item.status === 'completed').length
  const pendingActionItems = actionItems.filter(item => item.status === 'pending').length
  const inProgressActionItems = actionItems.filter(item => item.status === 'in_progress').length
  
  // Data for charts
  const priorityData = [
    { name: 'High', count: actionItems.filter(item => item.priority === 'High').length },
    { name: 'Medium', count: actionItems.filter(item => item.priority === 'Medium').length },
    { name: 'Low', count: actionItems.filter(item => item.priority === 'Low').length },
  ]
  
  const statusData = [
    { name: 'Pending', count: pendingActionItems },
    { name: 'In Progress', count: inProgressActionItems },
    { name: 'Completed', count: completeActionItems },
  ]

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Regulations</h3>
          <p className="text-3xl font-semibold mt-2">{totalRegulations}</p>
          <Link to="/regulations" className="text-blue-600 text-sm mt-4 block">View all</Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Findings</h3>
          <p className="text-3xl font-semibold mt-2">{totalFindings}</p>
          <Link to="/findings" className="text-blue-600 text-sm mt-4 block">View all</Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Action Items</h3>
          <p className="text-3xl font-semibold mt-2">{totalActionItems}</p>
          <div className="flex text-sm mt-4">
            <span className="text-green-600 mr-3">{completeActionItems} completed</span>
            <span className="text-amber-600">{pendingActionItems + inProgressActionItems} open</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Reports</h3>
          <p className="text-3xl font-semibold mt-2">{reports.length}</p>
          <Link to="/reports" className="text-blue-600 text-sm mt-4 block">View all</Link>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-base font-medium mb-4">Action Items by Priority</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-base font-medium mb-4">Action Items by Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Recent updates */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-base font-medium mb-4">Recent Regulatory Updates</h3>
        {regulations.length > 0 ? (
          <ul className="divide-y">
            {regulations.slice(0, 5).map((reg) => (
              <li key={reg.id} className="py-3">
                <h4 className="font-medium">{reg.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{reg.summary}</p>
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-gray-500">Source: {reg.source}</span>
                  <span className="text-xs text-gray-500">
                    Published: {new Date(reg.published_date).toLocaleDateString()}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No regulations found.</p>
        )}
      </div>
    </div>
  )
}

export default Dashboard 