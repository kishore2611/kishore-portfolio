import { useEffect, useLayoutEffect, useRef, useState, useMemo, Suspense } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html, Float, Stars, Line } from '@react-three/drei'
import * as THREE from 'three'
import LiquidGlass from './LiquidGlass'
import { getLenis } from '../lib/lenis'

// ─── Service Nodes Config ───────────────────────────────────────────────────
const NODES = [
  { id: 'client', label: 'Client', position: [0, 2.5, 0], color: '#00d4ff', accent: '#00a8cc', role: 'Entry Point', icon: '🌐' },
  { id: 'gateway', label: 'API Gateway', position: [0, 0.5, 0], color: '#a78bfa', accent: '#7c3aed', role: 'Traffic Router', icon: '🔀' },
  { id: 'auth', label: 'Auth Service', position: [-2.8, -1.2, 0.8], color: '#f87171', accent: '#dc2626', role: 'JWT / OAuth2', icon: '🔐' },
  { id: 'payment', label: 'Payment Service', position: [2.8, -1.2, 0.8], color: '#facc15', accent: '#d97706', role: 'Stripe / PayPal', icon: '💳' },
  { id: 'db', label: 'Database', position: [0, -3.2, 0], color: '#34d399', accent: '#059669', role: 'PostgreSQL / Redis', icon: '🗄️' },
]

const CONNECTIONS = [
  { from: 'client', to: 'gateway', color: '#00d4ff' },
  { from: 'gateway', to: 'auth', color: '#a78bfa' },
  { from: 'gateway', to: 'payment', color: '#a78bfa' },
  { from: 'auth', to: 'db', color: '#f87171' },
  { from: 'payment', to: 'db', color: '#facc15' },
]

// ─── Glowing Sphere Node (labels via Html — avoids Troika/font async failures) ─
const ServiceNode = ({ node, onHover }) => {
  const meshRef = useRef()
  const ringRef = useRef()
  const glowRef = useRef()
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto'
    if (!meshRef.current) return
    gsap.to(meshRef.current.scale, {
      x: hovered ? 1.35 : 1,
      y: hovered ? 1.35 : 1,
      z: hovered ? 1.35 : 1,
      duration: 0.5,
      ease: 'back.out(1.7)',
    })
  }, [hovered])

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
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
          onHover(node)
        }}
        onPointerOut={() => {
          setHovered(false)
          onHover(null)
        }}
      >
        <mesh ref={ringRef}>
          <torusGeometry args={[0.56, 0.03, 16, 80]} />
          <meshBasicMaterial color={node.color} transparent opacity={0.15} />
        </mesh>

        <mesh ref={glowRef}>
          <sphereGeometry args={[0.65, 32, 32]} />
          <meshBasicMaterial color={node.color} transparent opacity={0.06} side={THREE.BackSide} />
        </mesh>

        <mesh ref={meshRef}>
          <sphereGeometry args={[0.38, 64, 64]} />
          <meshPhysicalMaterial
            color={node.accent}
            emissive={node.color}
            emissiveIntensity={hovered ? 2.2 : 1.45}
            metalness={0.1}
            roughness={0.15}
            transmission={0.3}
            thickness={0.5}
            transparent
            opacity={0.96}
          />
        </mesh>

        <mesh>
          <sphereGeometry args={[0.18, 32, 32]} />
          <meshBasicMaterial color={node.color} />
        </mesh>

        <Html position={[0, -0.95, 0]} center distanceFactor={10} style={{ pointerEvents: 'none' }}>
          <div
            className="font-mono text-[11px] font-bold whitespace-nowrap px-2 py-1 rounded-md bg-black/60 border border-white/15 shadow-lg backdrop-blur-sm"
            style={{ color: hovered ? node.color : '#c4c9d4' }}
          >
            {node.label}
          </div>
        </Html>

        {hovered && (
          <Html position={[0, -1.42, 0]} center distanceFactor={10} style={{ pointerEvents: 'none' }}>
            <div className="font-mono text-[9px] opacity-95" style={{ color: node.color }}>
              {node.role}
            </div>
          </Html>
        )}
      </group>
    </Float>
  )
}

// ─── Particle along edge (no Trail — fewer WebGL edge cases) ─────────────────
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
    <mesh ref={ref} position={vFrom}>
      <sphereGeometry args={[0.07, 10, 10]} />
      <meshBasicMaterial color={color} />
    </mesh>
  )
}

// ─── Connection edges (drei Line — reliable width vs raw <line>) ──────────────
const FlowEdge = ({ connection }) => {
  const fromNode = NODES.find((n) => n.id === connection.from)
  const toNode = NODES.find((n) => n.id === connection.to)

  const points = useMemo(() => {
    if (!fromNode || !toNode) return []
    const from = fromNode.position
    const to = toNode.position
    const mid = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2 + 0.6, (from[2] + to[2]) / 2 + 0.5]
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(...from),
      new THREE.Vector3(...mid),
      new THREE.Vector3(...to)
    )
    return curve.getPoints(50)
  }, [fromNode, toNode])

  if (!fromNode || !toNode || points.length === 0) return null

  const from = fromNode.position
  const to = toNode.position

  return (
    <group>
      <Line points={points} color={connection.color} lineWidth={1.5} transparent opacity={0.35} />

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

// ─── 3D Scene ─────────────────────────────────────────────────────────────────
const Scene = ({ onHover }) => (
  <>
    <color attach="background" args={['#020818']} />
    <fog attach="fog" args={['#020818', 12, 28]} />
    <ambientLight intensity={0.28} />
    <pointLight position={[0, 6, 4]} intensity={3.6} color="#a78bfa" distance={22} />
    <pointLight position={[-5, -2, 2]} intensity={2} color="#00d4ff" distance={18} />
    <pointLight position={[5, -2, 2]} intensity={2} color="#34d399" distance={18} />
    <spotLight position={[0, 10, 0]} angle={0.4} penumbra={0.9} intensity={4} color="#ffffff" />

    <Stars radius={30} depth={30} count={500} factor={2} saturation={0} fade speed={0.5} />

    {CONNECTIONS.map((conn, i) => (
      <FlowEdge key={i} connection={conn} />
    ))}

    {NODES.map((node) => (
      <ServiceNode key={node.id} node={node} onHover={onHover} />
    ))}

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

// ─── Main Section ───────────────────────────────────────────────────────────
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
    gsap.fromTo(
      designsRef.current,
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

  useLayoutEffect(() => {
    const id = requestAnimationFrame(() => {
      ScrollTrigger.refresh()
      getLenis()?.resize?.()
    })
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <section id="system-design" ref={sectionRef} className="py-32 bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full mb-6 border border-white/10 bg-white/5 backdrop-blur-md">
            <span className="text-white font-mono text-xs uppercase tracking-[0.2em]">06 / System Design</span>
          </div>
          <h2 className="display-font text-5xl md:text-7xl font-bold text-text-primary mb-6 tracking-tighter">Architectural Strategy</h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed">
            Designing high-availability distributed systems for maximum performance and resilience.
          </p>
        </div>

        <div className="relative mb-20">
          <div
            className="relative rounded-3xl overflow-hidden border border-white/5"
            style={{ height: '520px', background: 'radial-gradient(ellipse at 50% 40%, #0c1a42 0%, #020818 70%)' }}
          >
                <Canvas
                  className="h-full w-full touch-none"
                  style={{ display: 'block', width: '100%', height: '100%' }}
                  camera={{ position: [0, 1, 10], fov: 55 }}
                  gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
                  dpr={[1, Math.min(2, typeof window !== 'undefined' ? window.devicePixelRatio : 1)]}
                  frameloop="always"
                  onCreated={({ gl, scene }) => {
                    gl.setClearColor('#020818', 1)
                    scene.background = new THREE.Color('#020818')
                    requestAnimationFrame(() => {
                      ScrollTrigger.refresh()
                      getLenis()?.resize?.()
                    })
                    setCanvasReady(true)
                  }}
                >
                  <Suspense fallback={null}>
                    <Scene onHover={setHoveredNode} />
                  </Suspense>
                </Canvas>

                <div
                  className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-500 pointer-events-none ${
                    canvasReady ? 'opacity-0' : 'opacity-100'
                  }`}
                  style={{ background: 'radial-gradient(ellipse at 50% 40%, #0c1a42 0%, #020818 70%)' }}
                  aria-hidden
                >
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
                  </div>
                  <div className="flex items-center gap-2 text-white/40 font-mono text-xs tracking-widest">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                    Initializing 3D scene
                  </div>
                </div>

            <div
              className={`absolute bottom-6 left-1/2 -translate-x-1/2 transition-all duration-500 z-10 ${
                hoveredNode ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
              }`}
            >
              {hoveredNode && (
                <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10">
                  <span className="text-2xl">{hoveredNode.icon}</span>
                  <div>
                    <div className="text-white font-bold font-mono text-sm">{hoveredNode.label}</div>
                    <div className="font-mono text-xs" style={{ color: hoveredNode.color }}>
                      {hoveredNode.role}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 text-white/30 font-mono text-xs pointer-events-none">
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
              Drag to rotate
            </div>
          </div>

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {designs.map((design, index) => (
            <div key={index} ref={(el) => (designsRef.current[index] = el)} className="h-full">
              <LiquidGlass className="group h-full" cornerRadius={24}>
                <h4 className="display-font text-2xl font-bold text-white mb-4 group-hover:text-accent-secondary transition-colors duration-500 tracking-tight">{design.title}</h4>
                <p className="text-text-secondary mb-8 leading-relaxed text-sm md:text-base font-light opacity-60 group-hover:opacity-100 transition-opacity duration-500">{design.description}</p>

                <div className="mb-10 pt-6 border-t border-white/5">
                  <h5 className="text-white opacity-40 font-mono text-[10px] uppercase tracking-[0.2em] mb-6">Core Components</h5>
                  <ul className="grid grid-cols-2 gap-4">
                    {design.components.map((component, i) => (
                      <li key={i} className="text-text-secondary text-xs font-light flex items-center gap-3">
                        <span
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ background: NODES[Math.min(i, NODES.length - 1)].color }}
                        />
                        {component}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 border-t border-white/5">
                  <h5 className="text-white opacity-40 font-mono text-[10px] uppercase tracking-[0.2em] mb-6">Tech Stack</h5>
                  <div className="flex flex-wrap gap-2">
                    {design.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-white/5 text-text-secondary font-mono text-[9px] uppercase font-bold border border-white/10 rounded hover:border-white/40 transition-colors duration-300"
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
