import { useRef, useEffect, lazy, Suspense } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const ScrollModel3 = lazy(() => import('./ScrollModel3'))

const LABELS = [
  { text: 'Think', sub: 'Problem-solving mindset' },
  { text: 'Plan', sub: 'Strategic architecture' },
  { text: 'Build', sub: 'Robust implementation' },
  { text: 'Grow', sub: 'Continuous evolution' },
]

const ModelShowcase3 = () => {
  const sectionRef = useRef(null)
  const scrollRef = useRef(0)
  const labelsRef = useRef([])
  const progressBarRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.2,
      onUpdate: (self) => {
        scrollRef.current = self.progress
      },
    })

    labelsRef.current.forEach((el, i) => {
      if (!el) return
      const segmentStart = i / LABELS.length
      const segmentEnd = (i + 1) / LABELS.length
      const mid = (segmentStart + segmentEnd) / 2

      gsap.fromTo(
        el,
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: `${segmentStart * 100}% top`,
            end: `${mid * 100}% top`,
            scrub: true,
          },
        }
      )

      gsap.to(el, {
        opacity: 0, y: -30, scale: 0.95, duration: 0.4, ease: 'power2.in',
        scrollTrigger: {
          trigger: section,
          start: `${mid * 100}% top`,
          end: `${segmentEnd * 100}% top`,
          scrub: true,
        },
      })
    })

    if (progressBarRef.current) {
      gsap.to(progressBarRef.current, {
        scaleX: 1, ease: 'none',
        scrollTrigger: { trigger: section, start: 'top top', end: 'bottom bottom', scrub: true },
      })
    }

    return () => {
      st.kill()
      ScrollTrigger.getAll().filter((t) => t.trigger === section).forEach((t) => t.kill())
    }
  }, [])

  return (
    <section id="model-showcase-3" ref={sectionRef} className="relative" style={{ height: '400vh' }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Suspense fallback={null}>
            <ScrollModel3 scrollRef={scrollRef} />
          </Suspense>
        </div>
        <div className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 30%, rgba(15,14,18,0.8) 0%, transparent 55%), radial-gradient(ellipse at 50% 70%, rgba(15,14,18,0.7) 0%, transparent 55%)',
          }}
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-center items-center px-8 pointer-events-none">
          <div className="max-w-md text-center">
            {LABELS.map((label, i) => (
              <div
                key={label.text}
                ref={(el) => (labelsRef.current[i] = el)}
                className="absolute opacity-0 left-1/2"
                style={{ top: '50%', transform: 'translate(-50%, -50%)', width: '100%', maxWidth: '28rem' }}
              >
                <p className="font-mono text-[11px] text-accent uppercase tracking-[0.25em] mb-3">
                  {String(i + 1).padStart(2, '0')} / {label.sub}
                </p>
                <h2 className="display-font text-6xl md:text-8xl lg:text-9xl font-bold text-white tracking-tighter leading-[0.9]">
                  {label.text}
                </h2>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-8 left-8 right-8 lg:left-[88px] lg:right-[88px] z-20">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[9px] text-muted uppercase tracking-widest">Scroll</span>
            <div className="flex-1 h-[1px] bg-white/10 relative overflow-hidden">
              <div ref={progressBarRef} className="absolute inset-y-0 left-0 bg-accent origin-left" style={{ transform: 'scaleX(0)', width: '100%' }} />
            </div>
            <span className="font-mono text-[9px] text-muted uppercase tracking-widest">Explore</span>
          </div>
        </div>
        <div className="absolute top-8 right-8 lg:right-[88px] z-20 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="font-mono text-[9px] text-muted uppercase tracking-widest">Interactive 3D</span>
        </div>
      </div>
    </section>
  )
}

export default ModelShowcase3

