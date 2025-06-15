"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SigninForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    emailOrId: "",
    password: "",
    role: "",
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors = {}

    // Email/ID validation
    if (!formData.emailOrId.trim()) {
      newErrors.emailOrId = "Email or ID is required"
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required"
    }

    // Role validation
    if (!formData.role) {
      newErrors.role = "Role is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call - Replace with your actual API call
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            token: "mock-token-123",
            user: {
              id: "123",
              role: formData.role,
              email: formData.emailOrId
            }
          })
        }, 1000)
      })

      // Store the token and user data
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))

      // Redirect to home page
      router.push("/")
    } catch (error) {
      console.error("Signin error:", error)
      setErrors({
        submit: "Failed to sign in. Please try again."
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Welcome Back</h2>

      {/* Email or ID */}
      <div>
        <label htmlFor="emailOrId" className="block text-sm font-medium text-gray-700 mb-1">
          Email or ID *
        </label>
        <input
          type="text"
          id="emailOrId"
          name="emailOrId"
          value={formData.emailOrId}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.emailOrId ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter your email or ID"
        />
        {errors.emailOrId && <p className="text-red-500 text-sm mt-1">{errors.emailOrId}</p>}
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password *
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.password ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter your password"
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
      </div>

      {/* Role */}
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
          Role *
        </label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.role ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">Select Role</option>
          <option value="doctor">Doctor</option>
          <option value="asha-worker">ASHA Worker</option>
          <option value="patient">Patient</option>
        </select>
        {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? "Signing In..." : "Sign In"}
      </button>

      {/* Forgot Password Link */}
      <div className="text-center">
        <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
          Forgot your password?
        </a>
      </div>
    </form>
  )
}
