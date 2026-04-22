import { lazy, Suspense, useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import About from './components/About'
import { Ticker, SideLabels } from './components/EditorialLayout'
import GalaxyBackground from './components/GalaxyBackground'
import CustomCursor from './components/CustomCursor'
import Preloader from './components/Preloader'
import { uiAudio } from './utils/audio'
import { scrollEngine } from './utils/scrollEngine'
import { initMasterTimeline, updateMasterTimeline } from './animations/masterTimeline'

const Experience = lazy(() => import('./components/Experience'))
const Skills = lazy(() => import('./components/Skills'))
const GitHub = lazy(() => import('./components/GitHubContributions'))
const Projects = lazy(() => import('./components/Projects'))
const Contact = lazy(() => import('./components/Contact'))
const Stats = lazy(() => import('./components/Stats'))
const Process = lazy(() => import('./components/Process'))
const Testimonials = lazy(() => import('./components/Testimonials'))

function App() {
  const [isInitializing, setIsInitializing] = useState(true)
  const mainRef = useRef(null)

  useEffect(() => {
    const initAudio = () => {
      uiAudio.init()
      window.removeEventListener('click', initAudio)
    }
    window.addEventListener('click', initAudio)
    
    // Smooth scroll setup
    scrollEngine.onUpdate((progress) => {
      updateMasterTimeline(progress)
    })

    return () => window.removeEventListener('click', initAudio)
  }, [])

  return (
    <div className="relative bg-dark min-h-screen selection:bg-accent/30">
      <div className="noise-overlay" />
      <div className="fixed left-6 lg:left-[56px] top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/5 to-transparent z-0 pointer-events-none hidden md:block" />
      <GalaxyBackground />
      
      {isInitializing && (
        <Preloader onComplete={() => {
          setIsInitializing(false)
          initMasterTimeline()
          if (mainRef.current) {
            gsap.fromTo(mainRef.current, { opacity: 0 }, { opacity: 1, duration: 1.5 })
          }
        }} />
      )}

      <Navigation />
      
      {!isInitializing && (
        <main ref={mainRef} className="relative z-10">
          <Hero />
          
          <Suspense fallback={<div className="h-screen bg-dark" />}>
            <About />
            <Skills />
            <Process />
            <GitHub />
            <Stats />
            <Projects />
            <Experience />
            <Testimonials />
            <Contact />
          </Suspense>
        </main>
      )}

      <footer className="bg-[#1f1e22] border-t border-[#222028] py-20 px-8 lg:px-[88px] relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-10">
          <div>
            <h1 className="font-display font-[800] text-xl text-white">K<span className="text-accent">.</span>S</h1>
            <p className="font-mono text-[9.5px] text-[#333040] mt-4 uppercase tracking-widest">© 2026 Kishore Kumar. All bits reserved.</p>
            <p className="font-display text-[11px] text-[#333040] italic mt-2">"Architecting excellence, one line at a time."</p>
          </div>
          <div className="flex gap-8">
            {['LinkedIn', 'GitHub', 'Twitter'].map(link => (
              <a key={link} href="#" className="font-mono text-[9.5px] text-[#5e5c62] uppercase tracking-widest hover:text-accent transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>

      <Ticker />
      <SideLabels labels={['Backend Engineer', 'Architect', 'Node.js', 'Scaling']} />
      <CustomCursor />
    </div>
  )
}

export default App
