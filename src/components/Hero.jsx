import { lazy, Suspense, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { uiAudio } from '../utils/audio'
import { scrollToElement } from '../lib/lenis'

const HeroNetworkCanvas = lazy(() => import('./HeroNetworkCanvas'))

const scrollToSection = (id) => {
  const el = document.getElementById(id)
  scrollToElement(el, { offset: 0 })
}

const Hero = () => {
  const contentRef = useRef(null)
  const badgeRef = useRef(null)
  const titleRef = useRef(null)
  const textRef = useRef(null)
  const buttonsRef = useRef(null)
  const statsRef = useRef(null)

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    tl.fromTo(contentRef.current, { opacity: 0 }, { opacity: 1, duration: 1 })
      .fromTo(badgeRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.5')
      .fromTo(titleRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.4')
      .fromTo(textRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.6')
      .fromTo(buttonsRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.6')
      .fromTo(statsRef.current.children, { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.6 }, '-=0.4')

    const magneticBtns = buttonsRef.current.querySelectorAll('button')
    const handleMagnetic = (e) => {
      const btn = e.currentTarget
      const rect = btn.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2

      gsap.to(btn, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.4,
        ease: 'power3.out',
      })
    }

    const resetMagnetic = (e) => {
      gsap.to(e.currentTarget, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.3)',
      })
    }

    magneticBtns.forEach((btn) => {
      btn.addEventListener('mousemove', handleMagnetic)
      btn.addEventListener('mouseleave', resetMagnetic)
      btn.addEventListener('mouseenter', () => uiAudio.playHover())
      btn.addEventListener('click', () => uiAudio.playClick())
    })

    return () => {
      magneticBtns.forEach((btn) => {
        btn.removeEventListener('mousemove', handleMagnetic)
        btn.removeEventListener('mouseleave', resetMagnetic)
      })
    }
  }, [])

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden bg-dark-bg pt-20">
      <div className="absolute inset-0 opacity-60" style={{ contain: 'strict' }}>
        <Suspense
          fallback={
            <div
              className="w-full h-full min-h-[50vh] bg-transparent"
              aria-hidden
            />
          }
        >
          <HeroNetworkCanvas />
        </Suspense>
      </div>

      <div ref={contentRef} className="relative z-10 text-center max-w-4xl mx-auto px-4 mt-12 md:mt-20">
        <div ref={badgeRef} className="inline-block px-4 py-2 glass-button rounded-full mb-8 border-accent/20">
          <span className="text-accent font-mono text-sm uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse shadow-[0_0_10px_#00d4ff]" />
            Available for new opportunities
          </span>
        </div>

        <h1 ref={titleRef} className="text-4xl md:text-8xl font-black mb-8 tracking-tighter leading-[1.1]">
          <span className="text-text-primary">Kishore Kumar</span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-secondary">
            Node.js Developer
          </span>
        </h1>

        <p ref={textRef} className="text-lg md:text-2xl text-text-secondary mb-10 md:mb-12 max-w-2xl mx-auto leading-relaxed font-light px-4">
          Backend engineer crafting <span className="text-accent font-medium">scalable APIs</span>,
          <span className="text-accent-secondary font-medium"> real-time systems</span> and payment integrations.
        </p>

        <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center mb-16 px-4">
          <button
            type="button"
            className="btn-primary w-full sm:w-auto min-w-[180px] hover:shadow-[0_0_25px_rgba(0,212,255,0.4)] transition-all"
            onClick={() => scrollToSection('projects')}
          >
            View Projects
          </button>
          <button
            type="button"
            className="btn-outline w-full sm:w-auto min-w-[180px] hover:bg-accent/5 transition-all"
            onClick={() => scrollToSection('contact')}
          >
            Get in Touch
          </button>
        </div>

        <div ref={statsRef} className="flex flex-wrap justify-center gap-6">
          {[
            { icon: '📍', text: 'Karachi, PK' },
            { icon: '🎓', text: 'BSc CS' },
            { icon: '⚡', text: '3+ Years Exp' },
          ].map((item, index) => (
            <div
              key={index}
              className="glass-button px-6 py-3 rounded-xl flex items-center gap-3 border-white/10 hover:border-accent/40 transition-colors"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-text-secondary font-mono text-sm tracking-wide">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Hero
