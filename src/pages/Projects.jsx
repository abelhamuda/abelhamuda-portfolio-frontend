import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { api } from '../utils/api'

const Projects = () => {
  const [filter, setFilter] = useState('all')
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const categories = [
    { id: 'all', name: 'All Projects' },
    { id: 'fullstack', name: 'Full Stack' },
    { id: 'frontend', name: 'Frontend' },
    { id: 'backend', name: 'Backend' }
  ]

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      setLoading(true)
      const data = await api.getProjects()
      setProjects(data)
    } catch (err) {
      setError('Failed to load projects')
      console.error('Error loading projects:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(project => project.category === filter)

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-20 pb-10 flex items-center justify-center">
        <div className="font-mono text-neon-green text-xl">Loading projects...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black pt-20 pb-10 flex items-center justify-center">
        <div className="text-center">
          <div className="font-mono text-neon-red text-xl mb-4">{error}</div>
          <button 
            onClick={loadProjects}
            className="font-mono px-4 py-2 border border-neon-green text-neon-green hover:neon-glow"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black pt-20 pb-10">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="font-mono text-4xl md:text-6xl text-neon-green mb-4">Projects</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            A collection of my latest work and experiments in web development, AI, and software engineering.
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setFilter(category.id)}
              className={`font-mono px-6 py-3 border rounded-lg transition-all duration-300 ${
                filter === category.id
                  ? 'border-neon-green text-neon-green neon-glow'
                  : 'border-gray-600 text-gray-400 hover:border-neon-green hover:text-neon-green'
              }`}
            >
              {category.name}
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="dashboard-panel rounded-lg overflow-hidden group cursor-pointer"
            >
              {/* Project Image */}
              <div className="h-48 bg-gradient-to-br from-neon-green/20 to-neon-red/20 relative overflow-hidden">
                {project.thumbnail_url ? (
                  <img 
                    src={project.thumbnail_url} 
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <span className="text-gray-400 font-mono">No Image</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-all duration-300"></div>
                <div className="absolute bottom-4 left-4">
                  <span className={`font-mono text-xs px-2 py-1 rounded ${
                    project.category === 'frontend' ? 'bg-blue-500/20 text-blue-300' :
                    project.category === 'backend' ? 'bg-green-500/20 text-green-300' :
                    'bg-purple-500/20 text-purple-300'
                  }`}>
                    {project.category}
                  </span>
                </div>
              </div>

              {/* Project Content */}
              <div className="p-6">
                <h3 className="font-mono text-xl text-neon-green mb-3 group-hover:neon-glow transition-all duration-300">
                  {project.title}
                </h3>
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies && JSON.parse(project.technologies).map((tech, index) => (
                    <span
                      key={index}
                      className="font-mono text-xs px-2 py-1 bg-gray-800 text-gray-300 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <a
                    href={project.github_url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs px-4 py-2 border border-neon-green text-neon-green hover:neon-glow transition-all duration-300 flex-1 text-center"
                  >
                    GitHub
                  </a>
                  <a
                    href={project.live_url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs px-4 py-2 border border-neon-red text-neon-red hover:neon-glow transition-all duration-300 flex-1 text-center"
                  >
                    Live Demo
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="font-mono text-neon-red text-lg mb-4">No projects found</div>
            <p className="text-gray-400">Try selecting a different category</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Projects