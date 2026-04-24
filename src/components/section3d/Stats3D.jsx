import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Stats3D — 4 geometric pillars in a diamond + central pulsing ring
 * Abstract representation of metrics/data
 */
const DataPillar = ({ position, color, height, index, scrollRef }) => {
  const meshRef = useRef()
  const ringRef = useRef()
  const baseH = useMemo(() => height, [height])

  useFrame((state) => {
    if (!meshRef.current || !ringRef.current) return
    const t = state.clock.elapsedTime
    const scroll = scrollRef?.current ?? 0

    const grow = Math.min(1, scroll * 2) + Math.sin(t * 0.5 + index) * 0.05
    const h = baseH * Math.max(0.1, grow)

    meshRef.current.scale.y = h
    meshRef.current.position.y = position[1] + h * 0.5 - baseH * 0.5

    ringRef.current.position.y = position[1] + h + 0.1
    ringRef.current.rotation.x = Math.PI / 2
    ringRef.current.rotation.z = t * 0.3 + index

    meshRef.current.material.emissiveIntensity = 0.6 + scroll * 0.6 + Math.sin(t * 2 + index) * 0.2
  })

  return (
    <group position={position}>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <boxGeometry args={[0.4, 1, 0.4, 1, 1, 1]} />
        <meshPhysicalMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.9}
        />
      </mesh>
      <mesh ref={ringRef}>
        <torusGeometry args={[0.35, 0.015, 8, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} />
      </mesh>
    </group>
  )
}

const Stats3D = ({ scrollRef }) => {
  const groupRef = useRef()
  const centerRingRef = useRef()

  const pillars = useMemo(() => [
    { pos: [0, 0, -1.4], color: '#c8a87a', h: 1.8 },    // Projects
    { pos: [1.4, 0, 0], color: '#7fb5c8', h: 1.4 },     // Internships
    { pos: [0, 0, 1.4], color: '#94c87a', h: 1.6 },     // Skills
    { pos: [-1.4, 0, 0], color: '#e6b980', h: 2.0 },    // APIs
  ], [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const scroll = scrollRef?.current ?? 0

    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.06 + scroll * 0.5
    }

    if (centerRingRef.current) {
      centerRingRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.3) * 0.2
      centerRingRef.current.rotation.z = t * 0.2
      centerRingRef.current.scale.setScalar(1 + scroll * 0.5 + Math.sin(t) * 0.05)
      centerRingRef.current.material.opacity = 0.15 + scroll * 0.2
    }
  })

  return (
    <group ref={groupRef}>
      {/* Central ring */}
      <mesh ref={centerRingRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.7, 0.02, 8, 48]} />
        <meshBasicMaterial color="#c8a87a" transparent opacity={0.2} />
      </mesh>

      {/* Inner glow */}
      <mesh>
        <sphereGeometry args={[0.25, 8, 8]} />
        <meshBasicMaterial color="#c8a87a" transparent opacity={0.2} />
      </mesh>

      {/* Data pillars */}
      {pillars.map((p, i) => (
        <DataPillar
          key={i}
          position={p.pos}
          color={p.color}
          height={p.h}
          index={i}
          scrollRef={scrollRef}
        />
      ))}
    </group>
  )
}

export default Stats3D

