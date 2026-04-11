import { useEffect, useRef, Suspense } from 'react'
import { gsap } from 'gsap'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Text, Line } from '@react-three/drei'
import LiquidGlass from './LiquidGlass'

import { MeshPhysicalMaterial, IcosahedronGeometry } from 'three'
import { Float, MeshDistortMaterial } from '@react-three/drei'

const SystemDiagram = () => {
  const nodes = [
    { id: 'client', position: [-3, 2, 0], label: 'Client', color: '#00d4ff' },
    { id: 'api', position: [0, 2, 0], label: 'API Gateway', color: '#00ff88' },
    { id: 'auth', position: [-2, 0, 0], label: 'Auth Service', color: '#ff6b6b' },
    { id: 'payment', position: [2, 0, 0], label: 'Payment Service', color: '#ffd93d' },
    { id: 'db', position: [0, -2, 0], label: 'Database Service', color: '#a855f7' },
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
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <mesh>
              <icosahedronGeometry args={[0.4, 1]} />
              <meshStandardMaterial 
                color={node.color}
                roughness={0.2}
                metalness={0.8}
                emissive={node.color}
                emissiveIntensity={0.5}
              />
            </mesh>
          </Float>
          <Text
            position={[0, -0.9, 0]}
            fontSize={0.25}
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
          <group key={index}>
            <Line
              points={points}
              color={fromNode.color}
              lineWidth={1.5}
              transparent
              opacity={0.4}
            />
            {/* Animated Data Packet */}
            <Float speed={5} rotationIntensity={0} floatIntensity={0.5}>
              <mesh position={points[0]}>
                <sphereGeometry args={[0.05, 16, 16]} />
                <meshStandardMaterial color={fromNode.color} emissive={fromNode.color} emissiveIntensity={2} />
              </mesh>
            </Float>
          </group>
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

  const sectionRef = useRef(null)
  const leftColRef = useRef(null)
  const rightColRef = useRef(null)
  const listItemsRef = useRef([])
  const designsRef = useRef([])

  useEffect(() => {
    gsap.fromTo(leftColRef.current,
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        }
      }
    )

    gsap.fromTo(listItemsRef.current,
      { opacity: 0, x: -20 },
      {
        opacity: 1,
        x: 0,
        duration: 0.5,
        stagger: 0.1,
        scrollTrigger: {
          trigger: leftColRef.current,
          start: 'top 70%',
        }
      }
    )

    gsap.fromTo(rightColRef.current,
      { opacity: 0, scale: 0.95 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        }
      }
    )

    gsap.fromTo(designsRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        scrollTrigger: {
          trigger: designsRef.current[0],
          start: 'top 90%',
        }
      }
    )
  }, [])

  return (
    <section id="system-design" ref={sectionRef} className="py-24 bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 glass-button rounded-full mb-4">
            <span className="text-accent font-mono text-sm uppercase tracking-widest font-bold">06 / System Design</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4 tracking-tight">Architectural Strategy</h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-lg leading-relaxed">Designing high-availability, distributed systems for performance.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div ref={leftColRef}>
            <h3 className="text-3xl font-bold text-text-primary mb-6">Distributed Thinking</h3>
            <p className="text-text-secondary mb-8 leading-relaxed text-lg italic">
              "Scalability is not just about more resources, it's about better organization."
            </p>
            <div className="space-y-4">
              {[
                'Microservices with encapsulated logic',
                'Event-driven communication (Redis Pub/Sub)',
                'Strategic database sharding & indexing',
                'Multi-tier caching strategies',
                'Comprehensive monitoring & ELK logging',
                'Security-first network topologies',
              ].map((item, index) => (
                <div
                  key={index}
                  ref={el => listItemsRef.current[index] = el}
                  className="flex items-center gap-4 text-text-secondary group"
                >
                  <span className="w-2 h-2 bg-accent rounded-full group-hover:scale-150 transition-transform shadow-[0_0_8px_#00d4ff]"></span>
                  <span className="group-hover:text-text-primary transition-colors">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            ref={rightColRef}
            className="rounded-3xl shadow-2xl relative"
          >
            <LiquidGlass padding="0" cornerRadius={32}>
              <div className="h-[450px]">
                <Canvas
                  camera={{ position: [0, 0, 8], fov: 60 }}
                >
                  <ambientLight intensity={0.4} />
                  <pointLight position={[10, 10, 10]} intensity={1} />
                  <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00ff88" />
                  <Suspense fallback={null}>
                    <SystemDiagram />
                  </Suspense>
                  <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    autoRotate
                    autoRotateSpeed={0.8}
                  />
                </Canvas>
              </div>
            </LiquidGlass>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {designs.map((design, index) => (
            <div
              key={index}
              ref={el => designsRef.current[index] = el}
              className="h-full"
            >
              <LiquidGlass className="group" cornerRadius={24}>
                <h4 className="text-2xl font-bold text-text-primary mb-4 group-hover:text-accent transition-colors">{design.title}</h4>
                <p className="text-text-secondary mb-6 leading-relaxed text-sm opacity-80">{design.description}</p>

                <div className="mb-6">
                  <h5 className="text-accent-secondary font-bold text-[10px] uppercase tracking-widest mb-4">Core Components</h5>
                  <ul className="space-y-3">
                    {design.components.map((component, compIndex) => (
                      <li key={compIndex} className="text-text-secondary text-xs flex items-center gap-3">
                        <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                        {component}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="text-white font-bold text-[10px] uppercase tracking-widest mb-4">Tech Stack</h5>
                  <div className="flex flex-wrap gap-2">
                    {design.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-2 py-1 bg-white/5 text-text-secondary font-mono text-[9px] uppercase border border-white/10 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </LiquidGlass>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SystemDesign