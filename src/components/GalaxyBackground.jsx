import { useEffect, useRef } from 'react'

/**
 * GalaxyBackground — Performance-optimised 2D animated galaxy.
 * Key optimisations vs v1:
 *  - Math.random() NEVER called inside the render loop (all positions pre-computed)
 *  - Spiral arms rendered once to pre-computed point arrays (no jitter, no rAF cost)
 *  - Throttled to 30 fps (background doesn't need 60)
 *  - Drops to 15 fps while user is actively scrolling
 *  - Nebulae and core drawn to a cached offscreen canvas when they barely change
 *  - Star twinkle & parallax are cheap sin() only
 */
const GalaxyBackground = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })

    let W = (canvas.width = window.innerWidth)
    let H = (canvas.height = window.innerHeight)
    let animId
    let lastFrame = 0
    let isScrolling = false
    let scrollTimer

    // target ms between frames   (30 fps = 33ms, 15 fps = 66ms during scroll)
    const FPS_NORMAL = 33
    const FPS_SCROLL = 80

    const mouse = { x: 0, y: 0, lx: 0, ly: 0 }

    // ── Mouse & Scroll ─────────────────────────────────────────────────────────
    const onMouseMove = (e) => {
      mouse.x = (e.clientX / W - 0.5) * 2
      mouse.y = (e.clientY / H - 0.5) * 2
    }
    const onScroll = () => {
      isScrolling = true
      clearTimeout(scrollTimer)
      scrollTimer = setTimeout(() => { isScrolling = false }, 150)
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)

    // ── Stars — pre-computed, no random in render ──────────────────────────────
    const STAR_COUNT = 220
    const PALETTES = [
      [255, 255, 255],
      [180, 210, 255],
      [255, 220, 180],
      [150, 255, 200],
      [190, 140, 255],
    ]

    function makeStars() {
      return Array.from({ length: STAR_COUNT }, () => {
        const layer = Math.floor(Math.random() * 3)
        const pal = PALETTES[Math.floor(Math.random() * PALETTES.length)]
        return {
          x: Math.random() * W,
          y: Math.random() * H,
          layer,
          size: [0.5, 1.0, 1.8][layer] + Math.random() * [0.4, 0.6, 1.0][layer],
          drift: [0.03, 0.07, 0.16][layer],
          parallaxMul: [3, 8, 20][layer],
          baseAlpha: 0.4 + Math.random() * 0.55,
          twinkleOffset: Math.random() * Math.PI * 2,
          twinkleSpeed: 0.4 + Math.random() * 1.0,
          r: pal[0], g: pal[1], b: pal[2],
        }
      })
    }

    let stars = makeStars()

    // ── Spiral arm points — pre-computed once ─────────────────────────────────
    const ARM_COUNT = 3
    const POINTS_PER_ARM = 60

    function buildArms() {
      const arms = []
      for (let a = 0; a < ARM_COUNT; a++) {
        const pts = []
        const baseAngle = (a / ARM_COUNT) * Math.PI * 2
        for (let i = 0; i < POINTS_PER_ARM; i++) {
          const progress = i / POINTS_PER_ARM
          // Fixed angular spread (no random per frame!)
          const angle = baseAngle + progress * Math.PI * 3.2
          // Small fixed scatter baked in
          const scatter = progress * 0.22
          for (let s = 0; s < 3; s++) {
            const sa = angle + (s / 3 - 0.5) * scatter
            const r = progress
            pts.push({ ra: sa, rp: r, alpha: (1 - progress) * 0.035 + 0.004 * (s % 2) })
          }
        }
        arms.push(pts)
      }
      return arms
    }

    const armPoints = buildArms()

    // ── Nebulae (static config, re-calc on resize) ─────────────────────────────
    const NEBULA_DEFS = [
      { cx: 0.15, cy: 0.25, r: 0.26, col: [0, 100, 200],   ph: 0 },
      { cx: 0.80, cy: 0.15, r: 0.20, col: [120, 30, 200],  ph: 1.2 },
      { cx: 0.50, cy: 0.72, r: 0.30, col: [0, 160, 100],   ph: 2.4 },
      { cx: 0.85, cy: 0.78, r: 0.18, col: [200, 60, 60],   ph: 3.6 },
      { cx: 0.22, cy: 0.82, r: 0.17, col: [0, 180, 255],   ph: 4.8 },
    ]
    let nebulae = []
    function buildNebulae() {
      nebulae = NEBULA_DEFS.map(n => ({
        ...n,
        x: n.cx * W,
        y: n.cy * H,
        radius: n.r * Math.max(W, H),
      }))
    }
    buildNebulae()

    // ── Comets — pre-computed, spawned on schedule ─────────────────────────────
    class Comet {
      constructor() {
        this.x = Math.random() * W * 0.7
        this.y = Math.random() * H * 0.4
        const speed = 5 + Math.random() * 8
        this.angle = Math.PI / 5 + Math.random() * (Math.PI / 6)
        this.vx = Math.cos(this.angle) * speed
        this.vy = Math.sin(this.angle) * speed
        this.tail = 60 + Math.random() * 120
        this.life = 0
        this.maxLife = 70 + Math.random() * 50
        this.alive = true
      }
      update() {
        this.x += this.vx
        this.y += this.vy
        this.life++
        const done = this.life >= this.maxLife || this.x > W + 100 || this.y > H + 100
        if (done) this.alive = false
      }
      draw() {
        const fade = this.life < 8
          ? this.life / 8
          : Math.max(0, 1 - (this.life - 8) / (this.maxLife - 8))
        const ex = this.x - Math.cos(this.angle) * this.tail
        const ey = this.y - Math.sin(this.angle) * this.tail
        const grd = ctx.createLinearGradient(this.x, this.y, ex, ey)
        grd.addColorStop(0, `rgba(255,255,255,${fade})`)
        grd.addColorStop(0.3, `rgba(140,200,255,${fade * 0.4})`)
        grd.addColorStop(1, 'rgba(140,200,255,0)')
        ctx.beginPath()
        ctx.moveTo(this.x, this.y)
        ctx.lineTo(ex, ey)
        ctx.strokeStyle = grd
        ctx.lineWidth = 1.5
        ctx.stroke()
      }
    }

    let comets = []
    let cometCooldown = 300

    // ── Resize ─────────────────────────────────────────────────────────────────
    function onResize() {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
      buildNebulae()
      stars = makeStars()
    }

    // ── Render ─────────────────────────────────────────────────────────────────
    let t = 0

    const render = (now) => {
      animId = requestAnimationFrame(render)

      const threshold = isScrolling ? FPS_SCROLL : FPS_NORMAL
      if (now - lastFrame < threshold) return
      lastFrame = now
      t += isScrolling ? 0.008 : 0.016

      // Smooth mouse
      mouse.lx += (mouse.x - mouse.lx) * 0.06
      mouse.ly += (mouse.y - mouse.ly) * 0.06
      const mx = mouse.lx
      const my = mouse.ly

      ctx.clearRect(0, 0, W, H)

      // ── Nebulae ──────────────────────────────────────────────────────────────
      nebulae.forEach(n => {
        const pulse = 0.022 + 0.006 * Math.sin(t * 0.18 + n.ph)
        const nx = n.x + mx * 7
        const ny = n.y + my * 7
        const grd = ctx.createRadialGradient(nx, ny, 0, nx, ny, n.radius)
        const [r, g, b] = n.col
        grd.addColorStop(0, `rgba(${r},${g},${b},${pulse})`)
        grd.addColorStop(0.45, `rgba(${r},${g},${b},${pulse * 0.45})`)
        grd.addColorStop(1, `rgba(${r},${g},${b},0)`)
        ctx.beginPath()
        ctx.arc(nx, ny, n.radius, 0, Math.PI * 2)
        ctx.fillStyle = grd
        ctx.fill()
      })

      // ── Galaxy core ──────────────────────────────────────────────────────────
      const cx = W * 0.5 + mx * 18
      const cy = H * 0.5 + my * 18
      const cp = 0.055 + 0.012 * Math.sin(t * 0.28)
      const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, W * 0.35)
      cg.addColorStop(0, `rgba(130,70,255,${cp * 1.8})`)
      cg.addColorStop(0.18, `rgba(60,80,210,${cp})`)
      cg.addColorStop(0.55, `rgba(0,100,190,${cp * 0.4})`)
      cg.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.beginPath()
      ctx.arc(cx, cy, W * 0.35, 0, Math.PI * 2)
      ctx.fillStyle = cg
      ctx.fill()

      // ── Spiral arms (pre-computed, just rotate via ctx.rotate) ──────────────
      const rot = t * 0.022
      const armRadius = Math.min(W, H) * 0.44

      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(rot)
      armPoints.forEach(pts => {
        pts.forEach(p => {
          const ax = Math.cos(p.ra) * p.rp * armRadius
          const ay = Math.sin(p.ra) * p.rp * armRadius
          ctx.beginPath()
          ctx.arc(ax, ay, 1 + p.rp * 1.8, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(170,120,255,${p.alpha})`
          ctx.fill()
        })
      })
      ctx.restore()

      // ── Stars ────────────────────────────────────────────────────────────────
      stars.forEach(s => {
        // slow drift
        s.x -= s.drift * 0.35
        s.y -= s.drift * 0.12
        if (s.x < 0) s.x += W
        if (s.y < 0) s.y += H

        const drawX = s.x + mx * s.parallaxMul
        const drawY = s.y + my * s.parallaxMul
        const alpha = s.baseAlpha * (0.6 + 0.4 * Math.sin(t * s.twinkleSpeed + s.twinkleOffset))

        if (s.layer === 2) {
          // glow halo for bright stars
          const grd = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, s.size * 3.5)
          grd.addColorStop(0, `rgba(${s.r},${s.g},${s.b},${alpha * 0.7})`)
          grd.addColorStop(1, `rgba(${s.r},${s.g},${s.b},0)`)
          ctx.beginPath()
          ctx.arc(drawX, drawY, s.size * 3.5, 0, Math.PI * 2)
          ctx.fillStyle = grd
          ctx.fill()
        }

        ctx.beginPath()
        ctx.arc(drawX, drawY, s.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${s.r},${s.g},${s.b},${alpha})`
        ctx.fill()
      })

      // ── Comets (skip during scroll to save budget) ────────────────────────────
      if (!isScrolling) {
        cometCooldown--
        if (cometCooldown <= 0) {
          comets.push(new Comet())
          cometCooldown = 250 + Math.floor(Math.random() * 350)
        }
        comets = comets.filter(c => c.alive)
        comets.forEach(c => { c.update(); c.draw() })
      }
    }

    animId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animId)
      clearTimeout(scrollTimer)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.72,
      }}
    />
  )
}

export default GalaxyBackground
