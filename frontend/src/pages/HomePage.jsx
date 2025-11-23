import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { authService } from '../services/authService'
import AdminDashboard from '../components/dashboard/AdminDashboard'
import ShopDashboard from '../components/dashboard/ShopDashboard'
import UserDashboard from '../components/dashboard/UserDashboard'

function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [userRole, setUserRole] = useState(null)

  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    setUser(currentUser)
    setUserRole(currentUser?.role || 'user')
  }, [])

  const renderDashboard = () => {
    switch (userRole) {
      case 'admin':
        return <AdminDashboard />
      case 'shop':
        return <ShopDashboard />
      case 'user':
      default:
        return <UserDashboard />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="lg:ml-64 pt-16">
        {/* Header */}
        <Header onMenuClick={() => setSidebarOpen(true)} />

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">
              Welcome back, {user?.name || 'User'}!
            </p>
          </div>
          {renderDashboard()}
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}

export default HomePage

