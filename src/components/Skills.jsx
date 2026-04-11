import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import LiquidGlass from './LiquidGlass'

const Skills = () => {
  const skillCategories = [
    {
      title: 'Backend Runtime',
      icon: '⚙️',
      skills: ['Node.js', 'Express.js', 'NestJS'],
      description: 'Building robust server-side applications with modern frameworks',
    },
    {
      title: 'Databases',
      icon: '🗄️',
      skills: ['MongoDB', 'PostgreSQL', 'MySQL', 'Redis'],
      description: 'Designing efficient data storage and retrieval systems',
    },
    {
      title: 'Payments & APIs',
      icon: '💳',
      skills: ['Stripe', 'PayPal', 'REST APIs', 'GraphQL'],
      description: 'Integrating payment systems and building scalable APIs',
    },
    {
      title: 'Real-time Systems',
      icon: '📡',
      skills: ['Socket.IO', 'WebSocket', 'Redis Pub/Sub'],
      description: 'Creating real-time communication and event-driven architectures',
    },
    {
      title: 'Live Streaming',
      icon: '🎥',
      skills: ['Agora', '100MS', 'WebRTC'],
      description: 'Implementing live video streaming and interactive features',
    },
    {
      title: 'Security & Auth',
      icon: '🔒',
      skills: ['OAuth', 'JWT', 'bcrypt', 'helmet'],
      description: 'Implementing secure authentication and authorization systems',
    },
    {
      title: 'DevOps & Tools',
      icon: '🛠️',
      skills: ['Docker', 'AWS', 'Git', 'PM2'],
      description: 'Deployment, monitoring, and development workflow optimization',
    },
    {
      title: 'Testing & Quality',
      icon: '✅',
      skills: ['Jest', 'Supertest', 'ESLint', 'Prettier'],
      description: 'Ensuring code quality and reliability through comprehensive testing',
    },
  ]

  const sectionRef = useRef(null)
  const cardsRef = useRef([])

  useEffect(() => {
    gsap.fromTo(cardsRef.current,
      { opacity: 0, scale: 0.9, y: 30 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        }
      }
    )
  }, [])

  const handleMouseEnter = (index) => {
    gsap.to(cardsRef.current[index], {
      y: -8,
      duration: 0.3,
      ease: 'power2.out'
    })
    gsap.to(cardsRef.current[index].querySelector('.skill-icon'), {
      rotationZ: 360,
      duration: 0.6,
      ease: 'power1.inOut'
    })
  }

  const handleMouseLeave = (index) => {
    gsap.to(cardsRef.current[index], {
      y: 0,
      duration: 0.3,
      ease: 'power2.in'
    })
    gsap.to(cardsRef.current[index].querySelector('.skill-icon'), {
      rotationZ: 0,
      duration: 0.5,
      ease: 'power1.inOut'
    })
  }

  return (
    <section id="skills" ref={sectionRef} className="py-20 md:py-32 bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-block px-4 py-2 glass-button rounded-full mb-4">
            <span className="text-accent font-mono text-xs md:text-sm uppercase tracking-widest font-bold">04 / Skills</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-text-primary mb-4 leading-tight">Technical Prowess</h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-base md:text-lg">Modern tech stack for building high-performance backend systems.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {skillCategories.map((category, index) => (
            <LiquidGlass
              key={index}
              className="h-full"
            >
              <div
                ref={el => cardsRef.current[index] = el}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={() => handleMouseLeave(index)}
                className="p-8 h-full transition-colors cursor-default"
              >
                <div className="skill-icon text-5xl mb-6 inline-block">
                  {category.icon}
                </div>

                <h3 className="text-xl font-black text-text-primary mb-3">
                  {category.title}
                </h3>

                <p className="text-text-secondary text-sm mb-8 leading-relaxed opacity-70">
                  {category.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="px-3 py-1 bg-accent/5 text-accent font-mono text-[9px] uppercase font-black rounded-lg border border-accent/10 whitespace-nowrap"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </LiquidGlass>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Skills