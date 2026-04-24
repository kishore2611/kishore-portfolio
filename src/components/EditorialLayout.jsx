import { memo, useRef, useState, useEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'

export const CodeCard = memo(({ filename, code }) => (
  <div className="code-card glass-card accent-glow !bg-dark/80 backdrop-blur-2xl">
    <div className="cc-header border-b border-white/5">
      <div className="cc-dots">
        <div className="cc-dot bg-[#ff5f56]" />
        <div className="cc-dot bg-[#ffbd2e]" />
        <div className="cc-dot bg-[#27c93f]" />
      </div>
      <span className="text-[8px] text-muted uppercase tracking-[0.2em] font-mono">{filename}</span>
    </div>
    <div className="cc-body font-mono text-[10px] leading-relaxed">
      {code}
    </div>
  </div>
))

export const Ticker = memo(() => (
  <div className="ticker fixed bottom-0 left-0 right-0 z-[100] h-[32px] bg-dark/90 backdrop-blur-md border-t border-white/5 flex items-center overflow-hidden">
    <div className="flex animate-[tick_35s_linear_infinite] whitespace-nowrap items-center">
      {Array.from({ length: 10 }).map((_, i) => (
        <span key={i} className="ticker-item flex items-center opacity-60 hover:opacity-100 transition-opacity">
          Kishore Kumar <span className="mx-6 text-accent font-bold">Node.js Architect</span> Backend Systems <span className="mx-6 text-[#94c87a]">99.9% Reliable</span>
        </span>
      ))}
    </div>
    <style>{`
      @keyframes tick {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
    `}</style>
  </div>
))

export const SideLabels = memo(({ labels }) => (
  <div className="side-labels fixed right-[40px] top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-end gap-5 font-mono text-[9px] uppercase tracking-[0.25em] text-muted z-50">
    {labels.map((label, i) => (
      <span key={i} className="flex items-center gap-4 group cursor-default">
        <span className="opacity-40 group-hover:opacity-100 group-hover:text-accent transition-all duration-500">{label}</span>
        <div className="h-[1px] w-[30px] bg-white/10 group-hover:w-[50px] group-hover:bg-accent transition-all duration-700" />
      </span>
    ))}
  </div>
))

/* ─── Section Background Canvas ─────────────────────────────────────────── */
const SectionBgCanvas = ({ Bg3DComponent }) => {
  const containerRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  const scrollRef = useRef(0)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: '10% 0px 10% 0px', threshold: 0.01 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  if (!isVisible) {
    return <div ref={containerRef} className="absolute inset-0 pointer-events-none z-0" />
  }

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        style={{ background: 'transparent' }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
        }}
        dpr={Math.min(window.devicePixelRatio, 1.2)}
        frameloop="always"
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 3]} intensity={0.8} color="#c8a87a" />
        <directionalLight position={[-3, -2, -3]} intensity={0.4} color="#7fb5c8" />
        <Suspense fallback={null}>
          <Bg3DComponent scrollRef={scrollRef} />
        </Suspense>
      </Canvas>
    </div>
  )
}

export const SectionLayout = ({ 
  id, 
  theme = 'dk', 
  eyebrow, 
  title, 
  description, 
  sidenav = [], 
  codeCard,
  children,
  bgSvg,
  bg3d: Bg3DComponent
}) => (
  <section id={id} className={theme}>
    {bgSvg && !Bg3DComponent && (
      <div className="absolute inset-0 pointer-events-none opacity-[0.07] flex items-center justify-center">{bgSvg}</div>
    )}
    {Bg3DComponent && <SectionBgCanvas Bg3DComponent={Bg3DComponent} />}
    
    <div className="inner-container">
      <div className="rv-text">
        <span className="eyebrow">{eyebrow}</span>
        <h2 className="sec-title" dangerouslySetInnerHTML={{ __html: title }} />
        <p className="sec-desc">{description}</p>
        
        {sidenav.length > 0 && (
          <ul className="sidenav-links">
            {sidenav.map((item, i) => (
              <li key={i} className={item.active ? 'active' : ''}>
                {item.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="relative min-h-[520px] flex items-center justify-center z-10">
        {children}
        {codeCard && <CodeCard {...codeCard} />}
      </div>
    </div>
  </section>
)
