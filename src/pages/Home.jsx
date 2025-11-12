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
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-4xl sm:text-6xl md:text-8xl font-mono font-bold mb-4 sm:mb-6 leading-tight"
          >
            <span className="text-neon-green">abel</span>
            <span className="text-neon-red">hamuda</span>
          </motion.h1>
          
          <div className="h-16 sm:h-12 mb-6 sm:mb-8 px-2">
            <div className="typing-animation font-mono text-base sm:text-xl md:text-2xl text-neon-green inline-block break-words">
              {displayText}
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="text-gray-300 text-base sm:text-lg mb-8 sm:mb-12 max-w-2xl mx-auto px-4"
          >
            Building the future with code, creativity, and cutting-edge technology. 
            Welcome to my digital playground.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center px-4"
          >
            <Link
              to="/projects"
              className="font-mono px-6 sm:px-8 py-3 sm:py-4 border-2 border-neon-green text-neon-green hover:neon-glow transition-all duration-300 text-sm sm:text-base min-h-[48px] flex items-center justify-center"
            >
              View Projects
            </Link>
            <Link
              to="/contact"
              className="font-mono px-6 sm:px-8 py-3 sm:py-4 border-2 border-neon-red text-neon-red hover:neon-glow transition-all duration-300 text-sm sm:text-base min-h-[48px] flex items-center justify-center"
            >
              Get In Touch
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {[
            { number: '50+', label: 'Projects Completed' },
            { number: '3+', label: 'Years Experience' },
            { number: '100%', label: 'Passion Driven' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              className="dashboard-panel p-6 sm:p-8 text-center rounded-lg"
            >
              <div className="text-3xl sm:text-4xl font-mono font-bold text-neon-green mb-2">
                {stat.number}
              </div>
              <div className="text-sm sm:text-base text-gray-300 font-sans">
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