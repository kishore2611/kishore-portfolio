import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Testimonials3D — 2 floating orbs with ring halos + orbiting star particles
 * Warm gold glow theme
 */
const TestimonialOrb = ({ position, color, index, scrollRef }) => {
  const meshRef = useRef()
  const ring1Ref = useRef()
  const ring2Ref = useRef()
  const glowRef = useRef()
  const phase = useMemo(() => index * Math.PI, [index])

  useFrame((state) => {
    if (!meshRef.current || !ring1Ref.current || !ring2Ref.current || !glowRef.current) return
    const t = state.clock.elapsedTime
    const scroll = scrollRef?.current ?? 0

    // Gentle float
    meshRef.current.position.y = position[1] + Math.sin(t * 0.35 + phase) * 0.2
    ring1Ref.current.position.y = position[1] + Math.sin(t * 0.35 + phase) * 0.2
    ring2Ref.current.position.y = position[1] + Math.sin(t * 0.35 + phase) * 0.2
    glowRef.current.position.y = position[1] + Math.sin(t * 0.35 + phase) * 0.2

    // Slow rotation
    meshRef.current.rotation.y = t * 0.1 + phase
    meshRef.current.rotation.x = Math.sin(t * 0.15 + phase) * 0.2

    // Scale with scroll
    const s = 1 + scroll * 0.2 + Math.sin(t + phase) * 0.03
    meshRef.current.scale.setScalar(s)

    // Rings
    ring1Ref.current.rotation.x = Math.PI / 2 + t * 0.2
    ring1Ref.current.rotation.y = t * 0.15 + phase
    ring1Ref.current.scale.setScalar(1 + Math.sin(t * 1.5 + phase) * 0.05)

    ring2Ref.current.rotation.x = t * 0.25 + phase
    ring2Ref.current.rotation.z = Math.PI / 3 + t * 0.1
    ring2Ref.current.scale.setScalar(1.3 + Math.sin(t + phase) * 0.08)

    // Glow
    glowRef.current.material.opacity = 0.1 + Math.sin(t * 1.2 + phase) * 0.03 + scroll * 0.08
  })

  return (
    <group>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[0.55, 16, 16]} />
        <meshPhysicalMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.9}
          metalness={0.1}
          roughness={0.05}
          transmission={0.4}
          thickness={1.5}
          transparent
          opacity={0.85}
        />
      </mesh>
      <mesh ref={ring1Ref} position={position}>
        <torusGeometry args={[0.8, 0.015, 8, 48]} />
        <meshBasicMaterial color={color} transparent opacity={0.25} />
      </mesh>
      <mesh ref={ring2Ref} position={position}>
        <torusGeometry args={[1.1, 0.01, 8, 48]} />
        <meshBasicMaterial color={color} transparent opacity={0.15} />
      </mesh>
      <mesh ref={glowRef} position={position}>
        <sphereGeometry args={[1.0, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.1} />
      </mesh>
    </group>
  )
}

const Testimonials3D = ({ scrollRef }) => {
  const groupRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const scroll = scrollRef?.current ?? 0
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.04 + scroll * 0.2
    }
  })

  return (
    <group ref={groupRef}>
      {/* Two testimonial orbs */}
      <TestimonialOrb position={[-1.2, 0.3, 0]} color="#c8a87a" index={0} scrollRef={scrollRef} />
      <TestimonialOrb position={[1.2, -0.3, 0.3]} color="#e6b980" index={1} scrollRef={scrollRef} />

      {/* Orbiting star particles */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2
        const r = 2.2 + (i % 3) * 0.3
        return (
          <mesh
            key={`star-${i}`}
            position={[Math.cos(angle) * r, Math.sin(i * 0.9) * 0.6, Math.sin(angle) * r]}
          >
            <octahedronGeometry args={[0.04, 0]} />
            <meshBasicMaterial color="#c8a87a" transparent opacity={0.5} />
          </mesh>
        )
      })}

      {/* Central warm glow */}
      <mesh>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshBasicMaterial color="#c8a87a" transparent opacity={0.15} />
      </mesh>
    </group>
  )
}

export default Testimonials3D

