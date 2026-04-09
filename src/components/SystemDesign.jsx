import { motion } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Text, Line } from '@react-three/drei'
import * as THREE from 'three'

const SystemDiagram = () => {
  const nodes = [
    { id: 'client', position: [-4, 2, 0], label: 'Client', color: '#00d4ff' },
    { id: 'api', position: [0, 2, 0], label: 'API Gateway', color: '#00ff88' },
    { id: 'auth', position: [-2, 0, 0], label: 'Auth Service', color: '#ff6b6b' },
    { id: 'payment', position: [2, 0, 0], label: 'Payment Service', color: '#ffd93d' },
    { id: 'db', position: [0, -2, 0], label: 'Database', color: '#a855f7' },
  ]

  const connections = [
    { from: 'client', to: 'api' },
    { from: 'api', to: 'auth' },
    { from: 'api', to: 'payment' },
    { from: 'auth', to: 'db' },
    { from: 'payment', to: 'db' },
  ]

  return (
    <group>
      {nodes.map((node) => (
        <group key={node.id} position={node.position}>
          <mesh>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial color={node.color} emissive={node.color} emissiveIntensity={0.2} />
          </mesh>
          <Text
            position={[0, -0.8, 0]}
            fontSize={0.2}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            {node.label}
          </Text>
        </group>
      ))}

      {connections.map((conn, index) => {
        const fromNode = nodes.find(n => n.id === conn.from)
        const toNode = nodes.find(n => n.id === conn.to)
        const points = [fromNode.position, toNode.position]

        return (
          <Line
            key={index}
            points={points}
            color="#00d4ff"
            lineWidth={2}
            transparent
            opacity={0.6}
          />
        )
      })}
    </group>
  )
}

const SystemDesign = () => {
  const designs = [
    {
      title: 'Payment System Architecture',
      description: 'Secure, scalable payment processing with multiple gateways and fraud detection',
      components: [
        'API Gateway (Rate Limiting)',
        'Payment Processor (Stripe/PayPal)',
        'Fraud Detection Service',
        'Webhook Handler',
        'Transaction Database',
        'Notification Service',
      ],
      technologies: ['Node.js', 'Stripe SDK', 'Redis', 'PostgreSQL', 'Webhooks'],
      diagram: 'payment-flow',
    },
    {
      title: 'Real-time Chat System',
      description: 'Scalable WebSocket-based chat with presence, typing indicators, and message persistence',
      components: [
        'WebSocket Server (Socket.IO)',
        'Message Queue (Redis)',
        'Chat Database (MongoDB)',
        'Presence Service',
        'File Upload Service',
        'Notification Service',
      ],
      technologies: ['Socket.IO', 'Redis Pub/Sub', 'MongoDB', 'AWS S3', 'Push Notifications'],
      diagram: 'chat-architecture',
    },
    {
      title: 'API Gateway & Microservices',
      description: 'Centralized API management with service discovery, load balancing, and monitoring',
      components: [
        'API Gateway (Express/Kong)',
        'Service Registry (Consul)',
        'Load Balancer (NGINX)',
        'Monitoring (Prometheus)',
        'Logging (ELK Stack)',
        'Circuit Breaker',
      ],
      technologies: ['Kong Gateway', 'Consul', 'Docker', 'Prometheus', 'ELK Stack'],
      diagram: 'microservices',
    },
  ]

  return (
    <section id="system-design" className="py-12 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="inline-block px-4 py-2 glass rounded-full mb-4">
            <span className="text-accent font-mono text-sm uppercase tracking-wider">06</span>
          </div>
          <h2 className="section-title">System Design</h2>
          <p className="section-subtitle">Architecting scalable, reliable backend systems</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-text-primary mb-4">Distributed Systems Thinking</h3>
            <p className="text-text-secondary mb-6 leading-relaxed">
              I design systems that are <span className="text-accent">scalable</span>,
              <span className="text-accent-secondary"> fault-tolerant</span>, and
              <span className="text-accent"> maintainable</span>. My approach focuses on:
            </p>
            <ul className="space-y-3">
              {[
                'Microservices architecture with clear boundaries',
                'Event-driven communication patterns',
                'Database optimization and indexing strategies',
                'Caching layers for performance',
                'Monitoring and observability',
                'Security-first design principles',
              ].map((item, index) => (
                <motion.li
                  key={index}
                  className="flex items-center gap-3 text-text-secondary"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <span className="w-2 h-2 bg-accent rounded-full flex-shrink-0"></span>
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="h-96 glass-card rounded-xl overflow-hidden relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Canvas
              camera={{ position: [0, 0, 8], fov: 60 }}
              style={{ background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(0, 255, 136, 0.1))' }}
            >
              <ambientLight intensity={0.6} />
              <pointLight position={[10, 10, 10]} intensity={1} />
              <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00ff88" />
              <SystemDiagram />
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                autoRotate
                autoRotateSpeed={0.5}
              />
            </Canvas>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {designs.map((design, index) => (
            <motion.div
              key={index}
              className="glass p-6 rounded-xl"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <h4 className="text-xl font-bold text-text-primary mb-3">{design.title}</h4>
              <p className="text-text-secondary mb-4 leading-relaxed">{design.description}</p>

              <div className="mb-4">
                <h5 className="text-accent font-semibold mb-2">Key Components</h5>
                <ul className="space-y-1">
                  {design.components.map((component, compIndex) => (
                    <li key={compIndex} className="text-text-secondary text-sm flex items-center gap-2">
                      <span className="w-1 h-1 bg-accent-secondary rounded-full"></span>
                      {component}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="text-accent font-semibold mb-2">Technologies</h5>
                <div className="flex flex-wrap gap-2">
                  {design.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-2 py-1 bg-accent/10 text-accent font-mono text-xs rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SystemDesign