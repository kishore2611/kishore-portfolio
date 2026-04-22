import { useRef, useEffect, memo } from 'react'
import { gsap } from 'gsap'

// Pre-computed tech elements — NOT inside component to prevent recreation
const TECH_ELEMENTS = [
  { icon: '⚙️', x: 10, y: 20, size: 'text-6xl', depth: 3,   label: 'Node.js' },
  { icon: '🗄️', x: 85, y: 15, size: 'text-5xl', depth: 2,   label: 'Database' },
  { icon: '☁️', x: 15, y: 80, size: 'text-6xl', depth: 4,   label: 'Cloud' },
  { icon: '🔗', x: 80, y: 70, size: 'text-5xl', depth: 2.5, label: 'API' },
  { icon: '🐳', x: 45, y: 25, size: 'text-7xl', depth: 3.5, label: 'Docker' },
  { icon: '🚀', x: 70, y: 45, size: 'text-5xl', depth: 2,   label: 'Rocket' },
  { icon: '⚡', x: 20, y: 55, size: 'text-6xl', depth: 3,   label: 'Speed' },
  { icon: '🔐', x: 75, y: 85, size: 'text-5xl', depth: 2.5, label: 'Security' },
  { icon: '💾', x: 50, y: 70, size: 'text-6xl', depth: 3.5, label: 'Storage' },
  { icon: '🧠', x: 10, y: 40, size: 'text-5xl', depth: 2,   label: 'AI' },
]

const AnimatedTechBackground = memo(({ mousePosition }) => {
  const itemsRef = useRef([])
  const orbsRef = useRef([])
  const lastMouse = useRef({ x: 0, y: 0 })
  const tickerRef = useRef(null)

  // Entrance animation once
  useEffect(() => {
    const els = itemsRef.current.filter(Boolean)
    if (!els.length) return

    gsap.fromTo(
      els,
      { opacity: 0, scale: 0.5, y: 10 },
      { opacity: 0.12, scale: 1, y: 0, duration: 1.5, stagger: 0.08, ease: 'power4.out', delay: 1 }
    )
  }, [])

  // Throttled mouse parallax — batched into a single gsap.set call per tick
  useEffect(() => {
    lastMouse.current = mousePosition
  }, [mousePosition])

  useEffect(() => {
    // One GSAP ticker subscription for all parallax — much cheaper than per-move calls
    tickerRef.current = gsap.ticker.add(() => {
      const { x, y } = lastMouse.current

      itemsRef.current.forEach((item, i) => {
        if (!item) return
        const { depth } = TECH_ELEMENTS[i]
        gsap.set(item, {
          x: x * depth * 28,
          y: y * depth * 28,
          rotationZ: (x + y) * 12,
        })
      })

      orbsRef.current.forEach((orb, i) => {
        if (!orb) return
        const factor = i === 0 ? 75 : 45
        gsap.set(orb, { x: x * factor, y: y * factor })
      })
    })

    return () => {
      if (tickerRef.current) gsap.ticker.remove(tickerRef.current)
    }
  }, [])

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0, contain: 'layout paint' }}
    >
      <div className="absolute inset-0" style={{ perspective: '1200px' }}>
        {TECH_ELEMENTS.map((el, i) => (
          <div
            key={el.label}
            ref={(node) => { itemsRef.current[i] = node }}
            className={`absolute ${el.size} will-change-transform`}
            style={{
              left: `${el.x}%`,
              top: `${el.y}%`,
              transform: 'translate(-50%, -50%)',
              opacity: 0,
            }}
          >
            {el.icon}
          </div>
        ))}
      </div>

      {/* Cursor glow orbs */}
      <div
        ref={(n) => { orbsRef.current[0] = n }}
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(255,51,102,0.1) 0%, transparent 70%)',
          left: '40%', top: '40%',
          transform: 'translate(-50%, -50%)',
          opacity: 0.6,
        }}
      />
      <div
        ref={(n) => { orbsRef.current[1] = n }}
        className="absolute w-[400px] h-[400px] rounded-full pointer-events-none will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(94,23,235,0.12) 0%, transparent 70%)',
          left: '60%', top: '30%',
          transform: 'translate(-50%, -50%)',
          opacity: 0.5,
        }}
      />
    </div>
  )
})

AnimatedTechBackground.displayName = 'AnimatedTechBackground'
export default AnimatedTechBackground
