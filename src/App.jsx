import { lazy, Suspense, useState, useEffect } from 'react'
import { motion, useScroll } from 'framer-motion'
import useCinematicScroll from './hooks/useCinematicScroll'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import Stats from './components/Stats'
import GitHubContributions from './components/GitHubContributions'
import Experience from './components/Experience'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Contact from './components/Contact'
import ParticleBackground from './components/ParticleBackground'
import AnimatedTechBackground from './components/AnimatedTechBackground'

const SystemDesign = lazy(() => import('./components/SystemDesign'))
const CodeSnippets = lazy(() => import('./components/CodeSnippets'))
const BackendPlayground = lazy(() => import('./components/BackendPlayground'))
const TechStack = lazy(() => import('./components/TechStack'))

function App() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [theme, setTheme] = useState('dark')
  const { scrollYProgress } = useScroll()

  useCinematicScroll()

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="relative min-h-screen bg-dark-bg/90 backdrop-blur-2xl overflow-x-hidden">
      {/* Particle Background */}
      <ParticleBackground />

      {/* Animated Tech Background */}
      <AnimatedTechBackground mousePosition={mousePosition} />

      {/* Navigation */}
      <Navigation theme={theme} toggleTheme={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')} />

      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section */}
        <Hero mousePosition={mousePosition} />

        {/* Stats Section */}
        <Stats />

        {/* GitHub Contributions Section */}
        <GitHubContributions />

        {/* Experience Section */}
        <Experience />

        {/* Skills Section */}
        <Skills />

        {/* Projects Section */}
        <Projects />

        {/* System Design Section */}
        <Suspense fallback={<div className="py-20"><div className="max-w-7xl mx-auto px-4 text-center text-text-secondary">Loading system visuals…</div></div>}>
          <SystemDesign />
        </Suspense>

        {/* Code Snippets Section */}
        <Suspense fallback={<div className="py-20"><div className="max-w-7xl mx-auto px-4 text-center text-text-secondary">Loading code samples…</div></div>}>
          <CodeSnippets />
        </Suspense>

        {/* Backend Playground Section */}
        <Suspense fallback={<div className="py-20"><div className="max-w-7xl mx-auto px-4 text-center text-text-secondary">Loading backend playground…</div></div>}>
          <BackendPlayground />
        </Suspense>

        {/* Tech Stack Section */}
        <Suspense fallback={<div className="py-20"><div className="max-w-7xl mx-auto px-4 text-center text-text-secondary">Loading tech stack…</div></div>}>
          <TechStack />
        </Suspense>

        {/* Contact Section */}
        <Contact />
      </main>

      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-accent z-50 origin-left"
        style={{ scaleX: scrollYProgress }}
      />
    </div>
  )
}

export default App
