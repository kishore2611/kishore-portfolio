import { lazy, Suspense, useEffect, useRef } from 'react'
import { uiAudio } from '../utils/audio'
import { playHeroIntro } from '../animations/heroIntro'
import { scrollEngine } from '../utils/scrollEngine'
import { updateMasterTimeline } from '../animations/masterTimeline'
import { gsap } from 'gsap'

const HeroNetworkCanvas = lazy(() => import('./HeroNetworkCanvas'));

const Hero = () => {
  const contentRef = useRef(null)
  const buttonsRef = useRef(null)
  const statsRef = useRef(null)

  const splitText = (text) => {
    return text.split('').map((char, i) => (
      <span key={i} className="hero-char inline-block">
        {char === ' ' ? '\u00A0' : char}
      </span>
    ))
  }

  useEffect(() => {
    const tl = gsap.timeline({
      onStart: () => scrollEngine.lock(),
      onComplete: () => scrollEngine.unlock()
    })

    gsap.set('.hero-char', { opacity: 0, y: 40 })
    gsap.set(['.hero-reveal', '.hero-background'], { opacity: 0, y: 20 })

    tl.to('.hero-background', { opacity: 1, scale: 1, duration: 2, ease: 'power2.out' }, 0)
      .to('.hero-char', { opacity: 1, y: 0, duration: 1, stagger: 0.03, ease: 'power3.out' }, 0.5)
      .to('.hero-reveal', { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power3.out' }, '-=0.5')
      .to(statsRef.current, { opacity: 1, duration: 1 }, '-=0.5')

    const magneticBtns = buttonsRef.current.querySelectorAll('a, button')
    const handleMagnetic = (e) => {
      const btn = e.currentTarget
      const rect = btn.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.4, ease: 'power3.out' })
    }
    const resetMagnetic = (e) => {
      gsap.to(e.currentTarget, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.3)' })
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
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden bg-dark pt-20">
      <div className="hero-grid absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(#c8a87a 1px, transparent 1px), linear-gradient(90deg, #c8a87a 1px, transparent 1px)',
          backgroundSize: '64px 64px'
        }} />

      <div className="hero-background absolute inset-0 opacity-0 scale-110">
        <Suspense fallback={null}>
          <HeroNetworkCanvas />
        </Suspense>
      </div>

      <div ref={contentRef} className="relative z-10 text-center max-w-5xl mx-auto px-4 flex flex-col items-center">
        <p className="hero-reveal font-mono text-[11px] text-accent uppercase tracking-[0.22em] mb-4">
          Hello(); — I'm
        </p>

        <h1 className="display-font text-4xl md:text-[6rem] lg:text-[8rem] xl:text-[9rem] font-bold tracking-tighter leading-[0.88] mb-8 text-white uppercase">
          <span className="block overflow-hidden pb-4">
            {splitText("Kishore")}
          </span>
          <span className="hero-reveal block gradient-text">
            Kumar<span>.</span>
          </span>
        </h1>

        <p className="hero-reveal text-sm md:text-base text-text-secondary mb-12 max-w-lg mx-auto leading-relaxed font-light">
          Versatile Node.js Developer, Architect & ECE Engineer crafting harmonious web experiences. I blend design elegance with technical finesse.
        </p>

        <div ref={buttonsRef} className="hero-reveal flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-2 sm:px-4 w-full max-w-lg mx-auto">
          <a href="#projects" className="w-full sm:w-auto min-h-[44px] px-6 sm:px-12 py-3 sm:py-5 bg-accent text-dark font-extrabold font-mono text-sm sm:text-[11px] uppercase tracking-[0.25em] rounded-[2px] hover:bg-accent-vibrant accent-glow transition-all duration-500 text-center shadow-[0_0_30px_rgba(200,168,122,0.2)] flex items-center justify-center">
            View Work
          </a>
          <a href="#contact" className="w-full sm:w-auto min-h-[44px] px-6 sm:px-12 py-3 sm:py-5 bg-transparent border border-white/10 text-white font-extrabold font-mono text-sm sm:text-[11px] uppercase tracking-[0.25em] rounded-[2px] hover:border-accent hover:text-accent transition-all duration-500 text-center backdrop-blur-sm flex items-center justify-center">
            Let's Talk
          </a>
        </div>
      </div>

      <div ref={statsRef} className="absolute bottom-12 right-12 hidden md:flex gap-12 opacity-0">
        {[
          { num: '3+', label: 'Projects' },
          { num: '4', label: 'Internships' },
          { num: '12+', label: 'Skills' },
        ].map((stat, i) => (
          <div key={i} className="flex flex-col items-end group">
            <span className="display-font text-4xl font-bold text-white leading-none group-hover:text-accent transition-colors duration-500">{stat.num}</span>
            <span className="font-mono text-[9px] text-muted uppercase tracking-widest mt-2">{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 hero-reveal hidden md:flex flex-col items-center gap-4">
        <span className="font-mono text-[9px] text-muted uppercase tracking-[0.2em]">Explore</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-accent to-transparent origin-top animate-bounce" />
      </div>
    </section>
  )
}

export default Hero

