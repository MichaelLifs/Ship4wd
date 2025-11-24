import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import Footer from '../components/Footer'

function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:ml-64 pt-16">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="relative overflow-hidden">
          {/* Hero Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
              {/* Left Side - Text Content */}
              <div className="space-y-4">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-pink-100 rounded-full">
                  <svg className="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span className="text-xs font-medium text-gray-700">Grocery Shop Management</span>
                </div>

                {/* Main Headline */}
                <div className="space-y-2">
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                    Make healthy life with{' '}
                    <span className="text-green-600 relative">
                      fresh
                      <svg className="absolute bottom-0 left-0 w-full h-2 text-green-300" fill="currentColor" viewBox="0 0 100 10" preserveAspectRatio="none">
                        <path d="M0,8 Q25,2 50,8 T100,8" stroke="currentColor" strokeWidth="2" fill="none" />
                      </svg>
                    </span>{' '}
                    grocery
                  </h1>
                  <p className="text-sm text-gray-600 leading-relaxed max-w-lg">
                    Get the best quality and most delicious grocery food in the world. 
                    Manage your shop, track expenses, and serve customers with our comprehensive platform.
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="inline-flex items-center justify-center px-6 py-2.5 bg-orange-500 text-white font-semibold rounded-xl shadow-lg text-sm">
                    <span>Get Started</span>
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                  <div className="inline-flex items-center justify-center px-6 py-2.5 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 text-sm">
                    Learn More
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">100%</div>
                    <div className="text-xs text-gray-600">Fresh Quality</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">24/7</div>
                    <div className="text-xs text-gray-600">Support</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">Fast</div>
                    <div className="text-xs text-gray-600">Delivery</div>
                  </div>
                </div>
              </div>

              {/* Right Side - Image with Overlay Cards */}
              <div className="relative">
                {/* Main Image Placeholder - You can replace with actual image */}
                <div className="relative bg-gradient-to-br from-green-100 to-green-200 rounded-2xl p-4 lg:p-6 shadow-2xl">
                  <div className="aspect-square bg-white rounded-xl flex items-center justify-center overflow-hidden">
                    <svg className="w-full h-full text-green-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                </div>

                {/* Overlay Card 1 - Top Left */}
                <div className="absolute top-2 left-2 bg-white rounded-xl p-2 shadow-xl border border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-bold text-sm text-gray-900">100% Fresh</div>
                      <div className="text-xs text-gray-600">Quality maintain</div>
                    </div>
                  </div>
                </div>

                {/* Overlay Card 2 - Bottom Right */}
                <div className="absolute bottom-2 right-2 bg-white rounded-xl p-2 shadow-xl border border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-bold text-sm text-gray-900">Fast Delivery</div>
                      <div className="text-xs text-gray-600">Free of cost delivery</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="bg-white py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Why Choose Us?</h2>
                <p className="text-sm text-gray-600 max-w-2xl mx-auto">
                  Everything you need to manage your grocery shop efficiently
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Feature 1 */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Track Expenses</h3>
                  <p className="text-sm text-gray-600">
                    Monitor all your shop expenses and keep track of your spending patterns.
                  </p>
                </div>

                {/* Feature 2 */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Customer Payments</h3>
                  <p className="text-sm text-gray-600">
                    Manage customer transactions and track all payments efficiently.
                  </p>
                </div>

                {/* Feature 3 */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Shop Management</h3>
                  <p className="text-sm text-gray-600">
                    Organize and manage multiple shops from one centralized platform.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}

export default HomePage

