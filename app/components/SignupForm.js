"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { signup } from "@/lib/services/authServices"

export default function SignupForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    mobile: "",
    email: "",
    password: "",
    role: "",
    ashaId: "",
    docId: "",
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors = {}

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    // Age validation
    if (!formData.age) {
      newErrors.age = "Age is required"
    } else {
      const age = Number.parseInt(formData.age)
      if (isNaN(age) || age < 1 || age > 120) {
        newErrors.age = "Age must be a number between 1 and 120"
      }
    }

    // Gender validation
    if (!formData.gender) {
      newErrors.gender = "Gender is required"
    }

    // Mobile validation
    if (!formData.mobile) {
      newErrors.mobile = "Mobile number is required"
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Mobile number must be exactly 10 digits"
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long"
    } else if (!/^(?=.*[a-zA-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must be alphanumeric"
    }

    // Role validation
    if (!formData.role) {
      newErrors.role = "Role is required"
    }

    // ASHA ID validation - only required for ASHA workers
    if (formData.role === "asha-worker") {
      if (!formData.ashaId) {
        newErrors.ashaId = "ASHA ID is required for ASHA workers"
      } else if (!/^\d{6}$/.test(formData.ashaId)) {
        newErrors.ashaId = "ASHA ID must be exactly 6 digits"
      }
    }
    
    // Doctor ID validation - only required for doctors
    if (formData.role === "doctor") {
      if (!formData.docId) {
        newErrors.docId = "Doctor ID is required for doctors"
      } else if (!/^\d{6}$/.test(formData.docId)) {
        newErrors.docId = "Doctor ID must be exactly 6 digits"
      }
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
      const response = await signup(formData)

      if (response.success) {
        localStorage.setItem('token', response.token)
        localStorage.setItem('user', JSON.stringify(response.user))
        toast.success("Account created successfully!")
        router.push("/")
      } else {
        toast.error(response.error || "Failed to create account. Please try again.")
        setErrors({
          submit: response.error || "Failed to create account. Please try again."
        })
      }
    } catch (error) {
      console.error("Signup error:", error)
      toast.error(error.message || "Failed to create account. Please try again.")
      setErrors({
        submit: error.message || "Failed to create account. Please try again."
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
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Create Account</h2>

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.name ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter your full name"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      {/* Age */}
      <div>
        <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
          Age *
        </label>
        <input
          type="number"
          id="age"
          name="age"
          value={formData.age}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.age ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter your age"
          min="1"
          max="120"
        />
        {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
      </div>

      {/* Gender */}
      <div>
        <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
          Gender *
        </label>
        <select
          id="gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.gender ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
      </div>

      {/* Mobile */}
      <div>
        <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">
          Mobile Number *
        </label>
        <input
          type="tel"
          id="mobile"
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.mobile ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter 10-digit mobile number"
          maxLength="10"
        />
        {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.email ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter your email address"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
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
          placeholder="Enter password (min 8 characters, alphanumeric)"
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

      {/* ASHA ID - Only show for ASHA workers */}
      {formData.role === "asha-worker" && (
        <div>
          <label htmlFor="ashaId" className="block text-sm font-medium text-gray-700 mb-1">
            ASHA ID *
          </label>
          <input
            type="text"
            id="ashaId"
            name="ashaId"
            value={formData.ashaId}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.ashaId ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter 6-digit ASHA ID"
            maxLength="6"
            pattern="\d{6}"
          />
          {errors.ashaId && <p className="text-red-500 text-sm mt-1">{errors.ashaId}</p>}
        </div>
      )}

      {/* Doctor ID - Only show for doctors */}
      {formData.role === "doctor" && (
        <div>
          <label htmlFor="docId" className="block text-sm font-medium text-gray-700 mb-1">
            Doctor ID *
          </label>
          <input
            type="text"
            id="docId"
            name="docId"
            value={formData.docId}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.docId ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter 6-digit Doctor ID"
            maxLength="6"
            pattern="\d{6}"
          />
          {errors.docId && <p className="text-red-500 text-sm mt-1">{errors.docId}</p>}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? "Creating Account..." : "Create Account"}
      </button>

      {/* Error message for submission errors */}
      {errors.submit && (
        <p className="text-red-500 text-sm text-center">{errors.submit}</p>
      )}
    </form>
  )
}
