import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Contact3D — Expanding signal/communication rings from center
 * Radar-like pulses + central transmission node
 */
const SignalRing = ({ radius, speed, delay, color, scrollRef }) => {
  const ringRef = useRef()
  const progRef = useRef(delay)

  useFrame((state) => {
    if (!ringRef.current) return
    const t = state.clock.elapsedTime
    const scroll = scrollRef?.current ?? 0

    progRef.current = (progRef.current + speed * 0.008) % 1

    const scale = 0.3 + progRef.current * 1.5 + scroll * 0.3
    ringRef.current.scale.setScalar(scale)

    const opacity = Math.max(0, 0.5 - progRef.current * 0.5) * (0.6 + scroll * 0.4)
    ringRef.current.material.opacity = opacity

    ringRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.2 + delay * 10) * 0.05
    ringRef.current.rotation.z = t * 0.05 + delay * 5
  })

  return (
    <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius, 0.015, 8, 64]} />
      <meshBasicMaterial color={color} transparent opacity={0} />
    </mesh>
  )
}

const Contact3D = ({ scrollRef }) => {
  const groupRef = useRef()
  const coreRef = useRef()
  const pulseRef = useRef()

  const rings = useMemo(() => [
    { r: 1.0, s: 0.8, d: 0.0, c: '#c8a87a' },
    { r: 1.0, s: 0.8, d: 0.33, c: '#7fb5c8' },
    { r: 1.0, s: 0.8, d: 0.66, c: '#94c87a' },
  ], [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const scroll = scrollRef?.current ?? 0

    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.03
    }

    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.5
      coreRef.current.scale.setScalar(1 + Math.sin(t * 3) * 0.1 + scroll * 0.2)
      coreRef.current.material.emissiveIntensity = 1.5 + Math.sin(t * 4) * 0.5 + scroll
    }

    if (pulseRef.current) {
      pulseRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.2 + scroll * 0.3)
      pulseRef.current.material.opacity = 0.15 + Math.sin(t * 2) * 0.05 + scroll * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {/* Expanding signal rings */}
      {rings.map((ring, i) => (
        <SignalRing
          key={i}
          radius={ring.r}
          speed={ring.s}
          delay={ring.d}
          color={ring.c}
          scrollRef={scrollRef}
        />
      ))}

      {/* Central transmission node */}
      <mesh ref={coreRef}>
        <octahedronGeometry args={[0.35, 0]} />
        <meshPhysicalMaterial
          color="#c8a87a"
          emissive="#c8a87a"
          emissiveIntensity={1.5}
          metalness={0.8}
          roughness={0.1}
          transparent
          opacity={0.95}
        />
      </mesh>

      {/* Pulse glow */}
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.6, 12, 12]} />
        <meshBasicMaterial color="#c8a87a" transparent opacity={0.15} />
      </mesh>

      {/* Inner core */}
      <mesh>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshBasicMaterial color="#ffeedd" transparent opacity={0.8} />
      </mesh>

      {/* Orbiting dots */}
      {Array.from({ length: 6 }, (_, i) => {
        const angle = (i / 6) * Math.PI * 2
        const r = 1.8
        return (
          <mesh
            key={`dot-${i}`}
            position={[Math.cos(angle) * r, Math.sin(i * 0.5) * 0.2, Math.sin(angle) * r]}
          >
            <sphereGeometry args={[0.04, 6, 6]} />
            <meshBasicMaterial color="#c8a87a" transparent opacity={0.6} />
          </mesh>
        )
      })}
    </group>
  )
}

export default Contact3D

