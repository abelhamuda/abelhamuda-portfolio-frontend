import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const Home = () => {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const fullText = "Full-Stack Developer & AI Enthusiast"

  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + fullText[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, 100)
      return () => clearTimeout(timeout)
    }
  }, [currentIndex, fullText])

  return (
    <div className="min-h-screen bg-black pt-20">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-6xl md:text-8xl font-mono font-bold mb-6"
          >
            <span className="text-neon-green">abel</span>
            <span className="text-neon-red">hamuda</span>
          </motion.h1>
          
          <div className="h-12 mb-8">
            <div className="typing-animation font-mono text-xl md:text-2xl text-neon-green inline-block">
              {displayText}
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="text-gray-300 text-lg mb-12 max-w-2xl mx-auto"
          >
            Building the future with code, creativity, and cutting-edge technology. 
            Welcome to my digital playground.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/projects"
              className="font-mono px-8 py-4 border-2 border-neon-green text-neon-green hover:neon-glow transition-all duration-300"
            >
              View Projects
            </Link>
            <Link
              to="/contact"
              className="font-mono px-8 py-4 border-2 border-neon-red text-neon-red hover:neon-glow transition-all duration-300"
            >
              Get In Touch
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { number: '50+', label: 'Projects Completed' },
            { number: '3+', label: 'Years Experience' },
            { number: '100%', label: 'Passion Driven' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              className="dashboard-panel p-8 text-center rounded-lg"
            >
              <div className="text-4xl font-mono font-bold text-neon-green mb-2">
                {stat.number}
              </div>
              <div className="text-gray-300 font-sans">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home