import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sphere, MeshDistortMaterial, Float } from '@react-three/drei'
import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'

const NetworkScene = () => {
  const groupRef = useRef()

  return (
    <group ref={groupRef}>
      {/* Central Node */}
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

      {/* Surrounding Nodes */}
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
                  color={i % 2 === 0 ? "#00ff88" : "#00d4ff"}
                  emissive={i % 2 === 0 ? "#00ff88" : "#00d4ff"}
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
}

const Hero = () => {
  const heroRef = useRef(null)
  const contentRef = useRef(null)
  const badgeRef = useRef(null)
  const titleRef = useRef(null)
  const textRef = useRef(null)
  const buttonsRef = useRef(null)
  const statsRef = useRef(null)

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    
    tl.fromTo(contentRef.current, { opacity: 0 }, { opacity: 1, duration: 1 })
      .fromTo(badgeRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.5')
      .fromTo(titleRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.4')
      .fromTo(textRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.6')
      .fromTo(buttonsRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.6')
      .fromTo(statsRef.current.children, { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.6 }, '-=0.4')

    // Magnetic interaction for buttons
    const magneticBtns = buttonsRef.current.querySelectorAll('button')
    const handleMagnetic = (e) => {
      const btn = e.currentTarget
      const rect = btn.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      
      gsap.to(btn, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.4,
        ease: 'power3.out'
      })
    }

    const resetMagnetic = (e) => {
      gsap.to(e.currentTarget, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.3)'
      })
    }

    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', handleMagnetic)
      btn.addEventListener('mouseleave', resetMagnetic)
      btn.addEventListener('mouseenter', () => uiAudio.playHover())
      btn.addEventListener('click', () => uiAudio.playClick())
    })

    return () => {
      magneticBtns.forEach(btn => {
        btn.removeEventListener('mousemove', handleMagnetic)
        btn.removeEventListener('mouseleave', resetMagnetic)
      })
    }
  }, [])

  return (
    <section id="home" ref={heroRef} className="min-h-screen flex items-center justify-center relative overflow-hidden bg-dark-bg pt-20">
      <div className="absolute inset-0 opacity-60">
        <Canvas
          camera={{ position: [0, 0, 10], fov: 60 }}
          style={{ background: 'transparent' }}
          gl={{ antialias: true, alpha: true }}
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
      </div>

      <div ref={contentRef} className="relative z-10 text-center max-w-4xl mx-auto px-4 mt-12 md:mt-20">
        <div ref={badgeRef} className="inline-block px-4 py-2 glass-button rounded-full mb-8 border-accent/20">
          <span className="text-accent font-mono text-sm uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse shadow-[0_0_10px_#00d4ff]"></span>
            Available for new opportunities
          </span>
        </div>

        <h1 ref={titleRef} className="text-4xl md:text-8xl font-black mb-8 tracking-tighter leading-[1.1]">
          <span className="text-text-primary">Kishore Kumar</span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-secondary">
            Node.js Developer
          </span>
        </h1>

        <p ref={textRef} className="text-lg md:text-2xl text-text-secondary mb-10 md:mb-12 max-w-2xl mx-auto leading-relaxed font-light px-4">
          Backend engineer crafting <span className="text-accent font-medium">scalable APIs</span>,
          <span className="text-accent-secondary font-medium"> real-time systems</span> and payment integrations.
        </p>

        <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center mb-16 px-4">
          <button
            className="btn-primary w-full sm:w-auto min-w-[180px] hover:shadow-[0_0_25px_rgba(0,212,255,0.4)] transition-all"
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
          >
            View Projects
          </button>
          <button
            className="btn-outline w-full sm:w-auto min-w-[180px] hover:bg-accent/5 transition-all"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Get in Touch
          </button>
        </div>

        <div ref={statsRef} className="flex flex-wrap justify-center gap-6">
          {[
            { icon: '📍', text: 'Karachi, PK' },
            { icon: '🎓', text: 'BSc CS' },
            { icon: '⚡', text: '3+ Years Exp' }
          ].map((item, index) => (
            <div
              key={index}
              className="glass-button px-6 py-3 rounded-xl flex items-center gap-3 border-white/10 hover:border-accent/40 transition-colors"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-text-secondary font-mono text-sm tracking-wide">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Hero