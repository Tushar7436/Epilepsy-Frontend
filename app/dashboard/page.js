"use client"

import { useRouter } from "next/navigation"

export default function Dashboard() {
  const router = useRouter()

  const handleLogout = () => {
    // In a real app, you'd clear authentication tokens here
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Welcome!</h3>
              <p className="text-blue-700">You have successfully logged in to your dashboard.</p>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900 mb-2">Profile</h3>
              <p className="text-green-700">Manage your account settings and preferences.</p>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-900 mb-2">Analytics</h3>
              <p className="text-purple-700">View your activity and usage statistics.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
