import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'

const Navbar = () => {
  const location = useLocation()
  const { isAuthenticated, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/projects', label: 'Projects' },
    { path: '/articles', label: 'Articles' },
    { path: '/contact', label: 'Contact' },
  ]

  const handleLinkClick = () => {
    setIsMenuOpen(false)
  }

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-neon-green/30">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" onClick={handleLinkClick}>
            <div className="w-3 h-3 bg-neon-green rounded-full animate-pulse"></div>
            <span className="font-mono text-neon-green text-lg font-bold tracking-wider">
              abelhamuda@portfolio:~$
            </span>
          </Link>

          {/* Desktop Navigation Items */}
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
            {isAuthenticated && (
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
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              className="text-neon-green focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="pt-4 pb-2 space-y-3">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={handleLinkClick}
                    className={`block font-mono text-sm py-2 px-4 rounded transition-colors duration-300 ${
                      location.pathname === item.path 
                        ? 'text-neon-green bg-neon-green/10 border-l-2 border-neon-green' 
                        : 'text-gray-300 hover:text-neon-green hover:bg-neon-green/5'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                
                {/* Mobile Dashboard & Logout */}
                {isAuthenticated && (
                  <div className="pt-2 space-y-3 border-t border-neon-green/30 mt-3">
                    <Link
                      to="/dashboard"
                      onClick={handleLinkClick}
                      className="block font-mono text-sm text-neon-green py-2 px-4 border border-neon-green rounded text-center hover:bg-neon-green/10 transition-colors duration-300"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        logout()
                        handleLinkClick()
                      }}
                      className="w-full font-mono text-sm text-neon-red py-2 px-4 border border-neon-red rounded text-center hover:bg-neon-red/10 transition-colors duration-300"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}

export default Navbar