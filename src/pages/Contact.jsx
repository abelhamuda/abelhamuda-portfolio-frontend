import React, { useState } from 'react'
import { motion } from 'framer-motion'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 2000)
  }

  const socialLinks = [
    {
      name: 'GitHub',
      url: 'https://github.com/abelhamuda',
      icon: 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22'
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/yozabelhamuda',
      icon: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z'
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/ablhamuda',
      icon: 'M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z'
    },
    {
      name: 'Email',
      url: 'mailto:yozabelhamuda@gmail.com',
      icon: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6'
    }
  ]

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
          <h1 className="font-mono text-4xl md:text-6xl text-neon-green mb-4">Get In Touch</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Have a project in mind? Want to collaborate? Or just say hello? I'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="dashboard-panel p-8 rounded-lg"
          >
            <h2 className="font-mono text-2xl text-neon-green mb-6">Send Message</h2>
            
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="text-neon-green text-4xl mb-4">✓</div>
                <h3 className="font-mono text-neon-green text-xl mb-2">Message Sent!</h3>
                <p className="text-gray-300">Thanks for reaching out. I'll get back to you soon.</p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="font-mono mt-6 px-6 py-2 border border-neon-green text-neon-green hover:neon-glow transition-all duration-300"
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="font-mono text-neon-green text-sm block mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full p-4 bg-black border border-neon-green text-white font-mono placeholder-gray-500 focus:outline-none focus:neon-glow"
                      placeholder="Your Name"
                    />
                  </div>
                  <div>
                    <label className="font-mono text-neon-green text-sm block mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full p-4 bg-black border border-neon-green text-white font-mono placeholder-gray-500 focus:outline-none focus:neon-glow"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-mono text-neon-green text-sm block mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full p-4 bg-black border border-neon-green text-white font-mono placeholder-gray-500 focus:outline-none focus:neon-glow"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label className="font-mono text-neon-green text-sm block mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="w-full p-4 bg-black border border-neon-green text-white font-mono placeholder-gray-500 focus:outline-none focus:neon-glow resize-none"
                    placeholder="Tell me about your project or just say hello..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full font-mono py-4 bg-neon-green text-black hover:neon-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message →'}
                </button>
              </form>
            )}
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="space-y-8"
          >
            {/* Social Links */}
            <div className="dashboard-panel p-8 rounded-lg">
              <h2 className="font-mono text-2xl text-neon-green mb-6">Connect With Me</h2>
              <div className="grid grid-cols-2 gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center space-x-3 p-4 border border-neon-green text-neon-green hover:neon-glow transition-all duration-300 group"
                  >
                    <svg
                      className="w-5 h-5 group-hover:neon-glow transition-all duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={social.icon} />
                    </svg>
                    <span className="font-mono text-sm">{social.name}</span>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Contact Details */}
            <div className="dashboard-panel p-8 rounded-lg">
              <h2 className="font-mono text-2xl text-neon-green mb-6">Contact Info</h2>
              <div className="space-y-4">
                {[
                  { icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', 
                    label: 'Email', value: 'yozabelhamuda@gmail.com' },
                  { icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z', 
                    label: 'Phone', value: '+1 (555) 123-4567' },
                  { icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z', 
                    label: 'Location', value: 'Jakarta, Indonesia' }
                ].map((contact, index) => (
                  <motion.div
                    key={contact.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                    className="flex items-center space-x-4 p-3 hover:neon-glow transition-all duration-300 border border-transparent hover:border-neon-green rounded"
                  >
                    <svg
                      className="w-5 h-5 text-neon-green"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={contact.icon} />
                    </svg>
                    <div>
                      <div className="font-mono text-sm text-neon-green">{contact.label}</div>
                      <div className="text-gray-300 text-sm">{contact.value}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Availability Status */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.8 }}
              className="dashboard-panel p-6 rounded-lg text-center"
            >
              <div className="flex items-center justify-center space-x-2 mb-3">
                <div className="w-3 h-3 bg-neon-green rounded-full animate-pulse"></div>
                <span className="font-mono text-neon-green text-sm">Currently Available</span>
              </div>
              <p className="text-gray-300 text-sm">
                I'm currently available for freelance projects and collaborations.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Contact