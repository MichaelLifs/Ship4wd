import { Link, useLocation } from 'react-router-dom'
import { authService } from '../services/authService'

function Sidebar({ isOpen, onClose }) {
  const location = useLocation()
  
  const isAdmin = () => {
    const user = authService.getCurrentUser()
    if (!user || !user.role) return false
    return user.role.toLowerCase() === 'admin'
  }

  const isShopManager = () => {
    const user = authService.getCurrentUser()
    if (!user || !user.role) return false
    return user.role.toLowerCase() === 'shop'
  }

  const isUser = () => {
    const user = authService.getCurrentUser()
    if (!user || !user.role) return false
    return user.role.toLowerCase() === 'user'
  }
  
  const isActive = (path) => {
    return location.pathname === path
  }
  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <div className={`
        w-64 bg-white h-screen fixed left-0 top-0 shadow-lg flex flex-col z-40 border-r border-gray-200
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-gray-200 flex items-center justify-center h-16">
          <img 
            src="/MainLogo.png" 
            alt="SHIP4WD Logo" 
            className="h-8 w-auto object-contain"
          />
        </div>

      <nav className="flex-1 px-4 py-6 space-y-1.5">
        <Link 
          to="/home" 
          onClick={onClose}
          className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-colors ${
            isActive('/home') 
              ? 'bg-green-600 text-white hover:bg-green-700' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          <span className="text-sm">Dashboard</span>
        </Link>
        
        {isUser() && (
          <Link 
            to="/shops" 
            onClick={onClose}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-colors ${
              isActive('/shops') 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="text-sm">Shops</span>
          </Link>
        )}

        {isShopManager() && (
          <Link 
            to="/my-shops" 
            onClick={onClose}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-colors ${
              isActive('/my-shops')
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="text-sm">My Shops</span>
          </Link>
        )}

        {isAdmin() && (
          <>
            <Link 
              to="/users" 
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-colors ${
                isActive('/users')
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="text-sm">Users</span>
            </Link>
            <Link 
              to="/shops-management" 
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-colors ${
                isActive('/shops-management')
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="text-sm">Manage Shops</span>
            </Link>
            <Link 
              to="/customer-payments" 
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-colors ${
                isActive('/customer-payments')
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-sm">Customer Payments</span>
            </Link>
            <Link 
              to="/shop-payments" 
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-colors ${
                isActive('/shop-payments')
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="text-sm">Shop Payments</span>
            </Link>
          </>
        )}
      </nav>
      </div>
    </>
  )
}

export default Sidebar

