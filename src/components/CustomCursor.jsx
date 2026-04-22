import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

const CustomCursor = () => {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    // Skip touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return

    let mouseX = -100
    let mouseY = -100
    let ringX = -100
    let ringY = -100
    let rafId = null

    // Move dot instantly
    const onMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`
    }

    // Animate ring on rAF loop with lag
    const loop = () => {
      ringX += (mouseX - ringX) * 0.13
      ringY += (mouseY - ringY) * 0.13
      ring.style.transform = `translate(${ringX}px, ${ringY}px)`
      rafId = requestAnimationFrame(loop)
    }
    rafId = requestAnimationFrame(loop)

    // Hover effects (scale only via CSS class)
    const onMouseOver = (e) => {
      const el = e.target
      const interactive =
        el.tagName === 'A' ||
        el.tagName === 'BUTTON' ||
        el.closest('a') ||
        el.closest('button') ||
        el.getAttribute('role') === 'button'

      if (interactive) {
        dot.classList.add('cursor-hover')
        ring.classList.add('cursor-hover')
      } else {
        dot.classList.remove('cursor-hover')
        ring.classList.remove('cursor-hover')
      }
    }

    const onMouseDown = () => {
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) scale(0.5)`
      ring.classList.add('cursor-click')
    }
    const onMouseUp = () => {
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) scale(1)`
      ring.classList.remove('cursor-click')
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mouseover', onMouseOver, { passive: true })
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseover', onMouseOver)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [])

  // Don't render on touch devices
  if (typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
    return null
  }

  return createPortal(
    <>
      <style>{`
        .cursor-dot {
          position: fixed;
          top: -4px;
          left: -4px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #ffffff;
          pointer-events: none;
          z-index: 999999;
          will-change: transform;
          transition: width 0.3s, height 0.3s, background 0.3s;
        }
        .cursor-dot.cursor-hover {
          width: 0;
          height: 0;
          background: transparent;
        }
        .cursor-ring {
          position: fixed;
          top: -18px;
          left: -18px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.2);
          pointer-events: none;
          z-index: 999998;
          will-change: transform;
          transition: width 0.4s cubic-bezier(.17,.67,.83,.67),
                      height 0.4s cubic-bezier(.17,.67,.83,.67),
                      border-color 0.4s,
                      background 0.4s;
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.05);
        }
        .cursor-ring.cursor-hover {
          width: 80px;
          height: 80px;
          top: -40px;
          left: -40px;
          border-color: var(--color-accent);
          background: rgba(200, 168, 122, 0.05);
          backdrop-filter: blur(4px);
          box-shadow: 0 0 30px rgba(200, 168, 122, 0.15);
        }
        .cursor-ring.cursor-click {
          width: 20px;
          height: 20px;
          top: -10px;
          left: -10px;
          border-color: var(--color-accent-vibrant);
          background: var(--color-accent-soft);
          box-shadow: 0 0 20px var(--color-accent-vibrant);
        }
      `}</style>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>,
    document.body
  )
}

export default CustomCursor
