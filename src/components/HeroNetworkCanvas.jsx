import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere, MeshDistortMaterial, Float } from '@react-three/drei'
import { useRef } from 'react'
import { scrollEngine } from '../utils/scrollEngine'
const NetworkScene = () => {
  const groupRef = useRef()
  const materialRef = useRef()

  useFrame(() => {
    if (groupRef.current) {
      // Base rotation + scroll influence
      groupRef.current.rotation.y += 0.005
      groupRef.current.rotation.x = scrollEngine.progress * 2
      groupRef.current.rotation.z = scrollEngine.progress * 1.5
    }
    if (materialRef.current) {
      // Increase distortion on scroll
      materialRef.current.distort = 0.4 + scrollEngine.progress * 0.6
    }
  })

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <Sphere args={[1.2, 64, 64]} position={[0, 0, 0]}>
          <MeshDistortMaterial
            ref={materialRef}
            color="#ffffff"
            attach="material"
            distort={0.4}
            speed={1.5}
            roughness={0.2}
            metalness={0.8}
            envMapIntensity={1}
          />
        </Sphere>
      </Float>

      {Array.from({ length: 16 }, (_, i) => {
        const angle = (i / 16) * Math.PI * 2
        const radius = 6 + Math.sin(i) * 2
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        const y = Math.sin(i * 0.8) * 4

        return (
          <group key={i}>
            <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
              <Sphere args={[0.2, 32, 32]} position={[x, y, z]}>
                <meshStandardMaterial
                  color={i % 3 === 0 ? '#ff3366' : i % 3 === 1 ? '#5e17eb' : '#ffffff'}
                  emissive={i % 3 === 0 ? '#ff3366' : i % 3 === 1 ? '#5e17eb' : '#ffffff'}
                  emissiveIntensity={1}
                  roughness={0.1}
                  metalness={0.9}
                />
              </Sphere>
            </Float>

            <line>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  count={2}
                  array={new Float32Array([0, 0, 0, x, y, z])}
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial color="#ffffff" opacity={0.1 + (1 - scrollEngine.progress) * 0.2} transparent linewidth={1} />
            </line>
          </group>
        )
      })}
    </group>
  )
}

/**
 * Split from Hero so Three/R3F live in a separate chunk (faster first paint).
 */
export default function HeroNetworkCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 12], fov: 60 }}
      style={{ background: 'transparent' }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={2} color="#ff3366" />
      <directionalLight position={[-10, -10, -5]} intensity={2} color="#5e17eb" />
      <NetworkScene />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.8}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
      />
    </Canvas>
  )
}
