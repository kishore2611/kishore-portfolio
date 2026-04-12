import { lazy, Suspense, useState, useEffect, useRef, useCallback, memo } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import useCinematicScroll from './hooks/useCinematicScroll'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import GalaxyBackground from './components/GalaxyBackground'
import AnimatedTechBackground from './components/AnimatedTechBackground'
import ScrollToTop from './components/ScrollToTop'
import CustomCursor from './components/CustomCursor'
import SystemDesign from './components/SystemDesign'
import { uiAudio } from './utils/audio'

gsap.registerPlugin(ScrollTrigger)

const Stats = lazy(() => import('./components/Stats'))
const GitHubContributions = lazy(() => import('./components/GitHubContributions'))
const Experience = lazy(() => import('./components/Experience'))
const Skills = lazy(() => import('./components/Skills'))
const Projects = lazy(() => import('./components/Projects'))
const CodeSnippets = lazy(() => import('./components/CodeSnippets'))
const BackendPlayground = lazy(() => import('./components/BackendPlayground'))
const TechStack = lazy(() => import('./components/TechStack'))
const Contact = lazy(() => import('./components/Contact'))

const SectionSkeleton = memo(({ label = 'Loading' }) => (
  <section className="py-24 bg-dark-bg min-h-[32vh]" style={{ contentVisibility: 'auto' }}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center mb-16 gap-4">
        <div className="h-6 w-36 rounded-full bg-white/5 animate-pulse" />
        <div className="h-10 w-72 rounded-xl bg-white/5 animate-pulse" />
        <div className="h-4 w-96 max-w-full rounded-lg bg-white/5 animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl border border-white/5 p-8 space-y-4">
            <div className="h-6 w-3/4 rounded-lg bg-white/5 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
            <div className="h-4 w-full rounded-lg bg-white/5 animate-pulse" style={{ animationDelay: `${i * 0.15}s` }} />
            <div className="h-4 w-5/6 rounded-lg bg-white/5 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
            <div className="flex gap-2 mt-4">
              {[1, 2, 3].map((j) => (
                <div key={j} className="h-5 w-16 rounded-md bg-white/5 animate-pulse" />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-2 mt-10 text-white/20 font-mono text-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
        {label}
      </div>
    </div>
  </section>
))
SectionSkeleton.displayName = 'SectionSkeleton'

function App() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [theme, setTheme] = useState('dark')
  const [isInitializing, setIsInitializing] = useState(true)
  const progressBarRef = useRef(null)
  const mainRef = useRef(null)
  const mouseTick = useRef(0)

  useCinematicScroll()

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    const initAudio = () => {
      uiAudio.init()
      window.removeEventListener('click', initAudio)
    }
    window.addEventListener('click', initAudio, { once: true })

    const handleMouseMove = (e) => {
      const now = performance.now()
      if (now - mouseTick.current < 33) return
      mouseTick.current = now
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      })
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    const timer = setTimeout(() => {
      setIsInitializing(false)
      if (mainRef.current) {
        gsap.fromTo(
          mainRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 1.0, ease: 'power4.out' },
        )
      }
    }, 700)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    const bar = progressBarRef.current
    if (!bar) return
    gsap.to(bar, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.2,
      },
    })
  }, [])

  const handleToggleTheme = useCallback(() => {
    uiAudio.playClick()
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  }, [])

  return (
    <div className="relative min-h-screen bg-dark-bg overflow-x-hidden">
      {isInitializing && (
        <div
          className="fixed inset-0 z-[9999] bg-dark-bg flex items-center justify-center font-mono"
          style={{ contain: 'layout paint' }}
        >
          <div className="space-y-4 text-center">
            <div className="text-accent text-xl animate-pulse tracking-widest uppercase">
              System Initializing...
            </div>
            <div className="h-1 w-48 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-accent animate-[loading_0.8s_ease-in-out_infinite]" />
            </div>
          </div>
        </div>
      )}

      <CustomCursor />

      <GalaxyBackground />

      <AnimatedTechBackground mousePosition={mousePosition} />

      <Navigation theme={theme} toggleTheme={handleToggleTheme} />

      <main ref={mainRef} className="relative z-10 opacity-0">
        <Hero />

        <Suspense fallback={<SectionSkeleton label="Loading section..." />}>
          <Stats />
        </Suspense>

        <Suspense fallback={<SectionSkeleton label="Loading GitHub..." />}>
          <GitHubContributions />
        </Suspense>

        <Suspense fallback={<SectionSkeleton label="Loading experience..." />}>
          <Experience />
        </Suspense>

        <Suspense fallback={<SectionSkeleton label="Loading skills..." />}>
          <Skills />
        </Suspense>

        <Suspense fallback={<SectionSkeleton label="Loading projects..." />}>
          <Projects />
        </Suspense>

        <SystemDesign />

        <Suspense fallback={<SectionSkeleton label="Loading code editor..." />}>
          <CodeSnippets />
        </Suspense>

        <Suspense fallback={<SectionSkeleton label="Loading backend playground..." />}>
          <BackendPlayground />
        </Suspense>

        <Suspense fallback={<SectionSkeleton label="Loading tech stack..." />}>
          <TechStack />
        </Suspense>

        <Suspense fallback={<SectionSkeleton label="Loading contact..." />}>
          <Contact />
        </Suspense>
      </main>

      <div
        ref={progressBarRef}
        className="fixed top-0 left-0 right-0 h-[2px] bg-accent z-[200] origin-left scale-x-0"
        style={{ contain: 'layout paint', willChange: 'transform' }}
      />

      <ScrollToTop />
    </div>
  )
}

export default App
