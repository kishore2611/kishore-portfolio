import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import LiquidGlass from './LiquidGlass'

const TechStack = () => {
  const [hoveredTech, setHoveredTech] = useState(null)
  const sectionRef = useRef(null)
  const categoryRefs = useRef([])
  const progressRefs = useRef([])

  const techCategories = [
    {
      title: 'Backend & APIs',
      color: 'from-blue-500 to-cyan-500',
      technologies: [
        { name: 'Node.js', icon: '🟢', level: 95, description: 'Server-side JavaScript runtime' },
        { name: 'Express.js', icon: '🚀', level: 90, description: 'Fast, unopinionated web framework' },
        { name: 'REST APIs', icon: '🔗', level: 95, description: 'RESTful API design and implementation' },
        { name: 'GraphQL', icon: '📊', level: 85, description: 'Query language for APIs' },
        { name: 'Microservices', icon: '🏗️', level: 88, description: 'Distributed system architecture' },
      ]
    },
    {
      title: 'Databases',
      color: 'from-green-500 to-emerald-500',
      technologies: [
        { name: 'MongoDB', icon: '🍃', level: 90, description: 'NoSQL document database' },
        { name: 'PostgreSQL', icon: '🐘', level: 85, description: 'Advanced open source relational database' },
        { name: 'Redis', icon: '🔴', level: 80, description: 'In-memory data structure store' },
        { name: 'MySQL', icon: '🗄️', level: 75, description: 'Popular relational database' },
      ]
    },
    {
      title: 'Cloud & DevOps',
      color: 'from-purple-500 to-pink-500',
      technologies: [
        { name: 'AWS', icon: '☁️', level: 85, description: 'Cloud computing platform' },
        { name: 'Docker', icon: '🐳', level: 90, description: 'Containerization platform' },
        { name: 'Kubernetes', icon: '⚓', level: 75, description: 'Container orchestration' },
        { name: 'CI/CD', icon: '🔄', level: 88, description: 'Continuous integration and deployment' },
        { name: 'Nginx', icon: '🌐', level: 80, description: 'Web server and reverse proxy' },
      ]
    },
    {
      title: 'Tools & Languages',
      color: 'from-orange-500 to-red-500',
      technologies: [
        { name: 'JavaScript', icon: '🟨', level: 95, description: 'Dynamic programming language' },
        { name: 'TypeScript', icon: '🔷', level: 85, description: 'Typed superset of JavaScript' },
        { name: 'Python', icon: '🐍', level: 80, description: 'High-level programming language' },
        { name: 'Git', icon: '📚', level: 90, description: 'Version control system' },
        { name: 'Linux', icon: '🐧', level: 85, description: 'Open source operating system' },
      ]
    }
  ]

  useEffect(() => {
    // Category appearance
    gsap.fromTo(categoryRefs.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        }
      }
    )

    // Progress bars
    progressRefs.current.forEach((bar, i) => {
      const targetWidth = bar.getAttribute('data-level') + '%'
      gsap.fromTo(bar,
        { width: '0%' },
        {
          width: targetWidth,
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: bar,
            start: 'top 95%',
          }
        }
      )
    })
  }, [])

  return (
    <section id="techstack" ref={sectionRef} className="py-32 bg-dark-bg/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full mb-6 border border-white/10 bg-white/5 backdrop-blur-md">
            <span className="text-white font-mono text-xs uppercase tracking-[0.2em]">09 / Tech Stack</span>
          </div>
          <h2 className="display-font text-5xl md:text-7xl font-bold text-text-primary mb-6 tracking-tighter">Comprehensive Arsenal</h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed">A deep dive into the technologies I leverage for scalable solutions.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {techCategories.map((category, categoryIndex) => (
            <div
              key={category.title}
              ref={el => categoryRefs.current[categoryIndex] = el}
              className="h-full"
            >
              <LiquidGlass className="group" cornerRadius={24}>
                <div className={`inline-block px-5 py-1.5 rounded-md bg-white/5 border border-white/10 text-white font-mono text-[10px] uppercase tracking-[0.2em] mb-10`}>
                  {category.title}
                </div>

                <div className="space-y-8">
                  {category.technologies.map((tech, techIndex) => {
                    const globalIndex = categoryIndex * 10 + techIndex
                    return (
                      <div
                        key={tech.name}
                        className="relative group"
                        onMouseEnter={() => setHoveredTech(tech.name)}
                        onMouseLeave={() => setHoveredTech(null)}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-5">
                            <span className="text-xl group-hover:scale-110 transition-transform duration-500 opacity-80">{tech.icon}</span>
                            <span className="display-font font-bold text-white group-hover:text-accent-secondary transition-colors duration-500 tracking-tight">{tech.name}</span>
                          </div>
                          <span className="text-[10px] text-text-secondary font-mono font-bold opacity-30">{tech.level}%</span>
                        </div>

                        <div className="w-full bg-white/5 rounded-full h-[3px] overflow-hidden">
                          <div
                            ref={el => progressRefs.current[globalIndex] = el}
                            data-level={tech.level}
                            className={`h-full rounded-full bg-white opacity-80 shadow-[0_0_15px_rgba(255,255,255,0.2)]`}
                            style={{ width: '0%' }}
                          />
                        </div>

                        {hoveredTech === tech.name && (
                          <div className="absolute top-[-44px] left-0 bg-white text-dark-bg px-3 py-1.5 rounded text-[9px] font-bold font-mono uppercase tracking-wider z-20 shadow-2xl pointer-events-none whitespace-nowrap">
                            {tech.description}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </LiquidGlass>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TechStack