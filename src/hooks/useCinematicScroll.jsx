import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { initLenis, destroyLenis } from '../lib/lenis'

gsap.registerPlugin(ScrollTrigger)

/**
 * Single Lenis + GSAP ScrollTrigger integration (one rAF via gsap.ticker).
 * Cleanup must remove the same function passed to ticker.add — not lenis.raf alone.
 */
const useCinematicScroll = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const lenis = initLenis()
    if (!lenis) return

    const onTick = (time) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)

    lenis.on('scroll', ScrollTrigger.update)

    ScrollTrigger.refresh()
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh()
      lenis.resize()
    }, 800)

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
      gsap.ticker.remove(onTick)
      destroyLenis()
      ScrollTrigger.killAll()
    }
  }, [])
}

export default useCinematicScroll
