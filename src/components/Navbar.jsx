import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'

const Navbar = () => {
  const location = useLocation()
  const { isAuthenticated, logout } = useAuth()

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/projects', label: 'Projects' },
    { path: '/articles', label: 'Articles' },
    { path: '/contact', label: 'Contact' },
  ]

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-neon-green/30">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-neon-green rounded-full animate-pulse"></div>
            <span className="font-mono text-neon-green text-lg font-bold tracking-wider">
              abelhamuda@portfolio:~$
            </span>
          </Link>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`font-mono text-sm hover:text-neon-green transition-colors duration-300 ${
                  location.pathname === item.path ? 'text-neon-green' : 'text-gray-300'
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Dashboard Link */}
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="font-mono text-sm text-neon-green hover:neon-glow px-4 py-2 border border-neon-green rounded"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="font-mono text-sm text-neon-red hover:neon-glow px-4 py-2 border border-neon-red rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="font-mono text-sm text-neon-green hover:neon-glow px-4 py-2 border border-neon-green rounded"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-neon-green">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar