import { motion } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sphere, MeshDistortMaterial, Float, Text } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'

const NetworkScene = ({ mousePosition }) => {
  const groupRef = useRef()

  return (
    <group ref={groupRef}>
      {/* Central Node */}
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <Sphere args={[1, 64, 64]} position={[0, 0, 0]}>
          <MeshDistortMaterial
            color="#00d4ff"
            attach="material"
            distort={0.3}
            speed={2}
            roughness={0}
            metalness={0.8}
          />
        </Sphere>
      </Float>

      {/* Surrounding Nodes */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2
        const radius = 4
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        const y = Math.sin(i * 0.5) * 2

        return (
          <group key={i}>
            <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
              <Sphere args={[0.3, 32, 32]} position={[x, y, z]}>
                <meshStandardMaterial
                  color={i % 2 === 0 ? "#00ff88" : "#00d4ff"}
                  emissive={i % 2 === 0 ? "#00ff88" : "#00d4ff"}
                  emissiveIntensity={0.2}
                />
              </Sphere>
            </Float>

            {/* Connection Lines */}
            <line>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  count={2}
                  array={new Float32Array([0, 0, 0, x, y, z])}
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial color="#00d4ff" opacity={0.3} transparent />
            </line>
          </group>
        )
      })}

      {/* Data Flow Particles */}
      {Array.from({ length: 20 }, (_, i) => (
        <Float key={i} speed={0.5} rotationIntensity={0} floatIntensity={0.5}>
          <Sphere args={[0.05, 8, 8]} position={[
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10
          ]}>
            <meshBasicMaterial color="#00ff88" />
          </Sphere>
        </Float>
      ))}
    </group>
  )
}

const Hero = ({ mousePosition }) => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden glass">
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 10], fov: 60 }}
          style={{ background: 'transparent' }}
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00ff88" />
          <NetworkScene mousePosition={mousePosition} />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
        </Canvas>
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-block px-4 py-2 glass-button rounded-full mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-accent font-mono text-sm uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
              Available for new opportunities
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-text-primary">Kishore Kumar</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-secondary">
              Node.js Developer
            </span>
          </motion.h1>

          <motion.p
            className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Backend engineer crafting <span className="text-accent">scalable APIs</span>,
            <span className="text-accent-secondary"> real-time systems</span> and payment integrations.
            3+ years building production-grade Node.js applications across social, e-commerce, and mobility platforms.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.button
              className="btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('projects').scrollIntoView({ behavior: 'smooth' })}
            >
              View Projects
            </motion.button>
            <motion.button
              className="btn-outline"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
            >
              Get in Touch
            </motion.button>
          </motion.div>

          <motion.div
            className="flex flex-wrap justify-center gap-4 mt-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {[
              { icon: '📍', text: 'Karachi, Pakistan' },
              { icon: '🎓', text: 'BSc Computer Science' },
              { icon: '⚡', text: '3+ Years Experience' }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="glass-button px-4 py-2 rounded-lg flex items-center gap-2"
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <span className="text-accent">{item.icon}</span>
                <span className="text-text-secondary font-mono text-sm">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero