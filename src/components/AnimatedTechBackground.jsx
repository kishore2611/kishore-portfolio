import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

const AnimatedTechBackground = ({ mousePosition }) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

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

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <motion.div
        className="absolute inset-0"
        style={{
          perspective: '1000px',
        }}
      >
        {techElements.map((element, index) => {
          const offsetX = mousePosition.x * element.depth * 40
          const offsetY = mousePosition.y * element.depth * 40

          return (
            <motion.div
              key={`${element.label}-${index}`}
              className={`absolute ${element.size} opacity-20 hover:opacity-40 transition-opacity duration-300`}
              style={{
                left: `${element.x}%`,
                top: `${element.y}%`,
                transform: 'translate(-50%, -50%)',
                filter: `drop-shadow(0 0 ${element.depth * 8}px rgba(0, 212, 255, 0.6))`,
              }}
              animate={
                isMounted
                  ? {
                      x: offsetX,
                      y: offsetY,
                      rotateZ: (mousePosition.x + mousePosition.y) * 30,
                      scale: 1 + Math.abs(mousePosition.x + mousePosition.y) * 0.1,
                    }
                  : {}
              }
              transition={{
                type: 'spring',
                stiffness: 150,
                damping: 15,
                mass: 0.8,
              }}
            >
              {element.icon}
            </motion.div>
          )
        })}
      </motion.div>

      {/* Glow orbs that follow cursor */}
      <motion.div
        className="absolute w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(0, 212, 255, 0.15) 0%, transparent 70%)',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        animate={
          isMounted
            ? {
                x: mousePosition.x * 100,
                y: mousePosition.y * 100,
              }
            : {}
        }
        transition={{
          type: 'spring',
          stiffness: 100,
          damping: 20,
        }}
      />

      <motion.div
        className="absolute w-52 h-52 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(0, 255, 136, 0.2) 0%, transparent 70%)',
          left: '70%',
          top: '30%',
        }}
        animate={
          isMounted
            ? {
                x: mousePosition.x * 80,
                y: mousePosition.y * 80,
              }
            : {}
        }
        transition={{
          type: 'spring',
          stiffness: 120,
          damping: 18,
        }}
      />
    </div>
  )
}

export default AnimatedTechBackground
