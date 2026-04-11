import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const Navigation = ({ theme, toggleTheme }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const menuRef = useRef(null)
  const menuItemsRef = useRef([])
  const toggleBtnRef = useRef(null)
  const navRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Scrolled state for glass effect
      setIsScrolled(currentScrollY > 20)

      // Visibility state (hide on scroll down, show on scroll up)
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false) // Scrolling down
      } else {
        setIsVisible(true) // Scrolling up or at top
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  useEffect(() => {
    if (navRef.current) {
      gsap.to(navRef.current, {
        y: isVisible ? 0 : -100,
        duration: 0.4,
        ease: 'power3.out'
      })
    }
  }, [isVisible])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      gsap.fromTo(menuRef.current,
        { opacity: 0, scale: 1.05 },
        { opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out' }
      )
      gsap.fromTo(menuItemsRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: 'power3.out', delay: 0.1 }
      )
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  useEffect(() => {
    if (toggleBtnRef.current) {
      gsap.fromTo(toggleBtnRef.current, 
        { rotate: theme === 'dark' ? -90 : 90, opacity: 0, scale: 0.5 },
        { rotate: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }
      )
    }
  }, [theme])

  const navItems = [
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Stack', href: '#stack' },
    { name: 'Contact', href: '#contact' },
  ]

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-[100] transition-colors duration-500 ${
          isScrolled ? 'glass-nav py-3' : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-10">
            <a
              href="#home"
              className="text-2xl font-black text-accent font-mono cursor-pointer flex items-center gap-1 group"
            >
              <span className={`px-1.5 rounded transition-colors ${
                theme === 'dark' ? 'bg-accent text-dark-bg group-hover:bg-accent-secondary' : 'bg-accent text-white group-hover:bg-accent-secondary'
              }`}>K</span>
              <span className="group-hover:text-accent-secondary transition-colors">K.</span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-10">
              <div className="flex items-center gap-8">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-text-secondary hover:text-accent font-mono text-xs font-bold uppercase tracking-widest transition-all duration-300"
                  >
                    {item.name}
                  </a>
                ))}
              </div>

              <div className={`h-4 w-px ${theme === 'dark' ? 'bg-white/10' : 'bg-black/10'}`} />

              <button
                ref={toggleBtnRef}
                onClick={toggleTheme}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors group relative overflow-hidden ${
                  theme === 'dark' ? 'bg-white/5 border border-white/10 hover:bg-white/10' : 'bg-black/5 border border-black/10 hover:bg-black/10'
                }`}
                title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                <div className="relative z-10 text-xl group-hover:scale-110 transition-transform">
                  {theme === 'dark' ? '☀️' : '🌙'}
                </div>
                <div className="absolute inset-0 bg-accent opacity-0 group-hover:opacity-10 transition-opacity" />
              </button>
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center gap-4 md:hidden">
              <button
                onClick={toggleTheme}
                className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-black/5 border border-black/10'
                }`}
              >
                <span className="text-sm">{theme === 'dark' ? '☀️' : '🌙'}</span>
              </button>

              <button
                className="relative z-[110] w-9 h-9 flex flex-col justify-center items-center gap-1.5 focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
              >
                <span className={`w-6 h-0.5 bg-accent block transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`w-6 h-0.5 bg-accent block transition-all duration-300 ${isOpen ? 'opacity-0' : 'opacity-1'}`} />
                <span className={`w-6 h-0.5 bg-accent block transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        ref={menuRef}
        className={`fixed inset-0 z-[90] md:hidden bg-dark-bg/95 backdrop-blur-xl flex items-center justify-center transition-opacity duration-300 ${
          isOpen ? 'pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center gap-8 p-8">
          {navItems.map((item, index) => (
            <a
              key={item.name}
              href={item.href}
              ref={el => menuItemsRef.current[index] = el}
              className="text-3xl font-black text-text-primary hover:text-accent font-mono uppercase tracking-tighter"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </a>
          ))}
          <div className="w-12 h-0.5 bg-white/10 mt-4" />
          <button
            className="btn-outline w-full mt-4"
            onClick={() => setIsOpen(false)}
          >
            Close Menu
          </button>
        </div>
      </div>
    </>
  )
}

export default Navigation