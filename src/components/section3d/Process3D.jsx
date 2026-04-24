import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Process3D — 4 pipeline nodes in a curved flow with traveling particles
 * Represents: Analysis → Blueprint → Execution → Scale
 */
const FlowParticle = ({ startPos, endPos, speed, delay, color }) => {
  const ref = useRef()
  const progress = useMemo(() => delay, [delay])
  const vStart = useMemo(() => new THREE.Vector3(...startPos), [startPos])
  const vEnd = useMemo(() => new THREE.Vector3(...endPos), [endPos])
  const progRef = useRef(progress)

  useFrame((_, delta) => {
    if (!ref.current) return
    progRef.current = (progRef.current + delta * speed) % 1
    ref.current.position.lerpVectors(vStart, vEnd, progRef.current)
    const s = 0.08 + Math.sin(progRef.current * Math.PI) * 0.04
    ref.current.scale.setScalar(s)
  })

  return (
    <mesh ref={ref} position={startPos}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.8} />
    </mesh>
  )
}

const PipelineNode = ({ position, color, index, scrollRef, labelGeo }) => {
  const meshRef = useRef()
  const ringRef = useRef()
  const phase = useMemo(() => index * Math.PI * 0.5, [index])

  useFrame((state) => {
    if (!meshRef.current || !ringRef.current) return
    const t = state.clock.elapsedTime
    const scroll = scrollRef?.current ?? 0

    // Float with offset
    meshRef.current.position.y = position[1] + Math.sin(t * 0.5 + phase) * 0.2
    ringRef.current.position.y = position[1] + Math.sin(t * 0.5 + phase) * 0.2

    // Rotation
    meshRef.current.rotation.y = t * 0.2 + phase
    meshRef.current.rotation.x = Math.sin(t * 0.15 + phase) * 0.3

    // Scale pulse on scroll
    const s = 0.5 + scroll * 0.2 + Math.sin(t + phase) * 0.05
    meshRef.current.scale.setScalar(s)

    // Ring animation
    ringRef.current.rotation.z = t * 0.3 + phase
    ringRef.current.scale.setScalar(1 + Math.sin(t * 1.5 + phase) * 0.1)
    ringRef.current.material.opacity = 0.2 + scroll * 0.3
  })

  return (
    <group>
      <mesh ref={meshRef} position={position}>
        {labelGeo === 'cube' && <boxGeometry args={[1, 1, 1, 1, 1, 1]} />}
        {labelGeo === 'sphere' && <sphereGeometry args={[0.55, 12, 12]} />}
        {labelGeo === 'cone' && <coneGeometry args={[0.5, 1, 8]} />}
        {labelGeo === 'cyl' && <cylinderGeometry args={[0.45, 0.45, 0.9, 8]} />}
        <meshPhysicalMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.9}
        />
      </mesh>
      <mesh ref={ringRef} position={position} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.85, 0.02, 8, 48]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} />
      </mesh>
    </group>
  )
}

const Process3D = ({ scrollRef }) => {
  const groupRef = useRef()

  const nodes = useMemo(() => [
    { pos: [-2.5, 0.5, 0], color: '#c8a87a', geo: 'cube' },      // Analysis
    { pos: [-0.8, -0.3, 0.5], color: '#7fb5c8', geo: 'sphere' }, // Blueprint
    { pos: [0.8, 0.3, -0.5], color: '#94c87a', geo: 'cone' },    // Execution
    { pos: [2.5, -0.5, 0], color: '#e6b980', geo: 'cyl' },       // Scale
  ], [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const scroll = scrollRef?.current ?? 0
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.1) * 0.15 + scroll * 0.5
      groupRef.current.position.y = Math.sin(t * 0.3) * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {/* Connection lines */}
      {nodes.slice(0, -1).map((node, i) => {
        const next = nodes[i + 1]
        const points = [
          new THREE.Vector3(...node.pos),
          new THREE.Vector3(...next.pos),
        ]
        return (
          <line key={`line-${i}`}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([...node.pos, ...next.pos])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color={node.color} transparent opacity={0.2} />
          </line>
        )
      })}

      {/* Flowing particles between nodes */}
      {nodes.slice(0, -1).map((node, i) => {
        const next = nodes[i + 1]
        return [0, 0.33, 0.66].map((delay, j) => (
          <FlowParticle
            key={`particle-${i}-${j}`}
            startPos={node.pos}
            endPos={next.pos}
            speed={0.4 + j * 0.1}
            delay={delay}
            color={node.color}
          />
        ))
      })}

      {/* Pipeline nodes */}
      {nodes.map((node, i) => (
        <PipelineNode
          key={i}
          position={node.pos}
          color={node.color}
          index={i}
          scrollRef={scrollRef}
          labelGeo={node.geo}
        />
      ))}

      {/* Central ambient glow */}
      <mesh>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshBasicMaterial color="#c8a87a" transparent opacity={0.15} />
      </mesh>
    </group>
  )
}

export default Process3D

