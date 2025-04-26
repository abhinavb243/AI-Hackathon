import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BarChart3, BookText, CheckSquare, FileText, LayoutDashboard } from 'lucide-react'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation()
  
  const navItems = [
    { 
      name: 'Dashboard', 
      path: '/', 
      icon: <LayoutDashboard className="h-5 w-5" /> 
    },
    { 
      name: 'Regulations', 
      path: '/regulations', 
      icon: <BookText className="h-5 w-5" /> 
    },
    { 
      name: 'Findings', 
      path: '/findings', 
      icon: <BarChart3 className="h-5 w-5" /> 
    },
    { 
      name: 'Action Items', 
      path: '/action-items', 
      icon: <CheckSquare className="h-5 w-5" /> 
    },
    { 
      name: 'Reports', 
      path: '/reports', 
      icon: <FileText className="h-5 w-5" /> 
    },
  ]
  
  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white">
        <div className="p-4 border-b border-gray-800">
          <h1 className="text-xl font-bold">Compliance AI</h1>
        </div>
        <nav className="mt-4">
          <ul>
            {navItems.map((item) => (
              <li key={item.path} className="mb-1">
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-sm hover:bg-gray-800 ${
                    isActive(item.path) ? 'bg-gray-800' : ''
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <h2 className="text-xl font-semibold">
              {navItems.find(item => isActive(item.path))?.name || 'Compliance AI'}
            </h2>
          </div>
        </header>
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout 