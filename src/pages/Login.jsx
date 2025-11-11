import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { api } from '../utils/api'
import { motion } from 'framer-motion'

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await api.login(credentials)
      if (result.token) {
        login(result.token)
        navigate('/dashboard')
      } else {
        setError(result.message || 'Login failed')
      }
    } catch (error) {
      setError('Login failed. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="terminal-border p-8 rounded-lg w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-2 h-2 bg-neon-red rounded-full"></div>
            <div className="w-2 h-2 bg-neon-green rounded-full"></div>
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
          </div>
          <h2 className="font-mono text-2xl text-neon-green mb-2">Admin Login</h2>
          <p className="text-gray-300 text-sm">Access the dashboard terminal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="font-mono text-neon-green text-sm block mb-2">Email</label>
            <input
              type="email"
              value={credentials.email}
              onChange={(e) => setCredentials({...credentials, email: e.target.value})}
              className="w-full p-3 bg-black border border-neon-green text-white font-mono focus:outline-none focus:neon-glow"
              placeholder="admin@abelhamuda.com"
              required
            />
          </div>

          <div>
            <label className="font-mono text-neon-green text-sm block mb-2">Password</label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              className="w-full p-3 bg-black border border-neon-green text-white font-mono focus:outline-none focus:neon-glow"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="font-mono text-neon-red text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full font-mono py-3 bg-neon-green text-black hover:neon-glow transition-all duration-300 disabled:opacity-50"
          >
            {isLoading ? 'Authenticating...' : 'Login →'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <div className="font-mono text-gray-400 text-xs">
            Default credentials: admin@abelhamuda.com / admin123
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Login