import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import * as THREE from 'three'

/**
 * About3D — Floating geometric identity shapes for About section
 * Gold/copper theme with subtle morphing and orbit
 */
const About3D = ({ scrollRef }) => {
  const groupRef = useRef()
  const cubeRef = useRef()
  const icoRef = useRef()
  const ringRef = useRef()

  // Morph geometries (precomputed for performance)
  const cubeGeo = useMemo(() => new THREE.BoxGeometry(1.2, 1.2, 1.2), [])
  const icoGeo = useMemo(() => new THREE.IcosahedronGeometry(1.1, 1), [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const scroll = scrollRef?.current ?? 0

    if (groupRef.current) {
      // Gentle orbit + scroll influence
      groupRef.current.rotation.y = t * 0.15 + scroll * Math.PI * 0.5
      groupRef.current.rotation.x = Math.sin(t * 0.1 + scroll) * 0.2
      groupRef.current.position.y = Math.sin(t * 0.3) * 0.15
    }

    if (cubeRef.current) {
      cubeRef.current.rotation.x += 0.01
      cubeRef.current.rotation.z += 0.008
    }

    if (icoRef.current) {
      icoRef.current.rotation.y -= 0.012
      icoRef.current.rotation.x += 0.005
    }

    if (ringRef.current) {
      ringRef.current.rotation.x = t * 0.25
      ringRef.current.rotation.z = t * 0.18
      ringRef.current.scale.setScalar(1 + Math.sin(t * 0.8) * 0.08)
    }
  })

  return (
    <group ref={groupRef}>
      {/* Orbiting ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[2.8, 0.025, 12, 64]} />
        <meshPhysicalMaterial
          color="#c8a87a"
          emissive="#c8a87a"
          emissiveIntensity={0.3}
          metalness={1}
          roughness={0.1}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Morphing cube */}
      <mesh ref={cubeRef}>
        <primitive object={cubeGeo} />
        <meshPhysicalMaterial
          color="#e6b980"
          emissive="#c8a87a"
          emissiveIntensity={0.8}
          metalness={0.9}
          roughness={0.15}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Icosahedron companion */}
      <mesh ref={icoRef} position={[1.4, 0.3, 0]}>
        <primitive object={icoGeo} />
        <meshPhysicalMaterial
          color="#d4b896"
          emissive="#c8a87a"
          emissiveIntensity={0.6}
          metalness={0.85}
          roughness={0.2}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Inner glow */}
      <mesh>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshBasicMaterial color="#ffeedd" transparent opacity={0.15} />
      </mesh>
    </group>
  )
}

export default About3D

