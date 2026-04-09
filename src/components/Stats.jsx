import { motion, useInView } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'

const AnimatedCounter = ({ target, suffix = '', duration = 900 }) => {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const frameRef = useRef(null)
  const inView = useInView(ref, {
    triggerOnce: true,
    threshold: 0.3,
  })

  useEffect(() => {
    if (!inView) {
      return
    }

    const startTime = performance.now()
    const step = (timestamp) => {
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const value = Math.round(progress * target)
      setCount(value)

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(step)
      } else {
        cancelAnimationFrame(frameRef.current)
      }
    }

    frameRef.current = requestAnimationFrame(step)

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [inView, target, duration])

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  )
}

const Stats = () => {
  const stats = [
    { number: 3, label: 'Years Experience', suffix: '+' },
    { number: 12, label: 'Projects Shipped', suffix: '+' },
    { number: 25, label: 'APIs Built', suffix: '+' },
    { number: 5, label: 'Companies Worked', suffix: '+' },
  ]

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center glass-card p-6 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.55, delay: index * 0.1, type: 'spring', stiffness: 220 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="text-4xl md:text-5xl font-bold text-accent mb-2">
                <AnimatedCounter target={stat.number} suffix={stat.suffix} />
              </div>
              <div className="text-text-secondary font-mono text-sm uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Stats