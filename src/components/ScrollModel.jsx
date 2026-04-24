import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float, MeshTransmissionMaterial } from '@react-three/drei'
import * as THREE from 'three'

/* ─── Floating Fragment ─────────────────────────────────────────────────── */
const Fragment = ({ geometry, position, color, speed, scrollRef }) => {
  const meshRef = useRef()
  const basePos = useMemo(() => new THREE.Vector3(...position), [position])
  const phase = useMemo(() => Math.random() * Math.PI * 2, [])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    const scroll = scrollRef.current

    // Base orbit + scroll-driven dispersion
    const orbitRadius = 2.5 + scroll * 3
    const angle = t * speed + phase
    meshRef.current.position.x = basePos.x + Math.cos(angle) * orbitRadius * (1 + scroll * 0.5)
    meshRef.current.position.y = basePos.y + Math.sin(angle * 0.7) * orbitRadius * 0.6 + Math.sin(t + phase) * 0.3
    meshRef.current.position.z = basePos.z + Math.sin(angle) * orbitRadius * (1 + scroll * 0.5)

    // Rotation
    meshRef.current.rotation.x = t * 0.5 + scroll * Math.PI
    meshRef.current.rotation.y = t * 0.3 + scroll * Math.PI * 0.5

    // Scale pulse with scroll
    const s = 1 + scroll * 0.4 + Math.sin(t * 2 + phase) * 0.1
    meshRef.current.scale.setScalar(s)
  })

  return (
    <mesh ref={meshRef} position={position}>
      {geometry === 'icosahedron' ? (
        <icosahedronGeometry args={[0.35, 0]} />
      ) : (
        <octahedronGeometry args={[0.3, 0]} />
      )}
      <meshPhysicalMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.6}
        metalness={0.9}
        roughness={0.1}
        transparent
        opacity={0.85}
      />
    </mesh>
  )
}

/* ─── Central 3D Model ──────────────────────────────────────────────────── */
const CentralModel = ({ scrollRef }) => {
  const groupRef = useRef()
  const knotRef = useRef()
  const ringRef = useRef()
  const innerRef = useRef()

  useFrame((state) => {
    if (!groupRef.current || !knotRef.current || !ringRef.current || !innerRef.current) return
    const t = state.clock.elapsedTime
    const scroll = scrollRef.current

    // ── Group transform (driven by scroll) ──
    // X: enter from left (-8 → 0 → 8)
    const xPos = THREE.MathUtils.lerp(-6, 6, scroll)
    groupRef.current.position.x = xPos

    // Y: subtle float + exit upward at end
    const yPos = Math.sin(t * 0.5) * 0.3 + (scroll > 0.75 ? (scroll - 0.75) * 12 : 0)
    groupRef.current.position.y = yPos

    // Rotation Y: full spin mapped to scroll
    groupRef.current.rotation.y = scroll * Math.PI * 2 + t * 0.15

    // Rotation X/Z: tilt during middle section
    groupRef.current.rotation.x = Math.sin(scroll * Math.PI) * 0.4
    groupRef.current.rotation.z = Math.cos(scroll * Math.PI) * 0.2

    // Scale: 0→1→1→0
    let scale = 1
    if (scroll < 0.15) scale = scroll / 0.15
    if (scroll > 0.85) scale = 1 - (scroll - 0.85) / 0.15
    groupRef.current.scale.setScalar(Math.max(0.001, scale))

    // ── Central knot ──
    knotRef.current.rotation.x = t * 0.2
    knotRef.current.rotation.z = t * 0.1

    // ── Outer ring ──
    ringRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.3) * 0.1
    ringRef.current.rotation.z = t * 0.25 + scroll * Math.PI
    ringRef.current.scale.setScalar(1 + Math.sin(t) * 0.03)

    // ── Inner core ──
    innerRef.current.rotation.y = -t * 0.4
    innerRef.current.material.emissiveIntensity = 1.2 + Math.sin(t * 3) * 0.5 + scroll * 0.8
  })

  return (
    <group ref={groupRef}>
      {/* Outer ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[2.2, 0.04, 16, 100]} />
        <meshPhysicalMaterial
          color="#c8a87a"
          emissive="#c8a87a"
          emissiveIntensity={0.4}
          metalness={1}
          roughness={0.05}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Central TorusKnot */}
      <mesh ref={knotRef}>
        <torusKnotGeometry args={[1.1, 0.35, 128, 32, 2, 3]} />
        <MeshTransmissionMaterial
          backside
          backsideThickness={0.5}
          thickness={0.8}
          chromaticAberration={0.12}
          anisotropy={0.3}
          distortion={0.4}
          distortionScale={0.5}
          temporalDistortion={0.1}
          color="#c8a87a"
          attenuationColor="#2a1f0f"
          attenuationDistance={2}
          ior={1.8}
          roughness={0.15}
          metalness={0.1}
        />
      </mesh>

      {/* Inner glow sphere */}
      <mesh ref={innerRef}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshPhysicalMaterial
          color="#ffeedd"
          emissive="#c8a87a"
          emissiveIntensity={1.2}
          metalness={0.1}
          roughness={0.2}
          transmission={0.4}
          thickness={1}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Orbiting fragments */}
      {[
        { geo: 'icosahedron', pos: [2.8, 1.2, 0.8], col: '#c8a87a', spd: 0.4 },
        { geo: 'octahedron', pos: [-2.5, -0.8, 1.5], col: '#e8d5b5', spd: 0.6 },
        { geo: 'icosahedron', pos: [1.2, -2.2, -1], col: '#a89060', spd: 0.35 },
        { geo: 'octahedron', pos: [-1.8, 2, -0.5], col: '#d4b896', spd: 0.5 },
        { geo: 'icosahedron', pos: [0, 2.8, 1.8], col: '#c8a87a', spd: 0.45 },
        { geo: 'octahedron', pos: [2, -1.5, -2], col: '#b8a070', spd: 0.55 },
      ].map((f, i) => (
        <Fragment
          key={i}
          geometry={f.geo}
          position={f.pos}
          color={f.col}
          speed={f.spd}
          scrollRef={scrollRef}
        />
      ))}
    </group>
  )
}

/* ─── Scene Wrapper ─────────────────────────────────────────────────────── */
const Scene = ({ scrollRef }) => {
  return (
    <>
      <color attach="background" args={['transparent']} />
      <ambientLight intensity={0.25} />
      <directionalLight position={[5, 8, 3]} intensity={1.5} color="#c8a87a" />
      <directionalLight position={[-5, -3, -5]} intensity={0.8} color="#5e17eb" />
      <pointLight position={[0, 0, 4]} intensity={3} color="#c8a87a" distance={12} />
      <pointLight position={[0, 0, -4]} intensity={1.5} color="#ff3366" distance={10} />
      <Environment preset="city" />
      <CentralModel scrollRef={scrollRef} />
    </>
  )
}

/* ─── Exported Canvas ───────────────────────────────────────────────────── */
export default function ScrollModel({ scrollRef }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 50 }}
      style={{ background: 'transparent' }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
      }}
      dpr={[1, 1.5]}
    >
      <Scene scrollRef={scrollRef} />
    </Canvas>
  )
}

