import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false)
  const buttonRef = useRef(null)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
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
          display: 'flex',
          ease: 'back.out(1.7)'
        })
      } else {
        gsap.to(buttonRef.current, {
          opacity: 0,
          y: 20,
          scale: 0.5,
          duration: 0.3,
          display: 'none',
          ease: 'power2.in'
        })
      }
    }
  }, [isVisible])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <button
      ref={buttonRef}
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full glass-button flex items-center justify-center text-accent text-xl shadow-2xl hover:scale-110 active:scale-95 transition-transform"
      aria-label="Scroll to top"
      style={{ display: 'none', opacity: 0, transform: 'translateY(20px) scale(0.5)' }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.5 15.75l7.5-7.5 7.5 7.5"
        />
      </svg>
    </button>
  )
}

export default ScrollToTop
