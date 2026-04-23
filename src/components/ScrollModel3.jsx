import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import * as THREE from 'three'

/* ─── Orbiting Ring ─────────────────────────────────────────────────────── */
const OrbitRing = ({ radius, speed, tilt, color, scrollRef, index }) => {
  const ringRef = useRef()
  const particlesRef = useRef([])
  const particleCount = 12

  useFrame((state) => {
    if (!ringRef.current) return
    const t = state.clock.elapsedTime
    const scroll = scrollRef.current

    // Ring rotation
    ringRef.current.rotation.z = t * speed + scroll * Math.PI * index
    ringRef.current.rotation.x = tilt + Math.sin(t * 0.2) * 0.1

    // Expand with scroll
    const expand = 1 + scroll * 0.8
    ringRef.current.scale.setScalar(expand)

    // Particle orbits
    particlesRef.current.forEach((p, i) => {
      if (!p) return
      const angle = (i / particleCount) * Math.PI * 2 + t * speed * 2
      const r = radius * expand
      p.position.x = Math.cos(angle) * r
      p.position.y = Math.sin(angle) * r
      p.position.z = Math.sin(angle * 2 + index) * 0.5

      const s = 0.08 + scroll * 0.05
      p.scale.setScalar(s)
    })
  })

  return (
    <group ref={ringRef}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.02, 16, 80]} />
        <meshPhysicalMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3 + index * 0.1}
          metalness={1}
          roughness={0.05}
          transparent
          opacity={0.4}
        />
      </mesh>
      {Array.from({ length: particleCount }, (_, i) => (
        <mesh
          key={i}
          ref={(el) => (particlesRef.current[i] = el)}
        >
          <sphereGeometry args={[1, 12, 12]} />
          <meshPhysicalMaterial
            color={color}
            emissive={color}
            emissiveIntensity={1.5}
            metalness={0.9}
            roughness={0.1}
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}
    </group>
  )
}

/* ─── Central Morphing Shape ────────────────────────────────────────────── */
const MorphShape = ({ scrollRef }) => {
  const groupRef = useRef()
  const shapeRef = useRef()
  const innerRef = useRef()
  const geoRef = useRef()

  // Create icosahedron and box geometries for morphing
  const icoGeo = useMemo(() => new THREE.IcosahedronGeometry(1.2, 2), [])
  const boxGeo = useMemo(() => new THREE.BoxGeometry(1.8, 1.8, 1.8, 4, 4, 4), [])

  useFrame((state) => {
    if (!groupRef.current || !shapeRef.current || !innerRef.current) return
    const t = state.clock.elapsedTime
    const scroll = scrollRef.current

    // Group transform
    groupRef.current.rotation.y = scroll * Math.PI * 3 + t * 0.08
    groupRef.current.rotation.x = Math.sin(scroll * Math.PI) * 0.5
    groupRef.current.position.y = Math.sin(t * 0.3) * 0.2

    // Scale
    const scale = 0.8 + scroll * 0.4
    groupRef.current.scale.setScalar(scale)

    // Inner shape counter-rotation
    innerRef.current.rotation.y = -t * 0.2
    innerRef.current.rotation.x = scroll * Math.PI * 0.3

    // Pulse emissive
    innerRef.current.material.emissiveIntensity = 1 + Math.sin(t * 2) * 0.5 + scroll
  })

  return (
    <group ref={groupRef}>
      {/* Outer wireframe-ish shape */}
      <mesh ref={shapeRef}>
        <icosahedronGeometry args={[1.3, 1]} />
        <meshPhysicalMaterial
          color="#c8a87a"
          emissive="#c8a87a"
          emissiveIntensity={0.4}
          metalness={0.8}
          roughness={0.2}
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Inner solid shape */}
      <mesh ref={innerRef}>
        <boxGeometry args={[1.2, 1.2, 1.2, 2, 2, 2]} />
        <meshPhysicalMaterial
          color="#e6b980"
          emissive="#c8a87a"
          emissiveIntensity={1}
          metalness={0.3}
          roughness={0.1}
          transmission={0.4}
          thickness={1.5}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Core glow */}
      <mesh>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshBasicMaterial color="#ffeedd" transparent opacity={0.25} />
      </mesh>
    </group>
  )
}

/* ─── Scene Wrapper ─────────────────────────────────────────────────────── */
const Scene = ({ scrollRef }) => {
  return (
    <>
      <color attach="background" args={['transparent']} />
      <ambientLight intensity={0.25} />
      <directionalLight position={[5, 8, 3]} intensity={1.5} color="#c8a87a" />
      <directionalLight position={[-5, -3, -5]} intensity={1} color="#ff3366" />
      <pointLight position={[0, 0, 5]} intensity={3} color="#c8a87a" distance={14} />
      <pointLight position={[0, 0, -5]} intensity={2} color="#7fb5c8" distance={12} />
      <Environment preset="city" />

      <MorphShape scrollRef={scrollRef} />

      <OrbitRing radius={2.5} speed={0.15} tilt={0.3} color="#c8a87a" scrollRef={scrollRef} index={0} />
      <OrbitRing radius={3.2} speed={-0.12} tilt={0.8} color="#7fb5c8" scrollRef={scrollRef} index={1} />
      <OrbitRing radius={4} speed={0.08} tilt={1.4} color="#ff3366" scrollRef={scrollRef} index={2} />
    </>
  )
}

/* ─── Exported Canvas ───────────────────────────────────────────────────── */
export default function ScrollModel3({ scrollRef }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 50 }}
      style={{ background: 'transparent' }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
      }}
      dpr={[1, 1.5]}
    >
      <Scene scrollRef={scrollRef} />
    </Canvas>
  )
}

