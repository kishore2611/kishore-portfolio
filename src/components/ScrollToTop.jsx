import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { getLenis, scrollToTopSmooth } from '../lib/lenis'

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false)
  const buttonRef = useRef(null)

  useEffect(() => {
    const toggleVisibility = () => {
      const lenis = getLenis()
      const y = typeof lenis?.scroll === 'number' ? lenis.scroll : window.scrollY
      setIsVisible(y > 500)
    }

    toggleVisibility()
    window.addEventListener('scroll', toggleVisibility, { passive: true })
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  useEffect(() => {
    if (buttonRef.current) {
      if (isVisible) {
        gsap.to(buttonRef.current, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.4,
          pointerEvents: 'auto',
          ease: 'back.out(1.7)',
        })
      } else {
        gsap.to(buttonRef.current, {
          opacity: 0,
          y: 20,
          scale: 0.5,
          duration: 0.3,
          pointerEvents: 'none',
          ease: 'power2.in',
        })
      }
    }
  }, [isVisible])

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={() => scrollToTopSmooth()}
      className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full glass-button flex items-center justify-center text-accent text-xl shadow-2xl hover:scale-110 active:scale-95 transition-transform"
      aria-label="Scroll to top"
      style={{ opacity: 0, transform: 'translateY(20px) scale(0.5)', pointerEvents: 'none' }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
      </svg>
    </button>
  )
}

export default ScrollToTop
