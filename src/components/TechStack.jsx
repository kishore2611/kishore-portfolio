import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

const TechStack = () => {
  const [hoveredTech, setHoveredTech] = useState(null)

  const techCategories = [
    {
      title: 'Backend & APIs',
      color: 'from-blue-500 to-cyan-500',
      technologies: [
        { name: 'Node.js', icon: '🟢', level: 95, description: 'Server-side JavaScript runtime' },
        { name: 'Express.js', icon: '🚀', level: 90, description: 'Fast, unopinionated web framework' },
        { name: 'REST APIs', icon: '🔗', level: 95, description: 'RESTful API design and implementation' },
        { name: 'GraphQL', icon: '📊', level: 85, description: 'Query language for APIs' },
        { name: 'Microservices', icon: '🏗️', level: 88, description: 'Distributed system architecture' },
      ]
    },
    {
      title: 'Databases',
      color: 'from-green-500 to-emerald-500',
      technologies: [
        { name: 'MongoDB', icon: '🍃', level: 90, description: 'NoSQL document database' },
        { name: 'PostgreSQL', icon: '🐘', level: 85, description: 'Advanced open source relational database' },
        { name: 'Redis', icon: '🔴', level: 80, description: 'In-memory data structure store' },
        { name: 'MySQL', icon: '🗄️', level: 75, description: 'Popular relational database' },
      ]
    },
    {
      title: 'Cloud & DevOps',
      color: 'from-purple-500 to-pink-500',
      technologies: [
        { name: 'AWS', icon: '☁️', level: 85, description: 'Cloud computing platform' },
        { name: 'Docker', icon: '🐳', level: 90, description: 'Containerization platform' },
        { name: 'Kubernetes', icon: '⚓', level: 75, description: 'Container orchestration' },
        { name: 'CI/CD', icon: '🔄', level: 88, description: 'Continuous integration and deployment' },
        { name: 'Nginx', icon: '🌐', level: 80, description: 'Web server and reverse proxy' },
      ]
    },
    {
      title: 'Tools & Languages',
      color: 'from-orange-500 to-red-500',
      technologies: [
        { name: 'JavaScript', icon: '🟨', level: 95, description: 'Dynamic programming language' },
        { name: 'TypeScript', icon: '🔷', level: 85, description: 'Typed superset of JavaScript' },
        { name: 'Python', icon: '🐍', level: 80, description: 'High-level programming language' },
        { name: 'Git', icon: '📚', level: 90, description: 'Version control system' },
        { name: 'Linux', icon: '🐧', level: 85, description: 'Open source operating system' },
      ]
    }
  ]

  return (
    <section id="techstack" className="py-12 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="inline-block px-4 py-2 glass-button rounded-full mb-4">
            <span className="text-accent font-mono text-sm uppercase tracking-wider">09</span>
          </div>
          <h2 className="section-title">Technology Stack</h2>
          <p className="section-subtitle">Comprehensive backend development toolkit and expertise</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {techCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              className="glass-card glass-hover rounded-xl p-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              viewport={{ once: true }}
            >
              <div className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${category.color} text-white text-sm font-medium mb-6`}>
                {category.title}
              </div>

              <div className="space-y-4">
                {category.technologies.map((tech, techIndex) => (
                  <motion.div
                    key={tech.name}
                    className="relative"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: (categoryIndex * 0.1) + (techIndex * 0.1) }}
                    viewport={{ once: true }}
                    onHoverStart={() => setHoveredTech(tech.name)}
                    onHoverEnd={() => setHoveredTech(null)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{tech.icon}</span>
                        <span className="font-semibold text-text-primary">{tech.name}</span>
                      </div>
                      <span className="text-sm text-text-secondary font-mono">{tech.level}%</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full glass rounded-full h-2 mb-2">
                      <motion.div
                        className={`h-2 rounded-full bg-gradient-to-r ${category.color}`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${tech.level}%` }}
                        transition={{ duration: 1, delay: (categoryIndex * 0.1) + (techIndex * 0.1) + 0.3 }}
                        viewport={{ once: true }}
                      />
                    </div>

                    {/* Hover Description */}
                    <AnimatePresence>
                      {hoveredTech === tech.name && (
                        <motion.div
                          className="absolute top-full left-0 right-0 mt-2 p-3 glass-card rounded-lg z-10"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <p className="text-sm text-text-secondary">{tech.description}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TechStack