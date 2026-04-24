import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Experience3D — Curved timeline path with 3 glowing milestone nodes
 * Gentle undulation, particles flowing along path
 */
const MilestoneNode = ({ position, color, index, scrollRef }) => {
  const meshRef = useRef()
  const ringRef = useRef()
  const glowRef = useRef()
  const phase = useMemo(() => index * Math.PI * 0.7, [index])

  useFrame((state) => {
    if (!meshRef.current || !ringRef.current || !glowRef.current) return
    const t = state.clock.elapsedTime
    const scroll = scrollRef?.current ?? 0

    // Float
    meshRef.current.position.y = position[1] + Math.sin(t * 0.4 + phase) * 0.15
    ringRef.current.position.y = position[1] + Math.sin(t * 0.4 + phase) * 0.15
    glowRef.current.position.y = position[1] + Math.sin(t * 0.4 + phase) * 0.15

    // Scale with scroll
    const s = 0.6 + scroll * 0.3 + Math.sin(t + phase) * 0.05
    meshRef.current.scale.setScalar(s)

    // Ring spin
    ringRef.current.rotation.x = t * 0.3 + phase
    ringRef.current.rotation.y = t * 0.2 + phase
    ringRef.current.scale.setScalar(1 + Math.sin(t * 2 + phase) * 0.1)

    // Glow pulse
    glowRef.current.material.opacity = 0.12 + Math.sin(t * 1.5 + phase) * 0.05 + scroll * 0.1
  })

  return (
    <group>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[0.4, 12, 12]} />
        <meshPhysicalMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.2}
          metalness={0.2}
          roughness={0.1}
          transmission={0.3}
          thickness={0.5}
          transparent
          opacity={0.9}
        />
      </mesh>
      <mesh ref={ringRef} position={position}>
        <torusGeometry args={[0.6, 0.02, 8, 48]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>
      <mesh ref={glowRef} position={position}>
        <sphereGeometry args={[0.8, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.12} />
      </mesh>
    </group>
  )
}

const PathParticle = ({ curve, speed, delay }) => {
  const ref = useRef()
  const progRef = useRef(delay)

  useFrame((_, delta) => {
    if (!ref.current) return
    progRef.current = (progRef.current + delta * speed) % 1
    const point = curve.getPoint(progRef.current)
    ref.current.position.copy(point)
    const s = 0.06 + Math.sin(progRef.current * Math.PI) * 0.03
    ref.current.scale.setScalar(s)
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#c8a87a" transparent opacity={0.7} />
    </mesh>
  )
}

const Experience3D = ({ scrollRef }) => {
  const groupRef = useRef()

  const milestones = useMemo(() => [
    { pos: [-2.2, 0.5, 0], color: '#c8a87a' },    // Sixlogs
    { pos: [0, -0.3, 0.5], color: '#7fb5c8' },    // Binate Remote
    { pos: [2.2, 0.2, -0.5], color: '#94c87a' },  // Binate Full-time
  ], [])

  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-3, 0, 0),
      new THREE.Vector3(-1.5, 0.8, 0.3),
      new THREE.Vector3(0, -0.5, 0.5),
      new THREE.Vector3(1.5, 0.3, -0.3),
      new THREE.Vector3(3, 0, 0),
    ])
  }, [])

  const pathPoints = useMemo(() => curve.getPoints(60), [curve])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const scroll = scrollRef?.current ?? 0
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.06) * 0.15 + scroll * 0.3
      groupRef.current.position.y = Math.sin(t * 0.2) * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {/* Timeline path */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={pathPoints.length}
            array={new Float32Array(pathPoints.flatMap(p => [p.x, p.y, p.z]))}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#c8a87a" transparent opacity={0.25} />
      </line>

      {/* Flowing particles along path */}
      {[0, 0.2, 0.4, 0.6, 0.8].map((delay, i) => (
        <PathParticle key={i} curve={curve} speed={0.25} delay={delay} />
      ))}

      {/* Milestone nodes */}
      {milestones.map((m, i) => (
        <MilestoneNode
          key={i}
          position={m.pos}
          color={m.color}
          index={i}
          scrollRef={scrollRef}
        />
      ))}

      {/* Ambient background spheres */}
      <mesh position={[0, 0, -1]}>
        <sphereGeometry args={[0.15, 6, 6]} />
        <meshBasicMaterial color="#c8a87a" transparent opacity={0.2} />
      </mesh>
    </group>
  )
}

export default Experience3D

