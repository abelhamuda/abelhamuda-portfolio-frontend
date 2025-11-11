import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { api } from '../utils/api'
import MarkdownRenderer from '../components/MarkdownRenderer'

const ArticleDetail = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [relatedArticles, setRelatedArticles] = useState([])

  useEffect(() => {
    loadArticle()
  }, [slug])

  useEffect(() => {
    if (article) {
      loadRelatedArticles()
    }
  }, [article])

  // Function to clean markdown for preview (same as in Articles.jsx)
  const cleanMarkdownPreview = (content, maxLength = 100) => {
    if (!content) return ''
    
    let cleanText = content
      .replace(/^#+\s+/gm, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/```[\s\S]*?```/g, '[code]')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/!\[.*?\]\(.*?\)/g, '[image]')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/^>\s+/gm, '')
      .replace(/^---$/gm, '')
      .replace(/\n+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()

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

  const loadArticle = async () => {
    try {
      const data = await api.getArticleBySlug(slug)
      setArticle(data)
    } catch (error) {
      console.error('Error loading article:', error)
      navigate('/articles')
    } finally {
      setLoading(false)
    }
  }

  const loadRelatedArticles = async () => {
    try {
      const allArticles = await api.getArticles()
      const related = allArticles
        .filter(a => a.slug !== slug && a.category === article?.category)
        .slice(0, 3)
      setRelatedArticles(related)
    } catch (error) {
      console.error('Error loading related articles:', error)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
        <div className="font-mono text-neon-green text-xl">Loading article...</div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="font-mono text-neon-red text-2xl mb-4">Article Not Found</div>
          <Link to="/articles" className="font-mono text-neon-green hover:neon-glow">
            ← Back to Articles
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black pt-20 pb-10">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <Link 
            to="/articles" 
            className="font-mono text-neon-green hover:neon-glow transition-all duration-300 inline-flex items-center space-x-2"
          >
            <span>←</span>
            <span>Back to Articles</span>
          </Link>
        </motion.div>

        {/* Article Header */}
        <motion.header
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex items-center space-x-3">
              <span className="font-mono text-sm px-3 py-1 border border-neon-green text-neon-green rounded-full">
                {article.category || 'Uncategorized'}
              </span>
              {article.content_type === 'markdown' && (
                <span className="font-mono text-xs px-2 py-1 bg-gray-800 text-gray-300 rounded">
                  Markdown
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <time className="font-mono">
                {formatDate(article.created_at)}
              </time>
              <span className="font-mono">•</span>
              <span className="font-mono">📖 {getReadingTime(article.content)} min read</span>
            </div>
          </div>
          
          <h1 className="font-mono text-3xl md:text-5xl text-neon-green mb-6 leading-tight">
            {article.title}
          </h1>

          {/* Tags */}
          {article.tags && (
            <div className="flex flex-wrap gap-2 mb-6">
              {article.tags.split(',').map(tag => (
                <span
                  key={tag}
                  className="font-mono text-xs px-3 py-1 bg-gray-800 text-gray-300 rounded-full hover:bg-gray-700 transition-colors"
                >
                  #{tag.trim()}
                </span>
              ))}
            </div>
          )}
        </motion.header>

        {/* Article Content */}
        <motion.article
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="dashboard-panel p-6 md:p-8 rounded-lg mb-12"
        >
          {article.content_type === 'markdown' ? (
            <MarkdownRenderer content={article.content} />
          ) : (
            <div 
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: article.content }}
              style={{
                color: '#e5e7eb',
                fontFamily: 'Inter, sans-serif',
                lineHeight: '1.8'
              }}
            />
          )}

          {/* Article Metadata Footer */}
          <div className="mt-8 pt-6 border-t border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-400 space-y-2 sm:space-y-0">
              <div className="font-mono">
                📅 Published: {formatDate(article.created_at)}
              </div>
              {article.updated_at !== article.created_at && (
                <div className="font-mono">
                  ✏️ Updated: {formatDate(article.updated_at)}
                </div>
              )}
            </div>
          </div>
        </motion.article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mb-12"
          >
            <h2 className="font-mono text-2xl text-neon-green mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((relatedArticle, index) => (
                <motion.div
                  key={relatedArticle.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                  className="dashboard-panel p-6 rounded-lg hover:border-neon-green border border-gray-700 transition-all duration-300 cursor-pointer group"
                  onClick={() => navigate(`/articles/${relatedArticle.slug}`)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs px-2 py-1 border border-neon-green text-neon-green rounded-full">
                      {relatedArticle.category}
                    </span>
                    <span className="font-mono text-xs text-gray-400">
                      {getReadingTime(relatedArticle.content)} min
                    </span>
                  </div>

                  <h3 className="font-mono text-neon-green text-lg mb-3 line-clamp-2 group-hover:neon-glow transition-all duration-300">
                    {relatedArticle.title}
                  </h3>
                  
                  <p className="text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed">
                    {cleanMarkdownPreview(relatedArticle.content, 120)}
                  </p>

                  <div className="flex justify-between items-center text-xs text-gray-400">
                    <span>{formatDate(relatedArticle.created_at)}</span>
                    <span className="font-mono text-neon-green group-hover:neon-glow transition-all duration-300">
                      Read →
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-800"
        >
          <Link
            to="/articles"
            className="font-mono px-6 py-3 border border-neon-green text-neon-green hover:neon-glow transition-all duration-300 text-center w-full sm:w-auto"
          >
            ← All Articles
          </Link>
          
          <div className="flex gap-4 w-full sm:w-auto">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="font-mono px-6 py-3 border border-gray-600 text-gray-400 hover:border-neon-green hover:text-neon-green transition-all duration-300 text-center flex-1 sm:flex-none"
            >
              ↑ Top
            </button>
            <Link
              to="/contact"
              className="font-mono px-6 py-3 border border-neon-red text-neon-red hover:neon-glow transition-all duration-300 text-center flex-1 sm:flex-none"
            >
              Contact →
            </Link>
          </div>
        </motion.div>

        {/* Share Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="mt-8 pt-8 border-t border-gray-800 text-center"
        >
          <p className="font-mono text-gray-400 text-sm mb-4">
            Enjoyed this article? Share it with others!
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => {
                const url = window.location.href;
                navigator.clipboard.writeText(url);
                alert('Link copied to clipboard!');
              }}
              className="font-mono text-xs px-4 py-2 border border-neon-green text-neon-green hover:neon-glow transition-all duration-300"
            >
              Copy Link
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ArticleDetail