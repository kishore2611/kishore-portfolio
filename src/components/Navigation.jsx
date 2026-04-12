import { useState, useEffect, useRef, memo } from 'react'
import { gsap } from 'gsap'

const Navigation = memo(({ theme, toggleTheme }) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const lastScrollY = useRef(0)
  const toggleBtnRef = useRef(null)
  const navRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setIsScrolled(currentScrollY > 20)
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
      lastScrollY.current = currentScrollY
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (navRef.current) {
      gsap.to(navRef.current, {
        y: isVisible ? 0 : -100,
        duration: 0.4,
        ease: 'power3.out',
      })
    }
  }, [isVisible])

  useEffect(() => {
    if (toggleBtnRef.current) {
      gsap.fromTo(
        toggleBtnRef.current,
        { rotate: theme === 'dark' ? -90 : 90, opacity: 0, scale: 0.5 },
        { rotate: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' },
      )
    }
  }, [theme])

  const navItems = [
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Stack', href: '#techstack' },
    { name: 'Contact', href: '#contact' },
  ]

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-[100] transition-colors duration-500 ${
        isScrolled ? 'glass-nav py-3' : 'bg-transparent py-4 sm:py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-4 min-h-10">
          <a
            href="#home"
            className="shrink-0 text-xl sm:text-2xl font-black text-accent font-mono cursor-pointer flex items-center gap-1 group"
          >
            <span
              className={`px-1.5 rounded transition-colors ${
                theme === 'dark'
                  ? 'bg-accent text-dark-bg group-hover:bg-accent-secondary'
                  : 'bg-accent text-white group-hover:bg-accent-secondary'
              }`}
            >
              K
            </span>
            <span className="group-hover:text-accent-secondary transition-colors">K.</span>
          </a>

          {/* Always visible — mobile + desktop (compact on small screens) */}
          <div
            className="flex items-center justify-end gap-2 sm:gap-4 md:gap-8 flex-1 min-w-0 overflow-x-auto py-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="flex items-center gap-2.5 sm:gap-5 md:gap-8 shrink-0">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-text-secondary hover:text-accent font-mono font-bold uppercase tracking-wide sm:tracking-widest transition-all duration-300 whitespace-nowrap text-[10px] sm:text-xs"
                >
                  {item.name}
                </a>
              ))}
            </div>

            <div className={`hidden sm:block h-4 w-px shrink-0 ${theme === 'dark' ? 'bg-white/10' : 'bg-black/10'}`} />

            <button
              ref={toggleBtnRef}
              type="button"
              onClick={toggleTheme}
              className={`shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-colors group relative overflow-hidden ${
                theme === 'dark'
                  ? 'bg-white/5 border border-white/10 hover:bg-white/10'
                  : 'bg-black/5 border border-black/10 hover:bg-black/10'
              }`}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              <span className="relative z-10 text-lg sm:text-xl group-hover:scale-110 transition-transform">
                {theme === 'dark' ? '☀️' : '🌙'}
              </span>
              <span className="absolute inset-0 bg-accent opacity-0 group-hover:opacity-10 transition-opacity" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
})

Navigation.displayName = 'Navigation'

export default Navigation
