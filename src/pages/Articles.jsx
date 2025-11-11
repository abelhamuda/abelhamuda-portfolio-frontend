import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { api } from '../utils/api'

const Articles = () => {
  const [articles, setArticles] = useState([])
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadArticles()
  }, [])

  const loadArticles = async () => {
    try {
      const data = await api.getArticles()
      setArticles(data)
    } catch (error) {
      console.error('Error loading articles:', error)
    }
  }

  // Function to clean markdown for preview
  const cleanMarkdownPreview = (content, maxLength = 150) => {
    if (!content) return ''
    
    // Remove markdown syntax
    let cleanText = content
      // Remove headers
      .replace(/^#+\s+/gm, '')
      // Remove bold and italic
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      // Remove code blocks
      .replace(/```[\s\S]*?```/g, '[code]')
      .replace(/`([^`]+)`/g, '$1')
      // Remove images
      .replace(/!\[.*?\]\(.*?\)/g, '[image]')
      // Remove links but keep text
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      // Remove blockquotes
      .replace(/^>\s+/gm, '')
      // Remove horizontal rules
      .replace(/^---$/gm, '')
      // Remove extra whitespace
      .replace(/\n+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()

    // Truncate to max length
    if (cleanText.length > maxLength) {
      cleanText = cleanText.substring(0, maxLength) + '...'
    }

    return cleanText
  }

  // Function to get reading time
  const getReadingTime = (content) => {
    const wordsPerMinute = 200
    const wordCount = content.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / wordsPerMinute)
    return readingTime
  }

  const categories = ['all', ...new Set(articles.map(article => article.category).filter(Boolean))]

  const filteredArticles = articles.filter(article => {
    const matchesCategory = filter === 'all' || article.category === filter
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
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
          <h1 className="font-mono text-4xl md:text-6xl text-neon-green mb-4">Articles</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Thoughts, tutorials, and insights about web development, AI, and technology.
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          {/* Search Input */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-4 bg-black border border-neon-green text-white font-mono placeholder-gray-500 focus:outline-none focus:neon-glow"
            />
          </div>

          {/* Category Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-4 bg-black border border-neon-green text-white font-mono focus:outline-none focus:neon-glow"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </motion.div>

        {/* Articles Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredArticles.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
              className="dashboard-panel rounded-lg overflow-hidden group cursor-pointer h-full flex flex-col border border-gray-700 hover:border-neon-green transition-all duration-300"
            >
              {/* Article Header */}
              <div className="p-6 flex-1">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs px-3 py-1 border border-neon-green text-neon-green rounded-full">
                      {article.category || 'Uncategorized'}
                    </span>
                    {article.content_type === 'markdown' && (
                      <span className="font-mono text-xs px-2 py-1 bg-gray-800 text-gray-300 rounded">
                        MD
                      </span>
                    )}
                  </div>
                  <time className="font-mono text-xs text-gray-400">
                    {formatDate(article.created_at)}
                  </time>
                </div>

                <h2 className="font-mono text-xl text-neon-green mb-3 group-hover:neon-glow transition-all duration-300 line-clamp-2">
                  {article.title}
                </h2>

                {/* Clean Preview Text */}
                <p className="text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed">
                  {cleanMarkdownPreview(article.content)}
                </p>

                {/* Article Metadata */}
                <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                  <div className="flex items-center space-x-2">
                    <span>📖 {getReadingTime(article.content)} min read</span>
                  </div>
                  <span className="font-mono">
                    {article.content_type === 'markdown' ? 'Markdown' : 'HTML'}
                  </span>
                </div>

                {/* Tags */}
                {article.tags && (
                  <div className="flex flex-wrap gap-2">
                    {article.tags.split(',').slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="font-mono text-xs px-2 py-1 bg-gray-800 text-gray-300 rounded"
                      >
                        #{tag.trim()}
                      </span>
                    ))}
                    {article.tags.split(',').length > 3 && (
                      <span className="font-mono text-xs px-2 py-1 bg-gray-800 text-gray-300 rounded">
                        +{article.tags.split(',').length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Read More Button */}
              <div className="p-6 pt-0 mt-auto">
                <Link
                  to={`/articles/${article.slug}`}
                  className="font-mono text-sm px-4 py-2 border border-neon-green text-neon-green hover:neon-glow transition-all duration-300 inline-block w-full text-center group-hover:bg-neon-green group-hover:text-black"
                >
                  Read Article →
                </Link>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredArticles.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="font-mono text-neon-red text-lg mb-4">No articles found</div>
            <p className="text-gray-400">
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your search or filter criteria' 
                : 'No articles have been published yet'}
            </p>
          </motion.div>
        )}

        {/* Load More Button (for future pagination) */}
        {filteredArticles.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-center mt-12"
          >
            <button className="font-mono px-8 py-3 border border-neon-green text-neon-green hover:neon-glow transition-all duration-300">
              Load More Articles
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Articles