"use client"

import { useState } from "react"
import SignupForm from "../components/SignupForm"
import SigninForm from "../components/SigninForm"

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("signin")

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Tab Headers */}
          <div className="flex">
            <button
              onClick={() => setActiveTab("signin")}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === "signin" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab("signup")}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === "signup" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">{activeTab === "signin" ? <SigninForm /> : <SignupForm />}</div>
        </div>
      </div>
    </div>
  )
}
