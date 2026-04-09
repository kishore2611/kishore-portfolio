import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

const Projects = () => {
  const [expandedProject, setExpandedProject] = useState(null)

  const projects = [
    {
      title: 'Social App Backend',
      type: 'Social Platform',
      description: 'Full-featured social app with real-time one-to-one and group chat, 24-hour expiring stories, live streaming with 100MS, and exclusive paid groups via Stripe.',
      technologies: ['Node.js', 'Socket.IO', '100MS', 'MongoDB', 'Stripe', 'Express.js'],
      architecture: {
        components: ['API Gateway', 'Chat Service', 'Payment Service', 'Media Service', 'Notification Service'],
        database: 'MongoDB with sharding',
        caching: 'Redis for sessions and real-time data',
        deployment: 'Docker containers on AWS ECS',
      },
      challenges: ['Real-time synchronization', 'Scalable chat architecture', 'Payment security'],
      metrics: ['10k+ concurrent users', '99.9% uptime', 'Sub-second response times'],
    },
    {
      title: 'E-Commerce Platform',
      type: 'E-commerce',
      description: 'E-commerce platform with third-party product listing APIs, real-time order tracking, live rider-user chat via Socket.io, wallet system for users, and merchant payouts via Stripe.',
      technologies: ['Node.js', 'Socket.IO', 'Stripe', 'MongoDB', 'Express.js', 'Redis'],
      architecture: {
        components: ['Product API', 'Order Management', 'Payment Processing', 'Real-time Tracking', 'Wallet System'],
        database: 'MongoDB with read replicas',
        caching: 'Redis for product cache and sessions',
        deployment: 'Kubernetes on AWS EKS',
      },
      challenges: ['Complex order workflows', 'Real-time location tracking', 'Multi-party payments'],
      metrics: ['50k+ products', '100k+ orders processed', 'Real-time delivery tracking'],
    },
    {
      title: 'Ride Booking System',
      type: 'Mobility',
      description: 'Uber-like ride booking app with driver and user roles, real-time location updates via Socket.io, wallet system for users, and merchant payouts for drivers via Stripe.',
      technologies: ['Node.js', 'Socket.IO', 'Stripe', 'PostgreSQL', 'Express.js', 'Redis'],
      architecture: {
        components: ['Booking Engine', 'Location Service', 'Payment Gateway', 'Driver Matching', 'Route Optimization'],
        database: 'PostgreSQL with PostGIS',
        caching: 'Redis for real-time locations',
        deployment: 'Microservices on AWS Lambda',
      },
      challenges: ['Real-time driver matching', 'Location-based queries', 'Concurrent booking handling'],
      metrics: ['1M+ rides booked', 'Real-time GPS tracking', '99.5% successful matches'],
    },
  ]

  return (
    <section id="projects" className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="inline-block px-4 py-2 glass-button rounded-full mb-4">
            <span className="text-accent font-mono text-sm uppercase tracking-wider">05</span>
          </div>
          <h2 className="section-title">Featured Projects</h2>
          <p className="section-subtitle">Complex backend systems built for scale and performance</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              className="glass p-6 rounded-xl cursor-pointer group"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, y: -5 }}
              onClick={() => setExpandedProject(expandedProject === index ? null : index)}
            >
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 bg-accent/10 text-accent font-mono text-xs rounded-full">
                  {project.type}
                </span>
                <motion.div
                  animate={{ rotate: expandedProject === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-accent">▼</span>
                </motion.div>
              </div>

              <h3 className="text-xl font-bold text-text-primary mb-3 group-hover:text-accent transition-colors">
                {project.title}
              </h3>

              <p className="text-text-secondary mb-4 leading-relaxed">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.slice(0, 4).map((tech, techIndex) => (
                  <span
                    key={techIndex}
                    className="px-2 py-1 glass-button text-text-secondary font-mono text-xs rounded-full"
                  >
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 4 && (
                  <span className="px-2 py-1 glass-button text-text-secondary font-mono text-xs rounded-full">
                    +{project.technologies.length - 4}
                  </span>
                )}
              </div>

              <AnimatePresence>
                {expandedProject === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-border pt-4 mt-4"
                  >
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-accent font-semibold mb-2">System Architecture</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-text-secondary font-mono">Components:</p>
                            <ul className="text-text-secondary mt-1">
                              {project.architecture.components.map((comp, i) => (
                                <li key={i} className="flex items-center gap-2">
                                  <span className="w-1 h-1 bg-accent rounded-full"></span>
                                  {comp}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-text-secondary font-mono">Infrastructure:</p>
                            <ul className="text-text-secondary mt-1 space-y-1">
                              <li>• {project.architecture.database}</li>
                              <li>• {project.architecture.caching}</li>
                              <li>• {project.architecture.deployment}</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-accent font-semibold mb-2">Key Challenges</h4>
                        <div className="flex flex-wrap gap-2">
                          {project.challenges.map((challenge, i) => (
                            <span key={i} className="px-2 py-1 bg-accent/10 text-accent text-xs rounded">
                              {challenge}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-accent font-semibold mb-2">Performance Metrics</h4>
                        <div className="grid grid-cols-1 gap-1">
                          {project.metrics.map((metric, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-text-secondary">
                              <span className="w-2 h-2 bg-accent-secondary rounded-full"></span>
                              {metric}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Projects