import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Projects3D — 3 stacked architecture blocks representing server layers
 * Social (gold), E-commerce (cyan), Mobility (green)
 */
const ServerLayer = ({ position, color, width, index, scrollRef }) => {
  const meshRef = useRef()
  const glowRef = useRef()
  const baseY = useMemo(() => position[1], [position])

  useFrame((state) => {
    if (!meshRef.current || !glowRef.current) return
    const t = state.clock.elapsedTime
    const scroll = scrollRef?.current ?? 0

    const floatY = baseY + Math.sin(t * 0.4 + index * 0.8) * 0.15
    meshRef.current.position.y = floatY
    glowRef.current.position.y = floatY

    meshRef.current.rotation.y = Math.sin(t * 0.1 + index) * 0.1 + scroll * 0.3

    const s = 1 + scroll * 0.15 + Math.sin(t + index) * 0.03
    meshRef.current.scale.set(s, 1, s)

    glowRef.current.material.opacity = 0.08 + Math.sin(t * 2 + index) * 0.03 + scroll * 0.1
  })

  return (
    <group>
      <mesh ref={meshRef} position={position}>
        <boxGeometry args={[width, 0.5, width, 1, 1, 1]} />
        <meshPhysicalMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          metalness={0.7}
          roughness={0.2}
          transparent
          opacity={0.85}
        />
      </mesh>
      {/* Edge glow */}
      <mesh ref={glowRef} position={position} scale={[1.02, 1, 1.02]}>
        <boxGeometry args={[width, 0.5, width, 1, 1, 1]} />
        <meshBasicMaterial color={color} transparent opacity={0.08} wireframe />
      </mesh>
    </group>
  )
}

const Projects3D = ({ scrollRef }) => {
  const groupRef = useRef()
  const ringRef = useRef()

  const layers = useMemo(() => [
    { pos: [0, 0.8, 0], color: '#c8a87a', w: 2.0 },   // Social
    { pos: [0, 0, 0], color: '#7fb5c8', w: 2.4 },     // E-commerce
    { pos: [0, -0.8, 0], color: '#94c87a', w: 2.2 },  // Mobility
  ], [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const scroll = scrollRef?.current ?? 0

    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.05 + scroll * 0.5
    }

    if (ringRef.current) {
      ringRef.current.rotation.x = Math.PI / 2
      ringRef.current.rotation.z = t * 0.2
      ringRef.current.scale.setScalar(1 + Math.sin(t) * 0.03)
    }
  })

  return (
    <group ref={groupRef}>
      {/* Base ring */}
      <mesh ref={ringRef} position={[0, -1.2, 0]}>
        <torusGeometry args={[2.0, 0.02, 8, 64]} />
        <meshPhysicalMaterial
          color="#c8a87a"
          emissive="#c8a87a"
          emissiveIntensity={0.3}
          metalness={1}
          roughness={0.05}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Server layers */}
      {layers.map((layer, i) => (
        <ServerLayer
          key={i}
          position={layer.pos}
          color={layer.color}
          width={layer.w}
          index={i}
          scrollRef={scrollRef}
        />
      ))}

      {/* Floating particles around layers */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2
        const r = 2.5
        return (
          <mesh
            key={`p-${i}`}
            position={[Math.cos(angle) * r, Math.sin(i * 0.7) * 0.5, Math.sin(angle) * r]}
          >
            <sphereGeometry args={[0.06, 6, 6]} />
            <meshBasicMaterial color="#c8a87a" transparent opacity={0.5} />
          </mesh>
        )
      })}
    </group>
  )
}

export default Projects3D

