import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { api } from '../utils/api'

const About = () => {
  const [displayText, setDisplayText] = useState('')
  const [currentLine, setCurrentLine] = useState(0)
  const [stats, setStats] = useState(null)

  const terminalLines = [
    "> cat about_me.txt",
    " ",
    "Name: Abel Hamuda",
    "Title: Full-Stack Developer",
    "Specialization: React.js, Go, AI/ML",
    " ",
    "Bio:",
    "Passionate developer with expertise in modern web technologies.",
    "Love building scalable applications and exploring AI frontiers.",
    "Always learning, always coding.",
    " ",
    "Skills: React, Go, Node.js, Python, MySQL, TailwindCSS",
    "Interests: AI, Open Source, Neurotechnology",
    " ",
    "> _"
  ]

  useEffect(() => {
    loadStats()
  }, [])

  useEffect(() => {
    if (currentLine < terminalLines.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + terminalLines[currentLine] + '\n')
        setCurrentLine(prev => prev + 1)
      }, 100)
      return () => clearTimeout(timeout)
    }
  }, [currentLine, terminalLines])

  const loadStats = async () => {
    try {
      const data = await api.getStats()
      setStats(data)
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const skills = [
    { name: 'React.js', level: 90 },
    { name: 'Go', level: 85 },
    { name: 'Node.js', level: 80 },
    { name: 'Python', level: 75 },
    { name: 'MySQL', level: 85 },
    { name: 'TailwindCSS', level: 90 }
  ]

  return (
    <div className="min-h-screen bg-black pt-20 pb-10">
      <div className="container mx-auto px-6">
        {/* Terminal Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="terminal-border p-6 rounded-lg mb-12"
        >
          <div className="font-mono text-sm text-neon-green whitespace-pre-line h-96 overflow-y-auto">
            {displayText}
          </div>
        </motion.div>

        {/* Stats Section */}
        {stats && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
          >
            <div className="dashboard-panel p-6 text-center rounded-lg">
              <div className="text-3xl font-mono text-neon-green mb-2">{stats.total_articles}+</div>
              <div className="text-gray-300 text-sm">Articles Written</div>
            </div>
            <div className="dashboard-panel p-6 text-center rounded-lg">
              <div className="text-3xl font-mono text-neon-green mb-2">{stats.total_categories}</div>
              <div className="text-gray-300 text-sm">Categories</div>
            </div>
            <div className="dashboard-panel p-6 text-center rounded-lg">
              <div className="text-3xl font-mono text-neon-green mb-2">{stats.total_views}</div>
              <div className="text-gray-300 text-sm">Total Views</div>
            </div>
            <div className="dashboard-panel p-6 text-center rounded-lg">
              <div className="text-3xl font-mono text-neon-green mb-2">3+</div>
              <div className="text-gray-300 text-sm">Years Experience</div>
            </div>
          </motion.div>
        )}

        {/* Skills Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="dashboard-panel p-8 rounded-lg"
        >
          <h2 className="font-mono text-2xl text-neon-green mb-8 text-center">Technical Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skills.map((skill, index) => (
              <div key={skill.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-mono text-neon-green">{skill.name}</span>
                  <span className="font-mono text-gray-300">{skill.level}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ delay: 1 + index * 0.1, duration: 1 }}
                    className="progress-bar h-2 rounded-full"
                  ></motion.div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Experience Timeline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="dashboard-panel p-8 rounded-lg mt-12"
        >
          <h2 className="font-mono text-2xl text-neon-green mb-8 text-center">Experience Timeline</h2>
          <div className="space-y-6">
            {[
              {
                year: '2023 - Present',
                role: 'Senior Full-Stack Developer',
                company: 'Neurodex AI',
                description: 'Leading development of AI-powered web applications using React and Go'
              },
              {
                year: '2021 - 2023',
                role: 'Full-Stack Developer',
                company: 'Tech Innovations Inc',
                description: 'Built scalable web applications and REST APIs for various clients'
              },
              {
                year: '2020 - 2021',
                role: 'Frontend Developer',
                company: 'Digital Solutions Co',
                description: 'Developed responsive web interfaces and implemented modern UI/UX designs'
              }
            ].map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4 + index * 0.2, duration: 0.5 }}
                className="flex items-start space-x-4 p-4 border-l-4 border-neon-green hover:neon-glow transition-all duration-300"
              >
                <div className="font-mono text-neon-green text-sm min-w-24">{exp.year}</div>
                <div>
                  <h3 className="font-mono text-neon-green text-lg">{exp.role}</h3>
                  <p className="font-mono text-gray-300 text-sm mb-2">{exp.company}</p>
                  <p className="text-gray-400 text-sm">{exp.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default About