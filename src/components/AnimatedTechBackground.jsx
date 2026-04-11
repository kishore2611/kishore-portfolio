import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const AnimatedTechBackground = ({ mousePosition }) => {
  const containerRef = useRef(null)
  const itemsRef = useRef([])
  const orbsRef = useRef([])

  const techElements = [
    { icon: '⚙️', x: 10, y: 20, size: 'text-6xl', depth: 3, label: 'Node.js' },
    { icon: '🗄️', x: 85, y: 15, size: 'text-5xl', depth: 2, label: 'Database' },
    { icon: '☁️', x: 15, y: 80, size: 'text-6xl', depth: 4, label: 'Cloud' },
    { icon: '🔗', x: 80, y: 70, size: 'text-5xl', depth: 2.5, label: 'API' },
    { icon: '🐳', x: 45, y: 25, size: 'text-7xl', depth: 3.5, label: 'Docker' },
    { icon: '🚀', x: 70, y: 45, size: 'text-5xl', depth: 2, label: 'Rocket' },
    { icon: '⚡', x: 20, y: 55, size: 'text-6xl', depth: 3, label: 'Speed' },
    { icon: '🔐', x: 75, y: 85, size: 'text-5xl', depth: 2.5, label: 'Security' },
    { icon: '💾', x: 50, y: 70, size: 'text-6xl', depth: 3.5, label: 'Storage' },
    { icon: '🧠', x: 10, y: 40, size: 'text-5xl', depth: 2, label: 'AI' },
  ]

  useEffect(() => {
    // Initial entrance animation
    gsap.fromTo(itemsRef.current, 
      { opacity: 0, scale: 0.5 },
      { opacity: 0.15, scale: 1, duration: 1.5, stagger: 0.1, ease: 'power4.out' }
    )
  }, [])

  useEffect(() => {
    // Parallax effect based on mouse position
    itemsRef.current.forEach((item, index) => {
      if (!item) return
      const element = techElements[index]
      const offsetX = mousePosition.x * element.depth * 30
      const offsetY = mousePosition.y * element.depth * 30
      
      gsap.to(item, {
        x: offsetX,
        y: offsetY,
        rotationZ: (mousePosition.x + mousePosition.y) * 15,
        duration: 0.8,
        ease: 'power2.out'
      })
    })

    // Glow orbs movement
    orbsRef.current.forEach((orb, index) => {
      if (!orb) return
      const factor = index === 0 ? 80 : 50
      gsap.to(orb, {
        x: mousePosition.x * factor,
        y: mousePosition.y * factor,
        duration: 1.2,
        ease: 'power2.out'
      })
    })
  }, [mousePosition])

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div className="absolute inset-0" style={{ perspective: '1200px' }}>
        {techElements.map((element, index) => (
          <div
            key={`${element.label}-${index}`}
            ref={el => itemsRef.current[index] = el}
            className={`absolute ${element.size} transition-opacity duration-500`}
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              transform: 'translate(-50%, -50%)',
              opacity: 0, // Handled by gsap
            }}
          >
            {element.icon}
          </div>
        ))}
      </div>

      {/* Sharp Glow orbs that follow cursor - Adapts to theme */}
      <div
        ref={el => orbsRef.current[0] = el}
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none opacity-20"
        style={{
          background: document.documentElement.dataset.theme === 'light' 
            ? 'radial-gradient(circle, rgba(2, 132, 199, 0.2) 0%, transparent 80%)'
            : 'radial-gradient(circle, rgba(0, 212, 255, 0.2) 0%, transparent 80%)',
          left: '40%',
          top: '40%',
          transform: 'translate(-50%, -50%)',
        }}
      />

      <div
        ref={el => orbsRef.current[1] = el}
        className="absolute w-[350px] h-[350px] rounded-full pointer-events-none opacity-25"
        style={{
          background: document.documentElement.dataset.theme === 'light'
            ? 'radial-gradient(circle, rgba(5, 150, 105, 0.2) 0%, transparent 80%)'
            : 'radial-gradient(circle, rgba(0, 255, 136, 0.25) 0%, transparent 80%)',
          left: '60%',
          top: '30%',
          transform: 'translate(-50%, -50%)',
        }}
      />
    </div>
  )
}

export default AnimatedTechBackground
