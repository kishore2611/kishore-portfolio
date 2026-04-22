import { useState, useEffect, useRef, memo } from 'react'

const Navigation = memo(() => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Experience', href: '#experience' },
    { name: 'Contact', href: '#contact' },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-400 px-6 lg:px-[56px] py-[18px] lg:py-[22px] flex items-center justify-between ${isScrolled || isMobileMenuOpen ? 'bg-dark/95 backdrop-blur-xl border-b border-[#2a2830]' : 'bg-transparent'
        }`}
    >
      <a href="#" className="font-display font-[800] text-[17px] text-white tracking-tight uppercase z-[110]">
        K<span className="text-accent">.</span>S
      </a>

      {/* Desktop Links */}
      <ul className="hidden lg:flex items-center gap-[36px]">
        {navItems.map((item) => (
          <li key={item.name}>
            <a
              href={item.href}
              className="font-mono text-[10px] font-medium text-[#5e5c62] uppercase tracking-[0.1em] hover:text-accent transition-colors"
            >
              {item.name}
            </a>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-4 z-[110]">
        <a
          href="mailto:kishore261100@outlook.com"
          className="hidden sm:block font-mono text-[10px] uppercase tracking-[0.1em] text-dark bg-accent px-5 py-2.5 rounded-[3px] hover:opacity-80 transition-opacity"
        >
          Hire Me
        </a>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 focus:outline-none"
        >
          <div className={`w-6 h-[1.5px] bg-white transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
          <div className={`w-6 h-[1.5px] bg-white transition-all ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
          <div className={`w-6 h-[1.5px] bg-white transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-dark/98 z-[105] flex flex-col items-center justify-center transition-all duration-500 lg:hidden ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}>
        <ul className="flex flex-col items-center gap-8">
          {navItems.map((item, i) => (
            <li 
              key={item.name}
              className={`transition-all duration-700 delay-[${i * 100}ms] ${isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
              <a
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-display text-5xl font-bold text-white uppercase tracking-tighter hover:text-accent transition-colors"
              >
                {item.name}
              </a>
            </li>
          ))}
          <li className={`mt-8 transition-all duration-700 delay-[500ms] ${isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <a
              href="mailto:kishore261100@outlook.com"
              className="font-mono text-xs uppercase tracking-widest text-dark bg-accent px-10 py-5 rounded-[3px] font-bold"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Start Project
            </a>
          </li>
        </ul>
      </div>
    </nav>
  )
})

Navigation.displayName = 'Navigation'

export default Navigation
