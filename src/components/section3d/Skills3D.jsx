import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Skills3D — Orbiting tech category nodes around a central core
 * Backend=gold, DB=green, Cloud=blue, Tools=purple
 */
const OrbitingNode = ({ geometry, position, color, speed, scrollRef, index }) => {
  const meshRef = useRef()
  const baseAngle = useMemo(() => (index / 8) * Math.PI * 2, [index])
  const baseRadius = useMemo(() => 2.2 + (index % 3) * 0.4, [index])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    const scroll = scrollRef?.current ?? 0

    const angle = baseAngle + t * speed + scroll * Math.PI
    const radius = baseRadius + scroll * 1.5
    const yOffset = Math.sin(t * 0.5 + index) * 0.4

    meshRef.current.position.x = Math.cos(angle) * radius
    meshRef.current.position.z = Math.sin(angle) * radius
    meshRef.current.position.y = yOffset + Math.sin(scroll * Math.PI) * 0.5

    meshRef.current.rotation.x = t * 0.3 + index
    meshRef.current.rotation.y = t * 0.2 + index * 0.5

    const s = 0.35 + scroll * 0.15 + Math.sin(t * 2 + index) * 0.05
    meshRef.current.scale.setScalar(s)
  })

  return (
    <mesh ref={meshRef} position={position}>
      {geometry === 'box' && <boxGeometry args={[1, 1, 1, 1, 1, 1]} />}
      {geometry === 'sphere' && <sphereGeometry args={[0.5, 12, 12]} />}
      {geometry === 'torus' && <torusGeometry args={[0.4, 0.15, 8, 16]} />}
      {geometry === 'octa' && <octahedronGeometry args={[0.5, 0]} />}
      {geometry === 'cone' && <coneGeometry args={[0.4, 0.8, 8]} />}
      {geometry === 'cyl' && <cylinderGeometry args={[0.3, 0.3, 0.7, 8]} />}
      {geometry === 'dode' && <dodecahedronGeometry args={[0.45, 0]} />}
      {geometry === 'ico' && <icosahedronGeometry args={[0.45, 0]} />}
      <meshPhysicalMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.7}
        metalness={0.85}
        roughness={0.15}
        transparent
        opacity={0.9}
      />
    </mesh>
  )
}

const Skills3D = ({ scrollRef }) => {
  const groupRef = useRef()
  const ringRef = useRef()
  const coreRef = useRef()

  const nodes = useMemo(() => [
    { geo: 'box', color: '#c8a87a' },      // Backend
    { geo: 'sphere', color: '#e6b980' },   // APIs
    { geo: 'torus', color: '#7fb5c8' },    // Cloud
    { geo: 'octa', color: '#5e8fa3' },     // DevOps
    { geo: 'cone', color: '#34d399' },     // DB
    { geo: 'cyl', color: '#059669' },      // Cache
    { geo: 'dode', color: '#a78bfa' },     // Tools
    { geo: 'ico', color: '#7c3aed' },      // Languages
  ], [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const scroll = scrollRef?.current ?? 0

    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.08 + scroll * Math.PI * 0.3
    }

    if (ringRef.current) {
      ringRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.2) * 0.1
      ringRef.current.rotation.z = t * 0.15
      ringRef.current.scale.setScalar(1 + scroll * 0.5)
    }

    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.3
      coreRef.current.rotation.x = Math.sin(t * 0.2) * 0.3
      coreRef.current.material.emissiveIntensity = 1.2 + Math.sin(t * 2) * 0.4 + scroll * 0.5
    }
  })

  return (
    <group ref={groupRef}>
      {/* Central core */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.5, 1]} />
        <meshPhysicalMaterial
          color="#c8a87a"
          emissive="#c8a87a"
          emissiveIntensity={1.2}
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.95}
        />
      </mesh>

      {/* Core glow */}
      <mesh>
        <sphereGeometry args={[0.8, 12, 12]} />
        <meshBasicMaterial color="#c8a87a" transparent opacity={0.1} />
      </mesh>

      {/* Orbital ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.2, 0.02, 8, 64]} />
        <meshPhysicalMaterial
          color="#c8a87a"
          emissive="#c8a87a"
          emissiveIntensity={0.3}
          metalness={1}
          roughness={0.05}
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* Orbiting nodes */}
      {nodes.map((node, i) => (
        <OrbitingNode
          key={i}
          geometry={node.geo}
          position={[0, 0, 0]}
          color={node.color}
          speed={0.15 + i * 0.03}
          scrollRef={scrollRef}
          index={i}
        />
      ))}
    </group>
  )
}

export default Skills3D

