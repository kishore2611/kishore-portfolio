import { useEffect, useRef, useState, Suspense, useMemo } from 'react'
import { gsap } from 'gsap'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text, Float, Trail, Stars } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import LiquidGlass from './LiquidGlass'

// ─── Service Nodes Config ───────────────────────────────────────────────────
const NODES = [
  { id: 'client',   label: 'Client',           position: [0,    2.5, 0],    color: '#00d4ff', accent: '#00a8cc', role: 'Entry Point',   icon: '🌐' },
  { id: 'gateway',  label: 'API Gateway',       position: [0,    0.5, 0],    color: '#a78bfa', accent: '#7c3aed', role: 'Traffic Router', icon: '🔀' },
  { id: 'auth',     label: 'Auth Service',      position: [-2.8, -1.2, 0.8],  color: '#f87171', accent: '#dc2626', role: 'JWT / OAuth2',   icon: '🔐' },
  { id: 'payment',  label: 'Payment Service',   position: [2.8,  -1.2, 0.8],  color: '#facc15', accent: '#d97706', role: 'Stripe / PayPal',icon: '💳' },
  { id: 'db',       label: 'Database',          position: [0,   -3.2, 0],    color: '#34d399', accent: '#059669', role: 'PostgreSQL / Redis', icon: '🗄️' },
]

const CONNECTIONS = [
  { from: 'client',  to: 'gateway',  color: '#00d4ff' },
  { from: 'gateway', to: 'auth',     color: '#a78bfa' },
  { from: 'gateway', to: 'payment',  color: '#a78bfa' },
  { from: 'auth',    to: 'db',       color: '#f87171' },
  { from: 'payment', to: 'db',       color: '#facc15' },
]

// ─── Glowing Sphere Node ─────────────────────────────────────────────────────
const ServiceNode = ({ node, onHover }) => {
  const meshRef = useRef()
  const ringRef = useRef()
  const glowRef = useRef()
  const [hovered, setHovered] = useState(false)

  const color = useMemo(() => new THREE.Color(node.color), [node.color])

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto'
    gsap.to(meshRef.current.scale, {
      x: hovered ? 1.35 : 1,
      y: hovered ? 1.35 : 1,
      z: hovered ? 1.35 : 1,
      duration: 0.5,
      ease: 'back.out(1.7)',
    })
  }, [hovered])

  // Pulse ring on hover
  useFrame((state) => {
    if (!ringRef.current) return
    const t = state.clock.elapsedTime
    if (hovered) {
      ringRef.current.material.opacity = 0.4 + Math.sin(t * 6) * 0.3
      ringRef.current.scale.setScalar(1 + Math.sin(t * 4) * 0.15)
    } else {
      ringRef.current.material.opacity = 0.15 + Math.sin(t * 2) * 0.05
      ringRef.current.scale.setScalar(1)
    }
  })

  return (
    <Float speed={2.5} rotationIntensity={0.2} floatIntensity={0.4}>
      <group
        position={node.position}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); onHover(node) }}
        onPointerOut={() => { setHovered(false); onHover(null) }}
      >
        {/* Outer glow ring */}
        <mesh ref={ringRef}>
          <torusGeometry args={[0.56, 0.03, 16, 80]} />
          <meshBasicMaterial color={node.color} transparent opacity={0.15} />
        </mesh>

        {/* Soft glow shell */}
        <mesh ref={glowRef}>
          <sphereGeometry args={[0.65, 32, 32]} />
          <meshBasicMaterial color={node.color} transparent opacity={0.06} side={THREE.BackSide} />
        </mesh>

        {/* Core sphere */}
        <mesh ref={meshRef}>
          <sphereGeometry args={[0.38, 64, 64]} />
          <meshPhysicalMaterial
            color={node.accent}
            emissive={node.color}
            emissiveIntensity={hovered ? 1.8 : 1.1}
            metalness={0.1}
            roughness={0.15}
            transmission={0.3}
            thickness={0.5}
            transparent
            opacity={0.96}
          />
        </mesh>

        {/* Inner bright core */}
        <mesh>
          <sphereGeometry args={[0.18, 32, 32]} />
          <meshBasicMaterial color={node.color} />
        </mesh>

        {/* Node Label */}
        <Text
          position={[0, -0.75, 0]}
          fontSize={0.2}
          color={hovered ? node.color : '#c4c9d4'}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.05}
        >
          {node.label}
        </Text>

        {/* Role subtitle on hover */}
        {hovered && (
          <Text
            position={[0, -1.05, 0]}
            fontSize={0.13}
            color={node.color}
            anchorX="center"
            anchorY="middle"
            opacity={0.8}
          >
            {node.role}
          </Text>
        )}
      </group>
    </Float>
  )
}

// ─── Animated Flow Particle along an edge ───────────────────────────────────
const FlowParticle = ({ from, to, color, speed = 1, delay = 0 }) => {
  const ref = useRef()
  const progressRef = useRef(delay)
  const vFrom = useMemo(() => new THREE.Vector3(...from), [from])
  const vTo = useMemo(() => new THREE.Vector3(...to), [to])

  useFrame((_, delta) => {
    progressRef.current = (progressRef.current + delta * speed * 0.35) % 1
    if (ref.current) {
      ref.current.position.lerpVectors(vFrom, vTo, progressRef.current)
    }
  })

  return (
    <Trail width={0.4} length={6} color={color} attenuation={(t) => t * t}>
      <mesh ref={ref} position={vFrom}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </Trail>
  )
}

// ─── Connection Edge with flowing particles ───────────────────────────────────
const FlowEdge = ({ connection }) => {
  const fromNode = NODES.find((n) => n.id === connection.from)
  const toNode = NODES.find((n) => n.id === connection.to)
  if (!fromNode || !toNode) return null

  const from = fromNode.position
  const to = toNode.position

  const points = useMemo(() => {
    const mid = [
      (from[0] + to[0]) / 2,
      (from[1] + to[1]) / 2 + 0.6,
      (from[2] + to[2]) / 2 + 0.5,
    ]
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(...from),
      new THREE.Vector3(...mid),
      new THREE.Vector3(...to)
    )
    return curve.getPoints(50)
  }, [from, to])

  const lineGeom = useMemo(() => {
    const geom = new THREE.BufferGeometry().setFromPoints(points)
    return geom
  }, [points])

  const color = useMemo(() => new THREE.Color(connection.color), [connection.color])

  return (
    <group>
      {/* Dashed edge line */}
      <line geometry={lineGeom}>
        <lineBasicMaterial
          color={connection.color}
          transparent
          opacity={0.18}
          linewidth={1}
        />
      </line>

      {/* Multiple staggered particles per edge */}
      {[0, 0.33, 0.66].map((delay, i) => (
        <FlowParticle
          key={i}
          from={from}
          to={to}
          color={connection.color}
          speed={0.7 + i * 0.15}
          delay={delay}
        />
      ))}
    </group>
  )
}

// ─── Post-Processing ──────────────────────────────────────────────────────────
const PostFX = () => (
  <EffectComposer multisampling={8}>
    <Bloom
      intensity={1.6}
      luminanceThreshold={0.08}
      luminanceSmoothing={0.4}
      blendFunction={BlendFunction.ADD}
      mipmapBlur
    />
    <ChromaticAberration
      blendFunction={BlendFunction.NORMAL}
      offset={[0.0005, 0.0005]}
    />
  </EffectComposer>
)

// ─── 3D Scene ─────────────────────────────────────────────────────────────────
const Scene = ({ onHover }) => {
  return (
    <>
      {/* Environment & Lighting */}
      <fog attach="fog" args={['#020818', 12, 28]} />
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 6, 4]} intensity={3} color="#a78bfa" distance={20} />
      <pointLight position={[-5, -2, 2]} intensity={2} color="#00d4ff" distance={18} />
      <pointLight position={[5,  -2, 2]} intensity={2} color="#34d399" distance={18} />
      <spotLight position={[0, 10, 0]} angle={0.4} penumbra={0.9} intensity={4} color="#ffffff" castShadow />

      {/* Background stars */}
      <Stars radius={30} depth={30} count={800} factor={2} saturation={0} fade speed={0.5} />

      {/* Connection edges with flowing particles */}
      {CONNECTIONS.map((conn, i) => (
        <FlowEdge key={i} connection={conn} />
      ))}

      {/* Service nodes */}
      {NODES.map((node) => (
        <ServiceNode key={node.id} node={node} onHover={onHover} />
      ))}

      {/* Post-processing (Bloom + Chromatic Aberration) */}
      <Suspense fallback={null}>
        <PostFX />
      </Suspense>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI * 0.65}
        minPolarAngle={Math.PI * 0.25}
      />
    </>
  )
}

// ─── Main Section Component ───────────────────────────────────────────────────
const SystemDesign = () => {
  const sectionRef = useRef(null)
  const designsRef = useRef([])
  const [hoveredNode, setHoveredNode] = useState(null)
  const [canvasReady, setCanvasReady] = useState(false)

  const designs = [
    {
      title: 'Payment System Architecture',
      description: 'Secure, scalable payment processing with multiple gateways and real-time fraud detection.',
      components: ['API Gateway (Rate Limiting)', 'Payment Processor (Stripe)', 'Fraud Detection', 'Webhook Handler', 'Transaction DB'],
      technologies: ['Node.js', 'Stripe SDK', 'Redis', 'PostgreSQL', 'Webhooks'],
    },
    {
      title: 'Real-time Chat System',
      description: 'High-throughput WebSocket-based chat with presence, typing indicators, and message persistence.',
      components: ['WebSocket Server', 'Message Queue (Redis)', 'Chat DB (MongoDB)', 'Presence Service', 'S3 File Upload'],
      technologies: ['Socket.IO', 'Redis Pub/Sub', 'MongoDB', 'AWS S3', 'Push Notifications'],
    },
    {
      title: 'API Gateway & Microservices',
      description: 'Centralized API management with service discovery, load balancing, and ELK monitoring.',
      components: ['API Gateway (Kong)', 'Service Registry', 'Load Balancer (NGINX)', 'Prometheus Metrics', 'ELK Logging'],
      technologies: ['Kong', 'Consul', 'Docker', 'Prometheus', 'ELK Stack'],
    },
  ]

  useEffect(() => {
    gsap.fromTo(designsRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: designsRef.current[0],
          start: 'top 88%',
        },
      }
    )
  }, [])

  return (
    <section id="system-design" ref={sectionRef} className="py-24 bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 glass-button rounded-full mb-4">
            <span className="text-accent font-mono text-sm uppercase tracking-widest font-bold">06 / System Design</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4 tracking-tight">
            Architectural Strategy
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-lg leading-relaxed">
            Designing high-availability distributed systems for maximum performance and resilience.
          </p>
        </div>

        {/* 3D Visualization */}
        <div className="relative mb-20">
          {/* Visualization Canvas */}
          <div
            className="relative rounded-3xl overflow-hidden border border-white/5"
            style={{ height: '520px', background: 'radial-gradient(ellipse at 50% 40%, #0c1a42 0%, #020818 70%)' }}
          >
            <Canvas
              camera={{ position: [0, 1, 10], fov: 55 }}
              gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
              dpr={[1, 1.5]}
              onCreated={() => setTimeout(() => setCanvasReady(true), 300)}
            >
              <Scene onHover={setHoveredNode} />
            </Canvas>

            {/* Canvas loading overlay */}
            <div
              className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-700 ${
                canvasReady ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
              style={{ background: 'radial-gradient(ellipse at 50% 40%, #0c1a42 0%, #020818 70%)' }}
            >
              {/* Animated node constellation preview */}
              <div className="relative w-48 h-48 mb-8">
                {NODES.map((node, i) => {
                  const angle = (i / NODES.length) * Math.PI * 2 - Math.PI / 2
                  const r = i === 0 ? 0 : i === 4 ? 72 : 52
                  const x = 96 + Math.cos(angle) * r
                  const y = 96 + Math.sin(angle) * r
                  return (
                    <div
                      key={node.id}
                      className="absolute w-4 h-4 rounded-full animate-pulse"
                      style={{
                        left: x - 8,
                        top: y - 8,
                        background: node.color,
                        boxShadow: `0 0 12px ${node.color}, 0 0 24px ${node.color}40`,
                        animationDelay: `${i * 0.15}s`,
                      }}
                    />
                  )
                })}
                {/* Connecting lines SVG */}
                <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 192 192">
                  {CONNECTIONS.map((conn, i) => {
                    const from = NODES.find(n => n.id === conn.from)
                    const to = NODES.find(n => n.id === conn.to)
                    const fromAngle = (NODES.indexOf(from) / NODES.length) * Math.PI * 2 - Math.PI / 2
                    const toAngle = (NODES.indexOf(to) / NODES.length) * Math.PI * 2 - Math.PI / 2
                    const fromR = NODES.indexOf(from) === 0 ? 0 : NODES.indexOf(from) === 4 ? 72 : 52
                    const toR = NODES.indexOf(to) === 0 ? 0 : NODES.indexOf(to) === 4 ? 72 : 52
                    return (
                      <line
                        key={i}
                        x1={96 + Math.cos(fromAngle) * fromR}
                        y1={96 + Math.sin(fromAngle) * fromR}
                        x2={96 + Math.cos(toAngle) * toR}
                        y2={96 + Math.sin(toAngle) * toR}
                        stroke={conn.color}
                        strokeWidth="1"
                      />
                    )
                  })}
                </svg>
              </div>
              <div className="flex items-center gap-2 text-white/40 font-mono text-xs tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                Initializing 3D scene
              </div>
            </div>

            {/* Hover Info Panel (2D overlay) */}
            <div
              className={`absolute bottom-6 left-1/2 -translate-x-1/2 transition-all duration-500 ${
                hoveredNode ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
              }`}
            >
              {hoveredNode && (
                <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10">
                  <span className="text-2xl">{hoveredNode.icon}</span>
                  <div>
                    <div className="text-white font-bold font-mono text-sm">{hoveredNode.label}</div>
                    <div className="font-mono text-xs" style={{ color: hoveredNode.color }}>{hoveredNode.role}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Corner hints */}
            <div className="absolute top-4 left-4 flex items-center gap-2 text-white/30 font-mono text-xs">
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
              Drag to rotate
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            {NODES.map((node) => (
              <div key={node.id} className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: node.color, boxShadow: `0 0 8px ${node.color}` }}
                />
                <span className="text-text-secondary font-mono text-xs">{node.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Design Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {designs.map((design, index) => (
            <div
              key={index}
              ref={(el) => (designsRef.current[index] = el)}
              className="h-full"
            >
              <LiquidGlass className="group h-full" cornerRadius={24}>
                <h4 className="text-xl font-bold text-text-primary mb-3 group-hover:text-accent transition-colors leading-snug">
                  {design.title}
                </h4>
                <p className="text-text-secondary mb-5 leading-relaxed text-sm opacity-80">
                  {design.description}
                </p>

                <div className="mb-5">
                  <h5 className="text-accent-secondary font-bold text-[10px] uppercase tracking-widest mb-3">
                    Core Components
                  </h5>
                  <ul className="space-y-2">
                    {design.components.map((component, i) => (
                      <li key={i} className="text-text-secondary text-xs flex items-center gap-3">
                        <span
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ background: NODES[Math.min(i, NODES.length - 1)].color }}
                        />
                        {component}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="text-text-primary font-bold text-[10px] uppercase tracking-widest mb-3">
                    Tech Stack
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {design.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-white/5 text-text-secondary font-mono text-[9px] uppercase border border-white/10 rounded-md hover:border-accent/40 transition-colors"
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