function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to React
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your React application is running successfully!
          </p>
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Getting Started
            </h2>
            <p className="text-gray-600 mb-4">
              This is a basic React landing page with Tailwind CSS configured.
            </p>
            <div className="mt-6 space-y-2 text-left">
              <p className="text-sm text-gray-500">
                ✓ React is installed and configured
              </p>
              <p className="text-sm text-gray-500">
                ✓ Tailwind CSS is set up and ready to use
              </p>
              <p className="text-sm text-gray-500">
                ✓ Development server is running
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage

