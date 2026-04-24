import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import * as THREE from 'three'

/* ─── Helix Particle ────────────────────────────────────────────────────── */
const HelixParticle = ({ index, total, scrollRef }) => {
  const meshRef = useRef()
  const baseY = useMemo(() => (index / total) * 8 - 4, [index, total])
  const phase = useMemo(() => (index / total) * Math.PI * 4, [index, total])
  const color = useMemo(() => {
    const colors = ['#7fb5c8', '#a8d5e5', '#5e8fa3', '#b8e0ec', '#4a7d91']
    return colors[index % colors.length]
  }, [index])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    const scroll = scrollRef.current

    // Helix unwinds with scroll
    const unwind = scroll * Math.PI * 3
    const radius = 2 + scroll * 2
    const x = Math.cos(phase + t * 0.3 - unwind) * radius
    const z = Math.sin(phase + t * 0.3 - unwind) * radius
    const y = baseY + Math.sin(t * 0.5 + phase) * 0.3

    meshRef.current.position.set(x, y, z)

    // Scale pulses
    const s = 0.15 + scroll * 0.1 + Math.sin(t * 2 + phase) * 0.03
    meshRef.current.scale.setScalar(s)

    // Emissive intensity
    meshRef.current.material.emissiveIntensity = 0.8 + scroll * 1.5 + Math.sin(t * 3 + phase) * 0.3
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshPhysicalMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1}
        metalness={0.9}
        roughness={0.1}
        transparent
        opacity={0.9}
      />
    </mesh>
  )
}

/* ─── Central Crystal ───────────────────────────────────────────────────── */
const Crystal = ({ scrollRef }) => {
  const groupRef = useRef()
  const crystalRef = useRef()
  const ring1Ref = useRef()
  const ring2Ref = useRef()

  useFrame((state) => {
    if (!groupRef.current || !crystalRef.current || !ring1Ref.current || !ring2Ref.current) return
    const t = state.clock.elapsedTime
    const scroll = scrollRef.current

    // Group transform
    groupRef.current.rotation.y = scroll * Math.PI * 2 + t * 0.1
    groupRef.current.rotation.x = Math.sin(scroll * Math.PI) * 0.3

    // Float
    groupRef.current.position.y = Math.sin(t * 0.4) * 0.3

    // Crystal shatter/scale effect
    const scale = 1 + scroll * 0.3 + Math.sin(t) * 0.05
    crystalRef.current.scale.setScalar(scale)
    crystalRef.current.rotation.y = -t * 0.3
    crystalRef.current.rotation.x = scroll * Math.PI * 0.5

    // Rings
    ring1Ref.current.rotation.x = Math.PI / 2 + t * 0.2
    ring1Ref.current.rotation.z = scroll * Math.PI
    ring1Ref.current.scale.setScalar(1 + scroll * 0.5)

    ring2Ref.current.rotation.y = Math.PI / 3 + t * 0.15
    ring2Ref.current.rotation.z = -scroll * Math.PI * 0.8
    ring2Ref.current.scale.setScalar(1.3 + scroll * 0.4)
  })

  return (
    <group ref={groupRef}>
      {/* Central octahedron crystal */}
      <mesh ref={crystalRef}>
        <octahedronGeometry args={[1.4, 0]} />
        <meshPhysicalMaterial
          color="#7fb5c8"
          emissive="#4a7d91"
          emissiveIntensity={1.5}
          metalness={0.1}
          roughness={0.05}
          transmission={0.6}
          thickness={2}
          transparent
          opacity={0.85}
          ior={1.7}
        />
      </mesh>

      {/* Inner glow */}
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial color="#a8d5e5" transparent opacity={0.3} />
      </mesh>

      {/* Ring 1 */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[2.2, 0.03, 16, 100]} />
        <meshPhysicalMaterial
          color="#7fb5c8"
          emissive="#7fb5c8"
          emissiveIntensity={0.5}
          metalness={1}
          roughness={0.05}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Ring 2 */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[2.8, 0.025, 16, 100]} />
        <meshPhysicalMaterial
          color="#5e8fa3"
          emissive="#5e8fa3"
          emissiveIntensity={0.4}
          metalness={1}
          roughness={0.05}
          transparent
          opacity={0.4}
        />
      </mesh>
    </group>
  )
}

/* ─── Scene Wrapper ─────────────────────────────────────────────────────── */
const Scene = ({ scrollRef }) => {
  const particles = useMemo(() => Array.from({ length: 32 }, (_, i) => i), [])

  return (
    <>
      <color attach="background" args={['transparent']} />
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 3]} intensity={1.2} color="#7fb5c8" />
      <directionalLight position={[-5, -3, -5]} intensity={0.8} color="#c8a87a" />
      <pointLight position={[0, 0, 4]} intensity={2.5} color="#a8d5e5" distance={12} />
      <pointLight position={[0, 0, -4]} intensity={1.5} color="#5e8fa3" distance={10} />
      <Environment preset="night" />

      <Crystal scrollRef={scrollRef} />

      {particles.map((i) => (
        <HelixParticle key={i} index={i} total={32} scrollRef={scrollRef} />
      ))}
    </>
  )
}

/* ─── Exported Canvas ───────────────────────────────────────────────────── */
export default function ScrollModel2({ scrollRef }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 50 }}
      style={{ background: 'transparent' }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
      }}
      dpr={[1, 1.5]}
    >
      <Scene scrollRef={scrollRef} />
    </Canvas>
  )
}

