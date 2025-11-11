import React, { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { api } from '../utils/api'
import { motion } from 'framer-motion'
import Chart from 'react-apexcharts'
import RichTextEditor from '../components/RichTextEditor'

const Dashboard = () => {
  const { isAuthenticated, token } = useAuth()
  const [articles, setArticles] = useState([])
  const [projects, setProjects] = useState([])
  const [stats, setStats] = useState(null)
  
  // Loading states
  const [articlesLoading, setArticlesLoading] = useState(false)
  const [projectsLoading, setProjectsLoading] = useState(false)
  const [statsLoading, setStatsLoading] = useState(false)
  
  // Article states
  const [showForm, setShowForm] = useState(false)
  const [editingArticle, setEditingArticle] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    content_type: 'markdown',
    category: '',
    tags: ''
  })
  
  // Project states
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [projectFormData, setProjectFormData] = useState({
    title: '',
    description: '',
    category: '',
    technologies: '',
    thumbnail_url: '',
    github_url: '',
    live_url: ''
  })

  useEffect(() => {
    if (isAuthenticated) {
      loadArticles()
      loadProjects()
      loadStats()
    }
  }, [isAuthenticated])

  const loadArticles = async () => {
    try {
      setArticlesLoading(true)
      const data = await api.getArticles()
      setArticles(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error loading articles:', error)
      setArticles([])
    } finally {
      setArticlesLoading(false)
    }
  }

  const loadProjects = async () => {
    try {
      setProjectsLoading(true)
      const data = await api.getProjects()
      setProjects(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error loading projects:', error)
      setProjects([])
    } finally {
      setProjectsLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      setStatsLoading(true)
      const data = await api.getStats()
      setStats(data)
    } catch (error) {
      console.error('Error loading stats:', error)
      setStats(null)
    } finally {
      setStatsLoading(false)
    }
  }

  // Article functions
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingArticle) {
        await api.updateArticle(editingArticle.id, formData, token)
      } else {
        await api.createArticle(formData, token)
      }
      setShowForm(false)
      setEditingArticle(null)
      setFormData({ 
        title: '', 
        content: '', 
        content_type: 'markdown',
        category: '', 
        tags: '' 
      })
      loadArticles()
    } catch (error) {
      console.error('Error saving article:', error)
      alert('Error saving article: ' + error.message)
    }
  }

  const handleEditArticle = (article) => {
    setEditingArticle(article)
    setFormData({
      title: article.title,
      content: article.content,
      content_type: article.content_type || 'markdown',
      category: article.category,
      tags: article.tags
    })
    setShowForm(true)
  }

  const handleDeleteArticle = async (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await api.deleteArticle(id, token)
        loadArticles()
      } catch (error) {
        console.error('Error deleting article:', error)
        alert('Error deleting article: ' + error.message)
      }
    }
  }

  // Project functions
  const handleProjectSubmit = async (e) => {
    e.preventDefault()
    try {
      const projectData = {
        ...projectFormData,
        technologies: projectFormData.technologies 
          ? JSON.stringify(projectFormData.technologies.split(',').map(tech => tech.trim()))
          : '[]'
      }

      if (editingProject) {
        await api.updateProject(editingProject.id, projectData, token)
      } else {
        await api.createProject(projectData, token)
      }
      setShowProjectForm(false)
      setEditingProject(null)
      setProjectFormData({ 
        title: '', description: '', category: '', technologies: '',
        thumbnail_url: '', github_url: '', live_url: '' 
      })
      loadProjects()
    } catch (error) {
      console.error('Error saving project:', error)
      alert('Error saving project: ' + error.message)
    }
  }

  const handleEditProject = (project) => {
    setEditingProject(project)
    let technologiesString = ''
    try {
      if (project.technologies) {
        const techArray = JSON.parse(project.technologies)
        technologiesString = Array.isArray(techArray) ? techArray.join(', ') : ''
      }
    } catch (e) {
      console.error('Error parsing technologies:', e)
      technologiesString = project.technologies || ''
    }

    setProjectFormData({
      title: project.title || '',
      description: project.description || '',
      category: project.category || '',
      technologies: technologiesString,
      thumbnail_url: project.thumbnail_url || '',
      github_url: project.github_url || '',
      live_url: project.live_url || ''
    })
    setShowProjectForm(true)
  }

  const handleDeleteProject = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await api.deleteProject(id, token)
        loadProjects()
      } catch (error) {
        console.error('Error deleting project:', error)
        alert('Error deleting project: ' + error.message)
      }
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-neon-red text-2xl mb-4">Access Denied</div>
          <p className="text-gray-300">Please log in to access the dashboard.</p>
        </div>
      </div>
    )
  }

  const chartOptions = {
    chart: {
      type: 'bar',
      foreColor: '#39ff14',
      toolbar: { show: false },
      background: 'transparent'
    },
    colors: ['#39ff14'],
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false,
      }
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: ['Articles', 'Categories', 'Views'],
    },
    grid: {
      borderColor: '#39ff14',
      strokeDashArray: 4
    }
  }

  const chartSeries = stats ? [{
    name: 'Stats',
    data: [stats.total_articles, stats.total_categories, stats.total_views]
  }] : []

  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="container mx-auto px-6">
        {/* Terminal Header */}
        <div className="terminal-border p-6 mb-8 rounded-lg">
          <div className="font-mono text-neon-green">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-3 h-3 bg-neon-red rounded-full"></div>
              <div className="w-3 h-3 bg-neon-green rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <span className="ml-2">admin@portfolio:~$ dashboard --start</span>
            </div>
            <div className="typing-animation">Welcome to Admin Dashboard. Type 'help' for commands.</div>
          </div>
        </div>

        {/* Stats Cards */}
        {statsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="dashboard-panel p-6 rounded-lg animate-pulse">
                <div className="h-8 bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="dashboard-panel p-6 rounded-lg">
              <div className="text-3xl font-mono text-neon-green mb-2">{stats.total_articles}</div>
              <div className="text-gray-300">Total Articles</div>
            </div>
            <div className="dashboard-panel p-6 rounded-lg">
              <div className="text-3xl font-mono text-neon-green mb-2">{stats.total_categories}</div>
              <div className="text-gray-300">Categories</div>
            </div>
            <div className="dashboard-panel p-6 rounded-lg">
              <div className="text-3xl font-mono text-neon-green mb-2">{stats.total_views}</div>
              <div className="text-gray-300">Total Views</div>
            </div>
          </div>
        ) : null}

        {/* Chart */}
        <div className="dashboard-panel p-6 rounded-lg mb-8">
          <h3 className="font-mono text-neon-green text-xl mb-4">Statistics Overview</h3>
          {stats ? (
            <Chart 
              options={chartOptions} 
              series={chartSeries} 
              type="bar" 
              height={300} 
            />
          ) : (
            <div className="h-80 flex items-center justify-center">
              <div className="font-mono text-gray-400">No statistics data available</div>
            </div>
          )}
        </div>

        {/* Articles Management */}
        <div className="dashboard-panel p-6 rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-mono text-neon-green text-xl">Articles Management</h3>
            <button
              onClick={() => setShowForm(true)}
              className="font-mono px-4 py-2 bg-neon-green text-black hover:neon-glow transition-all duration-300"
            >
              + New Article
            </button>
          </div>

          {/* Article Form */}
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-4 border border-neon-green rounded-lg"
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full p-2 bg-black border border-neon-green text-white font-mono"
                  required
                />
                
                {/* Rich Text Editor */}
                <div>
                  <label className="font-mono text-neon-green text-sm mb-2 block">
                    Content (Markdown)
                  </label>
                  <RichTextEditor
                    value={formData.content}
                    onChange={(value) => setFormData({...formData, content: value || ''})}
                    token={token}
                  />
                </div>

                <input
                  type="text"
                  placeholder="Category"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full p-2 bg-black border border-neon-green text-white font-mono"
                />
                <input
                  type="text"
                  placeholder="Tags (comma separated)"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  className="w-full p-2 bg-black border border-neon-green text-white font-mono"
                />
                
                {/* Content Type Selector */}
                <div>
                  <label className="font-mono text-neon-green text-sm mb-2 block">
                    Content Type
                  </label>
                  <select
                    value={formData.content_type}
                    onChange={(e) => setFormData({...formData, content_type: e.target.value})}
                    className="w-full p-2 bg-black border border-neon-green text-white font-mono"
                  >
                    <option value="markdown">Markdown</option>
                    <option value="html">HTML</option>
                  </select>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="font-mono px-4 py-2 bg-neon-green text-black hover:neon-glow"
                  >
                    {editingArticle ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      setEditingArticle(null)
                      setFormData({ 
                        title: '', 
                        content: '', 
                        content_type: 'markdown',
                        category: '', 
                        tags: '' 
                      })
                    }}
                    className="font-mono px-4 py-2 border border-neon-red text-neon-red hover:neon-glow"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Articles List */}
          <div className="space-y-4">
            {articlesLoading ? (
              <div className="text-center py-4">
                <div className="font-mono text-neon-green">Loading articles...</div>
              </div>
            ) : articles && articles.length > 0 ? (
              articles.map((article) => (
                <div key={article.id} className="border border-gray-700 p-4 rounded-lg hover:border-neon-green transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-mono text-neon-green text-lg mb-2">{article.title}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-300 mb-2">
                        <span>{article.category}</span>
                        <span>•</span>
                        <span className="font-mono text-xs px-2 py-1 bg-gray-800 rounded">
                          {article.content_type || 'markdown'}
                        </span>
                        <span>•</span>
                        <span>{new Date(article.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-400 text-sm line-clamp-2">
                        {article.content.substring(0, 150)}...
                      </p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleEditArticle(article)}
                        className="font-mono text-xs px-3 py-1 border border-neon-green text-neon-green hover:neon-glow"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteArticle(article.id)}
                        className="font-mono text-xs px-3 py-1 border border-neon-red text-neon-red hover:neon-glow"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <div className="font-mono text-gray-400">No articles found</div>
              </div>
            )}
          </div>
        </div>

        {/* Projects Management */}
        <div className="dashboard-panel p-6 rounded-lg mt-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-mono text-neon-green text-xl">Projects Management</h3>
            <button
              onClick={() => setShowProjectForm(true)}
              className="font-mono px-4 py-2 bg-neon-green text-black hover:neon-glow transition-all duration-300"
            >
              + New Project
            </button>
          </div>

          {/* Project Form */}
          {showProjectForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-4 border border-neon-green rounded-lg"
            >
              <form onSubmit={handleProjectSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Title"
                  value={projectFormData.title}
                  onChange={(e) => setProjectFormData({...projectFormData, title: e.target.value})}
                  className="w-full p-2 bg-black border border-neon-green text-white font-mono"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={projectFormData.description}
                  onChange={(e) => setProjectFormData({...projectFormData, description: e.target.value})}
                  rows="4"
                  className="w-full p-2 bg-black border border-neon-green text-white font-mono"
                  required
                />
                <select
                  value={projectFormData.category}
                  onChange={(e) => setProjectFormData({...projectFormData, category: e.target.value})}
                  className="w-full p-2 bg-black border border-neon-green text-white font-mono"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="fullstack">Full Stack</option>
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                </select>
                <input
                  type="text"
                  placeholder="Technologies (comma separated)"
                  value={projectFormData.technologies}
                  onChange={(e) => setProjectFormData({...projectFormData, technologies: e.target.value})}
                  className="w-full p-2 bg-black border border-neon-green text-white font-mono"
                />
                <input
                  type="url"
                  placeholder="Thumbnail URL"
                  value={projectFormData.thumbnail_url}
                  onChange={(e) => setProjectFormData({...projectFormData, thumbnail_url: e.target.value})}
                  className="w-full p-2 bg-black border border-neon-green text-white font-mono"
                />
                <input
                  type="url"
                  placeholder="GitHub URL"
                  value={projectFormData.github_url}
                  onChange={(e) => setProjectFormData({...projectFormData, github_url: e.target.value})}
                  className="w-full p-2 bg-black border border-neon-green text-white font-mono"
                />
                <input
                  type="url"
                  placeholder="Live Demo URL"
                  value={projectFormData.live_url}
                  onChange={(e) => setProjectFormData({...projectFormData, live_url: e.target.value})}
                  className="w-full p-2 bg-black border border-neon-green text-white font-mono"
                />
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="font-mono px-4 py-2 bg-neon-green text-black hover:neon-glow"
                  >
                    {editingProject ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowProjectForm(false)
                      setEditingProject(null)
                      setProjectFormData({ 
                        title: '', description: '', category: '', technologies: '',
                        thumbnail_url: '', github_url: '', live_url: '' 
                      })
                    }}
                    className="font-mono px-4 py-2 border border-neon-red text-neon-red hover:neon-glow"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Projects List */}
          <div className="space-y-4">
            {projectsLoading ? (
              <div className="text-center py-4">
                <div className="font-mono text-neon-green">Loading projects...</div>
              </div>
            ) : projects && projects.length > 0 ? (
              projects.map((project) => (
                <div key={project.id} className="border border-gray-700 p-4 rounded-lg hover:border-neon-green transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-4">
                      {project.thumbnail_url && (
                        <img 
                          src={project.thumbnail_url} 
                          alt={project.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div>
                        <h4 className="font-mono text-neon-green text-lg">{project.title}</h4>
                        <p className="text-gray-300 text-sm mt-1 capitalize">{project.category} • {new Date(project.created_at).toLocaleDateString()}</p>
                        <p className="text-gray-400 text-sm mt-2 line-clamp-2">{project.description}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditProject(project)}
                        className="font-mono text-xs px-3 py-1 border border-neon-green text-neon-green hover:neon-glow"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="font-mono text-xs px-3 py-1 border border-neon-red text-neon-red hover:neon-glow"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <div className="font-mono text-gray-400">No projects found</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard