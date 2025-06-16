"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useUser } from "../context/UserContext"

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { userRole, isAuthenticated } = useUser()

  const publicNavLinks = [
    { href: "/", label: "Home" },
    { href: "/analyticspage", label: "Analytics" },
    { href: "/auth", label: "Login" },
  ]

  const authenticatedNavLinks = [
    { href: "/", label: "Home" },
    { href: userRole ? `/dashboard/${userRole}` : "/dashboard", label: "Dashboard" },
    { href: "/analyticspage", label: "Analytics" },
  ]

  useEffect(() => {
    console.log("Header re-rendered: Authenticated =", isAuthenticated, "Role =", userRole);
  }, [isAuthenticated, userRole]);

  const navLinks = isAuthenticated ? authenticatedNavLinks : publicNavLinks

  const handleNavigation = (href) => {
    if (href.includes('/dashboard') && !userRole) {
      router.push('/auth')
      return
    }
    router.push(href)
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-gray-900">
            NeuroCheck
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault()
                  handleNavigation(link.href)
                }}
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  pathname === link.href ? "text-blue-600" : "text-gray-700"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault()
                    handleNavigation(link.href)
                    setIsMenuOpen(false)
                  }}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors hover:text-blue-600 hover:bg-gray-100 ${
                    pathname === link.href ? "text-blue-600 bg-blue-50" : "text-gray-700"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
