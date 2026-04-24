import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * GitHub3D — 7×7 contribution grid with bars of varying heights
 * Pulsing like a live commit graph, green/gold palette
 */
const ContributionBar = ({ x, z, height, color, delay, scrollRef }) => {
  const meshRef = useRef()
  const baseHeight = useMemo(() => height, [height])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    const scroll = scrollRef?.current ?? 0

    const pulse = Math.sin(t * 2 + delay) * 0.3
    const scrollBoost = scroll * 0.5
    const h = Math.max(0.05, baseHeight + pulse + scrollBoost)

    meshRef.current.scale.y = h
    meshRef.current.position.y = h * 0.5 - 0.5

    meshRef.current.material.emissiveIntensity = 0.5 + scroll * 0.5 + Math.sin(t * 3 + delay) * 0.3
  })

  return (
    <mesh ref={meshRef} position={[x, -0.5, z]}>
      <boxGeometry args={[0.35, 1, 0.35, 1, 1, 1]} />
      <meshPhysicalMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        metalness={0.6}
        roughness={0.3}
        transparent
        opacity={0.9}
      />
    </mesh>
  )
}

const GitHub3D = ({ scrollRef }) => {
  const groupRef = useRef()

  const bars = useMemo(() => {
    const data = []
    const colors = ['#1a191e', '#2d2d35', '#3d3d45', '#c8a87a', '#94c87a']
    for (let x = 0; x < 7; x++) {
      for (let z = 0; z < 7; z++) {
        const level = Math.floor(Math.random() * 5)
        const height = Math.max(0.1, (level + 1) * 0.25)
        const color = colors[level]
        const delay = (x * 7 + z) * 0.15
        data.push({
          x: (x - 3) * 0.55,
          z: (z - 3) * 0.55,
          height,
          color,
          delay,
        })
      }
    }
    return data
  }, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const scroll = scrollRef?.current ?? 0
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.08) * 0.2 + scroll * 0.3
      groupRef.current.rotation.x = Math.sin(t * 0.05) * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {/* Grid base plate */}
      <mesh position={[0, -0.55, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.5, 4.5]} />
        <meshBasicMaterial color="#0c0c10" transparent opacity={0.5} />
      </mesh>

      {/* Contribution bars */}
      {bars.map((bar, i) => (
        <ContributionBar
          key={i}
          x={bar.x}
          z={bar.z}
          height={bar.height}
          color={bar.color}
          delay={bar.delay}
          scrollRef={scrollRef}
        />
      ))}

      {/* Ambient glow center */}
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshBasicMaterial color="#94c87a" transparent opacity={0.15} />
      </mesh>
    </group>
  )
}

export default GitHub3D

