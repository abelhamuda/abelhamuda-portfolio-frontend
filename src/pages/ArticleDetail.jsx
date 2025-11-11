import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { api } from '../utils/api'

const ArticleDetail = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [relatedArticles, setRelatedArticles] = useState([])

  useEffect(() => {
    loadArticle()
    loadRelatedArticles()
  }, [slug])

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
      // Filter articles dengan category yang sama (exclude current article)
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
            className="font-mono text-neon-green hover:neon-glow transition-all duration-300"
          >
            ← Back to Articles
          </Link>
        </motion.div>

        {/* Article Header */}
        <motion.header
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-sm px-3 py-1 border border-neon-green text-neon-green rounded-full">
              {article.category || 'Uncategorized'}
            </span>
            <time className="font-mono text-sm text-gray-400">
              {formatDate(article.created_at)}
            </time>
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
                  className="font-mono text-xs px-3 py-1 bg-gray-800 text-gray-300 rounded-full"
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
          className="dashboard-panel p-8 rounded-lg mb-12"
        >
          <div 
            className="prose prose-invert max-w-none"
            style={{
              color: '#e5e7eb',
              fontFamily: 'Inter, sans-serif',
              lineHeight: '1.8'
            }}
          >
            {/* Convert plain text to paragraphs */}
            {article.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-6 text-gray-300 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Article Metadata */}
          <div className="mt-8 pt-6 border-t border-gray-700">
            <div className="flex flex-wrap items-center justify-between text-sm text-gray-400">
              <div>
                Published: {formatDate(article.created_at)}
              </div>
              {article.updated_at !== article.created_at && (
                <div>
                  Updated: {formatDate(article.updated_at)}
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
                  className="dashboard-panel p-6 rounded-lg hover:neon-glow transition-all duration-300 cursor-pointer"
                  onClick={() => navigate(`/articles/${relatedArticle.slug}`)}
                >
                  <h3 className="font-mono text-neon-green text-lg mb-2 line-clamp-2">
                    {relatedArticle.title}
                  </h3>
                  <p className="text-gray-300 text-sm line-clamp-2 mb-3">
                    {relatedArticle.content.substring(0, 100)}...
                  </p>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-neon-green">{relatedArticle.category}</span>
                    <span className="text-gray-400">{formatDate(relatedArticle.created_at)}</span>
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
          className="flex justify-between items-center pt-8 border-t border-gray-800"
        >
          <Link
            to="/articles"
            className="font-mono px-6 py-3 border border-neon-green text-neon-green hover:neon-glow transition-all duration-300"
          >
            ← All Articles
          </Link>
          
          <Link
            to="/contact"
            className="font-mono px-6 py-3 border border-neon-red text-neon-red hover:neon-glow transition-all duration-300"
          >
            Get In Touch →
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default ArticleDetail