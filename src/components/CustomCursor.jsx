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

    const onMouseDown = () => ring.classList.add('cursor-click')
    const onMouseUp = () => ring.classList.remove('cursor-click')

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
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #00d4ff;
          pointer-events: none;
          z-index: 999999;
          will-change: transform;
          transition: width 0.2s, height 0.2s, background 0.2s;
          mix-blend-mode: difference;
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
          border: 1.5px solid rgba(0, 212, 255, 0.5);
          pointer-events: none;
          z-index: 999998;
          will-change: transform;
          transition: width 0.25s cubic-bezier(.34,1.56,.64,1),
                      height 0.25s cubic-bezier(.34,1.56,.64,1),
                      border-color 0.2s,
                      top 0.25s,
                      left 0.25s;
          box-shadow: 0 0 10px rgba(0, 212, 255, 0.15);
        }
        .cursor-ring.cursor-hover {
          width: 64px;
          height: 64px;
          top: -32px;
          left: -32px;
          border-color: rgba(0, 212, 255, 0.9);
          box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
        }
        .cursor-ring.cursor-click {
          width: 28px;
          height: 28px;
          top: -14px;
          left: -14px;
          border-color: rgba(0, 255, 136, 0.9);
        }
      `}</style>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>,
    document.body
  )
}

export default CustomCursor
