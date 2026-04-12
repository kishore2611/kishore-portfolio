import Lenis from 'lenis'

const expoOut = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))

let lenisInstance = null

export function getLenis() {
  return lenisInstance
}

/** Single Lenis instance for the app — must match useCinematicScroll lifecycle */
export function initLenis() {
  if (typeof window === 'undefined') return null
  if (lenisInstance) return lenisInstance

  lenisInstance = new Lenis({
    duration: 1.1,
    easing: expoOut,
    smoothTouch: false,
    wheelMultiplier: 0.95,
    touchMultiplier: 1.3,
    infinite: false,
    prevent: (node) =>
      node.classList.contains('no-smooth-scroll') ||
      node.tagName === 'TEXTAREA' ||
      node.tagName === 'INPUT',
  })

  return lenisInstance
}

export function destroyLenis() {
  if (lenisInstance) {
    lenisInstance.destroy()
    lenisInstance = null
  }
}

/** Prefer Lenis so scroll position matches virtual smooth scroll */
export function scrollToElement(el, options = {}) {
  if (!el) return
  const lenis = getLenis()
  const { offset = 0, duration } = options
  if (lenis) {
    lenis.scrollTo(el, {
      offset,
      duration: duration ?? 1.05,
    })
  } else {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

export function scrollToTopSmooth() {
  const lenis = getLenis()
  if (lenis) {
    lenis.scrollTo(0, { duration: 1.15 })
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
