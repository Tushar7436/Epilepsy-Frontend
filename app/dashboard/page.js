"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Dashboard() {
  const router = useRouter()
  const [selectedService, setSelectedService] = useState(null)
  
  // Mock user data - replace with actual user data from your auth system
  const userData = {
    name: "John Doe",
    role: "Patient",
    id: "PAT123456",
    associatedIds: ["DOC789", "CARE456"]
  }

  const services = [
    { id: "appointments", name: "Appointments", icon: "📅" },
    { id: "records", name: "Medical Records", icon: "📋" },
    { id: "medications", name: "Medications", icon: "💊" },
    { id: "reports", name: "Reports", icon: "📊" }
  ]

  const handleLogout = () => {
    // Clear any auth tokens or session data
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-xl">👤</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">{userData.name}</h2>
              <p className="text-sm text-gray-600">{userData.role}</p>
            </div>
          </div>
        </div>
        
        <nav className="p-4">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Services</h3>
          <ul className="space-y-2">
            {services.map((service) => (
              <li key={service.id}>
                <button
                  onClick={() => setSelectedService(service.id)}
                  className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    selectedService === service.id
                      ? "bg-purple-100 text-purple-700"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <span>{service.icon}</span>
                  <span>{service.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Top Bar with ID and Logout */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex justify-between items-center">
          <div className="space-y-1">
            <p className="text-sm text-gray-600">Your ID: <span className="font-semibold">{userData.id}</span></p>
            <p className="text-sm text-gray-600">
              Associated IDs: {userData.associatedIds.join(", ")}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Dynamic Content Area */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {selectedService ? (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                {services.find(s => s.id === selectedService)?.name}
              </h2>
              {/* Dynamic content will be rendered here based on selected service */}
              <p className="text-gray-600">
                Content for {selectedService} will be loaded here based on user role and service selection.
              </p>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">Select a service from the sidebar to view its content</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
