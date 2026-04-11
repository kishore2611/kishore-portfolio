import { useEffect, useRef } from 'react'

const ParticleBackground = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    class Particle {
      constructor() {
        this.reset()
      }

      reset() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.vx = (Math.random() - 0.5) * 0.3
        this.vy = (Math.random() - 0.5) * 0.3
        this.size = Math.random() * 1.5 + 0.2
      }

      update() {
        this.x += this.vx
        this.y += this.vy

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1
      }

      draw(color) {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.fill()
      }
    }

    const particles = Array.from({ length: 40 }, () => new Particle())

    let animationId
    const animate = () => {
      const isLight = document.documentElement.dataset.theme === 'light'
      const particleColor = isLight ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.15)'
      const lineColor = isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)'

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p, i) => {
        p.update()
        p.draw(particleColor)

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 150) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = lineColor
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-40"
      style={{ background: 'transparent' }}
    />
  )
}

export default ParticleBackground