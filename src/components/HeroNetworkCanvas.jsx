import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sphere, MeshDistortMaterial, Float } from '@react-three/drei'
const NetworkScene = () => (
    <group>
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <Sphere args={[1, 64, 64]} position={[0, 0, 0]}>
          <MeshDistortMaterial
            color="#00d4ff"
            attach="material"
            distort={0.2}
            speed={2}
            roughness={0}
            metalness={0.9}
          />
        </Sphere>
      </Float>

      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2
        const radius = 4
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        const y = Math.sin(i * 0.5) * 2

        return (
          <group key={i}>
            <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
              <Sphere args={[0.25, 32, 32]} position={[x, y, z]}>
                <meshStandardMaterial
                  color={i % 2 === 0 ? '#00ff88' : '#00d4ff'}
                  emissive={i % 2 === 0 ? '#00ff88' : '#00d4ff'}
                  emissiveIntensity={0.5}
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
              <lineBasicMaterial color="#00d4ff" opacity={0.4} transparent linewidth={1} />
            </line>
          </group>
        )
      })}
    </group>
)

/**
 * Split from Hero so Three/R3F live in a separate chunk (faster first paint).
 */
export default function HeroNetworkCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 60 }}
      style={{ background: 'transparent' }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <pointLight position={[-10, -10, -10]} intensity={0.8} color="#00ff88" />
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
