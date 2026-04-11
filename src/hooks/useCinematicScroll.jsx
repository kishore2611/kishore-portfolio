import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

const createSectionTimeline = (section) => {
  const headline = section.querySelector('h1, h2')
  const cards = section.querySelectorAll('.glass, .glass-card, .btn-primary, .btn-outline, .glass-button')
  const media = section.querySelector('canvas, img, video, svg')

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 85%',
      end: 'bottom 20%',
      toggleActions: 'play none none reverse',
      invalidateOnRefresh: true,
    },
  })

  tl.fromTo(
    section,
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
  )

  if (headline) {
    tl.fromTo(
      headline,
      { y: 20, opacity: 0, scale: 0.98 },
      { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' },
      0.2,
    )
  }

  if (cards.length) {
    tl.fromTo(
      cards,
      { y: 30, opacity: 0, scale: 0.99 },
      { y: 0, opacity: 1, scale: 1, stagger: 0.05, duration: 0.6, ease: 'back.out(1.2)' },
      0.3,
    )
  }

  if (media) {
    tl.fromTo(
      media,
      { scale: 0.95, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1, ease: 'power2.out' },
      0.1,
    )
  }

  return tl
}

const useCinematicScroll = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const lenis = new Lenis({
      duration: 1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      direction: 'vertical',
      gestureDirection: 'vertical',
      smoothTouch: false,
      wheelMultiplier: 1.1,
      touchMultiplier: 1.5,
      infinite: false,
      lerp: 0.1, // Added for extra smoothness
    })

    let rafId = null
    const raf = (time) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    lenis.on('scroll', () => {
      ScrollTrigger.update()
    })

    const mm = gsap.matchMedia()

    mm.add('(min-width: 768px)', () => {
      // We rely on component-level ScrollTrigger animations now
      // This prevents double-animation and "stuck" scrolling
      return () => {}
    })

    ScrollTrigger.refresh()
    const delayedRefresh = window.setTimeout(() => {
      ScrollTrigger.refresh()
      lenis.resize()
    }, 1000)

    return () => {
      window.clearTimeout(delayedRefresh)
      mm.revert()
      lenis.destroy()
      if (rafId) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [])
}

export default useCinematicScroll
