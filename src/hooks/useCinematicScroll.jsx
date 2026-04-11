import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ── Easing curve (expo out — Apple-style deceleration) ─────────────────────
const expoOut = (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t)

const useCinematicScroll = () => {
  const lenisRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Create ONE Lenis instance, tuned for Apple-style scroll feel
    const lenis = new Lenis({
      duration: 1.1,
      easing: expoOut,
      smoothTouch: false,      // Native touch is already smooth
      wheelMultiplier: 0.95,   // Slightly reduced wheel sensitivity
      touchMultiplier: 1.3,
      infinite: false,
      prevent: (node) =>
        node.classList.contains('no-smooth-scroll') ||
        node.tagName === 'TEXTAREA' ||
        node.tagName === 'INPUT',
    })

    lenisRef.current = lenis

    // Sync Lenis with GSAP ScrollTrigger using gsap.ticker
    // This is the OFFICIAL recommended integration — single rAF, no conflicts
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000) // GSAP ticker gives seconds, Lenis wants ms
    })
    gsap.ticker.lagSmoothing(0) // Disable GSAP lag smoothing for scroll sync

    // Keep ScrollTrigger in sync with Lenis position
    lenis.on('scroll', ScrollTrigger.update)

    // Refresh after fonts/images settle
    ScrollTrigger.refresh()
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh()
      lenis.resize()
    }, 800)

    // Pause when tab hidden — saves CPU
    const onVisibilityChange = () => {
      if (document.hidden) {
        gsap.ticker.sleep()
      } else {
        gsap.ticker.wake()
        lenis.resize()
      }
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      clearTimeout(refreshTimer)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      gsap.ticker.remove(lenis.raf)
      lenis.destroy()
      ScrollTrigger.killAll()
    }
  }, [])
}

export default useCinematicScroll
