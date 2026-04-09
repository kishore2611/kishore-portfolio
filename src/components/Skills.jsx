import { motion } from 'framer-motion'
import { useState } from 'react'

const Skills = () => {
  const [hoveredSkill, setHoveredSkill] = useState(null)

  const skillCategories = [
    {
      title: 'Backend Runtime',
      icon: '⚙️',
      skills: ['Node.js', 'Express.js', 'NestJS'],
      description: 'Building robust server-side applications with modern frameworks',
    },
    {
      title: 'Databases',
      icon: '🗄️',
      skills: ['MongoDB', 'PostgreSQL', 'MySQL', 'Redis'],
      description: 'Designing efficient data storage and retrieval systems',
    },
    {
      title: 'Payments & APIs',
      icon: '💳',
      skills: ['Stripe', 'PayPal', 'REST APIs', 'GraphQL'],
      description: 'Integrating payment systems and building scalable APIs',
    },
    {
      title: 'Real-time Systems',
      icon: '📡',
      skills: ['Socket.IO', 'WebSocket', 'Redis Pub/Sub'],
      description: 'Creating real-time communication and event-driven architectures',
    },
    {
      title: 'Live Streaming',
      icon: '🎥',
      skills: ['Agora', '100MS', 'WebRTC'],
      description: 'Implementing live video streaming and interactive features',
    },
    {
      title: 'Security & Auth',
      icon: '🔒',
      skills: ['OAuth', 'JWT', 'bcrypt', 'helmet'],
      description: 'Implementing secure authentication and authorization systems',
    },
    {
      title: 'DevOps & Tools',
      icon: '🛠️',
      skills: ['Docker', 'AWS', 'Git', 'PM2'],
      description: 'Deployment, monitoring, and development workflow optimization',
    },
    {
      title: 'Testing & Quality',
      icon: '✅',
      skills: ['Jest', 'Supertest', 'ESLint', 'Prettier'],
      description: 'Ensuring code quality and reliability through comprehensive testing',
    },
  ]

  return (
    <section id="skills" className="py-12 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="inline-block px-4 py-2 glass-button rounded-full mb-4">
            <span className="text-accent font-mono text-sm uppercase tracking-wider">04</span>
          </div>
          <h2 className="section-title">Core Skills</h2>
          <p className="section-subtitle">Technologies and tools I use to build scalable backend systems</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {skillCategories.map((category, index) => (
            <motion.div
              key={index}
              className="glass p-6 rounded-xl cursor-pointer group"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{
                scale: 1.05,
                y: -10,
                boxShadow: '0 20px 40px rgba(0, 212, 255, 0.1)'
              }}
              onHoverStart={() => setHoveredSkill(index)}
              onHoverEnd={() => setHoveredSkill(null)}
            >
              <motion.div
                className="text-3xl mb-4"
                animate={hoveredSkill === index ? { rotate: 360 } : { rotate: 0 }}
                transition={{ duration: 0.6 }}
              >
                {category.icon}
              </motion.div>

              <h3 className="text-lg font-semibold text-text-primary mb-3 group-hover:text-accent transition-colors">
                {category.title}
              </h3>

              <motion.p
                className="text-text-secondary text-sm mb-4 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredSkill === index ? 1 : 0.7 }}
                transition={{ duration: 0.3 }}
              >
                {category.description}
              </motion.p>

              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, skillIndex) => (
                  <motion.span
                    key={skillIndex}
                    className="px-3 py-1 bg-accent/10 text-accent font-mono text-xs rounded-full border border-accent/20"
                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(0, 212, 255, 0.2)' }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Skills