import { useRef, useEffect, useState, useCallback, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * SectionCanvas — viewport-optimized R3F wrapper for section backgrounds.
 * Mounts/unmounts Canvas via IntersectionObserver.
 * Uses frameloop="demand" with scroll-based invalidation for zero idle GPU cost.
 */
export default function SectionCanvas({ children, camera = { position: [0, 0, 8], fov: 50 }, style = {} }) {
  const containerRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  const [dpr, setDpr] = useState(1)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    // Cap DPR for performance
    const clampedDpr = Math.min(window.devicePixelRatio, 1.2)
    setDpr(clampedDpr)

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { rootMargin: '10% 0px 10% 0px', threshold: 0.01 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Invalidate on scroll when visible
  const invalidateRef = useRef(null)
  useEffect(() => {
    if (!isVisible) return
    let raf
    const onScroll = () => {
      if (invalidateRef.current) {
        cancelAnimationFrame(raf)
        raf = requestAnimationFrame(() => invalidateRef.current?.())
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [isVisible])

  // Reduced motion support
  const [reducedMotion, setReducedMotion] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handler = (e) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  if (!isVisible) {
    return (
      <div
        ref={containerRef}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          ...style,
        }}
      />
    )
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        ...style,
      }}
    >
      <Canvas
        camera={camera}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
        }}
        dpr={dpr}
        frameloop="demand"
        style={{ background: 'transparent' }}
        onCreated={({ invalidate }) => {
          invalidateRef.current = invalidate
          // Initial render
          invalidate()
        }}
      >
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </Canvas>
    </div>
  )
}

