import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function Preloader({ onComplete }) {
  const containerRef = useRef(null)
  const textRef = useRef(null)
  const progressRef = useRef(null)
  const countRef = useRef(null)

  useEffect(() => {
    // Lock scroll
    document.body.style.overflow = 'hidden'

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = ''
        if (onComplete) onComplete()
      }
    })

    // Progress counting animation
    let count = { value: 0 }
    tl.to(count, {
      value: 100,
      duration: 2,
      ease: 'power3.inOut',
      onUpdate: () => {
        if (countRef.current) {
          countRef.current.innerText = Math.round(count.value) + '%'
        }
      }
    }, 0)

    // Progress bar fill
    tl.to(progressRef.current, {
      scaleX: 1,
      duration: 2,
      ease: 'power3.inOut'
    }, 0)

    // Text slide up
    tl.fromTo(textRef.current, {
      y: 40,
      opacity: 0,
      clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)'
    }, {
      y: 0,
      opacity: 1,
      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
      duration: 1,
      ease: 'power4.out',
    }, 0.5)

    // Exit animation
    tl.to(containerRef.current, {
      yPercent: -100,
      duration: 1.2,
      ease: 'expo.inOut',
      delay: 0.2
    })

    return () => tl.kill()
  }, [onComplete])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-dark-bg text-text-primary origin-top"
      style={{ contain: 'strict' }}
    >
      <div className="flex flex-col items-center gap-6 z-10">
        <h1 
          ref={textRef} 
          className="display-font text-5xl md:text-7xl font-bold tracking-tighter uppercase"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' }}
        >
          Kishore
        </h1>
        <div className="flex items-center gap-4 w-64">
          <div className="flex-1 h-[2px] bg-white/10 rounded-full overflow-hidden">
            <div 
              ref={progressRef}
              className="h-full bg-white origin-left scale-x-0"
            />
          </div>
          <span ref={countRef} className="font-mono text-sm tracking-widest min-w-[3ch] text-right text-text-secondary">
            0%
          </span>
        </div>
      </div>
      
      {/* Background ambient glow */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-30">
        <div className="w-[40vw] h-[40vw] bg-accent/20 blur-[100px] rounded-full mix-blend-screen" />
      </div>
    </div>
  )
}
