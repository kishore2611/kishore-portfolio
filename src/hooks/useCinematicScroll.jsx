import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

const createSectionTimeline = (section) => {
  const headline = section.querySelector('h1, h2')
  const cards = section.querySelectorAll('.glass, .card, .btn-primary, .btn-outline, .motion-div')
  const media = section.querySelector('canvas, img, video, svg')

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 85%',
      end: 'bottom top',
      scrub: 0.5,
      invalidateOnRefresh: true,
    },
  })

  tl.fromTo(
    section,
    { autoAlpha: 0.9, y: 40, filter: 'blur(2px)' },
    { autoAlpha: 1, y: 0, filter: 'blur(0px)', ease: 'none' },
  )

  if (headline) {
    tl.fromTo(
      headline,
      { y: 40, autoAlpha: 0.35, scale: 0.92 },
      { y: 0, autoAlpha: 1, scale: 1, ease: 'power3.out' },
      0,
    )
  }

  if (cards.length) {
    tl.fromTo(
      cards,
      { y: 40, autoAlpha: 0, scale: 0.97, filter: 'blur(3px)' },
      { y: 0, autoAlpha: 1, scale: 1, filter: 'blur(0px)', stagger: 0.08, ease: 'power3.out' },
      0.1,
    )
  }

  if (media) {
    tl.fromTo(
      media,
      { scale: 0.98, opacity: 0.9 },
      { scale: 1.02, opacity: 1, ease: 'none' },
      0,
    )
  }

  return tl
}

const createHeroTimeline = () => {
  const hero = document.querySelector('#home')
  if (!hero) return null

  const heroText = hero.querySelector('.relative.z-10')
  const heroCanvas = hero.querySelector('.absolute.inset-0')

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      invalidateOnRefresh: true,
    },
  })

  if (heroText) {
    tl.fromTo(
      heroText,
      { y: 0, scale: 1, autoAlpha: 1 },
      { y: -80, scale: 0.96, autoAlpha: 0.75, ease: 'none' },
      0,
    )
  }

  if (heroCanvas) {
    tl.fromTo(
      heroCanvas,
      { scale: 1, filter: 'blur(0px)' },
      { scale: 1.05, filter: 'blur(1px)', ease: 'none' },
      0,
    )
  }

  const badges = hero.querySelectorAll('.glass')
  if (badges.length) {
    tl.fromTo(
      badges,
      { y: 30, autoAlpha: 0, scale: 0.95 },
      { y: 0, autoAlpha: 1, scale: 1, stagger: 0.08, ease: 'power3.out' },
      0.1,
    )
  }

  return tl
}

const useCinematicScroll = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      direction: 'vertical',
      gestureDirection: 'vertical',
      smoothTouch: false,
      wheelMultiplier: 1,
      touchMultiplier: 1,
      infinite: false,
    })

    let rafId = null
    const raf = (time) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (arguments.length) {
          lenis.scrollTo(value, { immediate: false })
        }
        return lenis.scroll
      },
      scrollHeight() {
        return document.documentElement.scrollHeight
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight }
      },
      pinType: document.documentElement.style.transform ? 'transform' : 'fixed',
    })

    lenis.on('scroll', () => {
      ScrollTrigger.update()
    })

    const mm = gsap.matchMedia()

    mm.add('(min-width: 768px)', () => {
      // Skip hero section animation - let it show immediately
      const sections = gsap.utils.toArray('section[id]').filter((section) => section.id !== 'home')
      const sectionTimelines = sections.map(createSectionTimeline)
      return () => {
        sectionTimelines.forEach((tl) => tl?.kill())
      }
    })

    mm.add('(max-width: 767px)', () => {
      const sections = gsap.utils.toArray('section[id]')
      const sectionTimelines = sections.map((section) => {
        return gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            end: 'bottom top',
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        })
        .fromTo(section, { autoAlpha: 0.8, y: 40, filter: 'blur(3px)' }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', ease: 'none' })
      })
      return () => sectionTimelines.forEach((tl) => tl.kill())
    })

    ScrollTrigger.refresh()
    const delayedRefresh = window.setTimeout(() => {
      ScrollTrigger.refresh()
      lenis.resize()
    }, 200)

    return () => {() => ScrollTrigger.update()
      window.clearTimeout(delayedRefresh)
      mm.revert()
      lenis.off('scroll', ScrollTrigger.update)
      lenis.destroy()
      if (rafId) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [])
}

export default useCinematicScroll
