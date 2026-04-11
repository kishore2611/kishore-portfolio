import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import LiquidGlass from './LiquidGlass'

const Projects = () => {
  const [expandedProject, setExpandedProject] = useState(null)
  const sectionRef = useRef(null)
  const cardsRef = useRef([])
  const detailsRef = useRef([])

  const projects = [
    {
      title: 'Social App Backend',
      type: 'Social Platform',
      description: 'Full-featured social app with real-time one-to-one and group chat, 24-hour expiring stories, live streaming with 100MS, and exclusive paid groups via Stripe.',
      technologies: ['Node.js', 'Socket.IO', '100MS', 'MongoDB', 'Stripe', 'Express.js'],
      architecture: {
        components: ['API Gateway', 'Chat Service', 'Payment Service', 'Media Service', 'Notification Service'],
        database: 'MongoDB with sharding',
        caching: 'Redis for sessions and real-time data',
        deployment: 'Docker containers on AWS ECS',
      },
      challenges: ['Real-time synchronization', 'Scalable chat architecture', 'Payment security'],
      metrics: ['10k+ concurrent users', '99.9% uptime', 'Sub-second response times'],
    },
    {
      title: 'E-Commerce Platform',
      type: 'E-commerce',
      description: 'E-commerce platform with third-party product listing APIs, real-time order tracking, live rider-user chat via Socket.io, wallet system for users, and merchant payouts via Stripe.',
      technologies: ['Node.js', 'Socket.IO', 'Stripe', 'MongoDB', 'Express.js', 'Redis'],
      architecture: {
        components: ['Product API', 'Order Management', 'Payment Processing', 'Real-time Tracking', 'Wallet System'],
        database: 'MongoDB with read replicas',
        caching: 'Redis for product cache and sessions',
        deployment: 'Kubernetes on AWS EKS',
      },
      challenges: ['Complex order workflows', 'Real-time location tracking', 'Multi-party payments'],
      metrics: ['50k+ products', '100k+ orders processed', 'Real-time delivery tracking'],
    },
    {
      title: 'Ride Booking System',
      type: 'Mobility',
      description: 'Uber-like ride booking app with driver and user roles, real-time location updates via Socket.io, wallet system for users, and merchant payouts for drivers via Stripe.',
      technologies: ['Node.js', 'Socket.IO', 'Stripe', 'PostgreSQL', 'Express.js', 'Redis'],
      architecture: {
        components: ['Booking Engine', 'Location Service', 'Payment Gateway', 'Driver Matching', 'Route Optimization'],
        database: 'PostgreSQL with PostGIS',
        caching: 'Redis for real-time locations',
        deployment: 'Microservices on AWS Lambda',
      },
      challenges: ['Real-time driver matching', 'Location-based queries', 'Concurrent booking handling'],
      metrics: ['1M+ rides booked', 'Real-time GPS tracking', '99.5% successful matches'],
    },
  ]

  useEffect(() => {
    gsap.fromTo(cardsRef.current,
      { opacity: 0, y: 50, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        }
      }
    )
  }, [])

  useEffect(() => {
    projects.forEach((_, index) => {
      const el = detailsRef.current[index]
      if (expandedProject === index) {
        gsap.to(el, {
          height: 'auto',
          opacity: 1,
          duration: 0.5,
          ease: 'power3.out',
          overwrite: true
        })
      } else {
        gsap.to(el, {
          height: 0,
          opacity: 0,
          duration: 0.4,
          ease: 'power3.in',
          overwrite: true
        })
      }
    })
  }, [expandedProject])

  const toggleProject = (index) => {
    setExpandedProject(expandedProject === index ? null : index)
  }

  return (
    <section id="projects" ref={sectionRef} className="py-24 bg-dark-bg/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-block px-4 py-2 glass-button rounded-full mb-4">
            <span className="text-accent font-mono text-xs md:text-sm uppercase tracking-widest font-bold">05 / Projects</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-text-primary mb-4 tracking-tighter">Backend Architecture</h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-base md:text-lg leading-relaxed">Production-grade systems optimized for high throughput and reliability.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <LiquidGlass
              key={index}
              className="h-full"
            >
              <div
                ref={el => cardsRef.current[index] = el}
                onClick={() => toggleProject(index)}
                className={`p-10 h-full flex flex-col items-start cursor-pointer transition-all duration-300
                  ${expandedProject === index ? 'shadow-2xl bg-white/[0.04]' : 'hover:bg-white/[0.02]'}`}
              >
                <div className="flex justify-between items-center w-full mb-8">
                  <span className="px-3 py-1 bg-accent text-dark-bg font-black font-mono text-[9px] uppercase rounded border border-accent/20 tracking-tighter">
                    {project.type}
                  </span>
                  <div className={`transition-transform duration-500 ${expandedProject === index ? 'rotate-180' : ''}`}>
                    <span className="text-accent text-[10px]">▼</span>
                  </div>
                </div>

                <h3 className="text-2xl font-black text-text-primary mb-4 tracking-tight leading-none">
                  {project.title}
                </h3>

                <p className="text-text-secondary mb-8 leading-relaxed text-sm opacity-80">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-8 mt-auto">
                  {project.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-3 py-1 bg-white/5 text-text-secondary font-mono text-[9px] uppercase font-bold rounded border border-white/10"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div
                  ref={el => detailsRef.current[index] = el}
                  className="overflow-hidden opacity-0 h-0 w-full"
                >
                  <div className="pt-8 mt-4 border-t border-white/5 space-y-10">
                    <div>
                      <h4 className="text-accent font-black text-[10px] uppercase tracking-widest mb-6 underline underline-offset-8">System Components</h4>
                      <div className="grid grid-cols-1 gap-4">
                        {project.architecture.components.map((comp, i) => (
                          <div key={i} className="flex items-center gap-4 text-xs font-bold text-text-secondary group">
                            <span className="w-1.5 h-1.5 bg-accent rounded-full shadow-[0_0_10px_#00d4ff]"></span>
                            <span className="group-hover:text-text-primary transition-colors">{comp}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-8">
                      <div>
                        <h4 className="text-accent-secondary font-black text-[10px] uppercase tracking-widest mb-4">Architecture Info</h4>
                        <div className="space-y-3 text-[11px] font-bold text-text-secondary font-mono opacity-60">
                          <p className="flex justify-between"><span>DB:</span> <span className="text-text-primary">{project.architecture.database}</span></p>
                          <p className="flex justify-between"><span>Cache:</span> <span className="text-text-primary">{project.architecture.caching}</span></p>
                          <p className="flex justify-between"><span>Infra:</span> <span className="text-text-primary">{project.architecture.deployment}</span></p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-white font-black text-[10px] uppercase tracking-widest mb-4">Success Metrics</h4>
                        <div className="grid grid-cols-1 gap-3">
                          {project.metrics.map((metric, i) => (
                            <div key={i} className="text-[11px] font-bold text-text-secondary flex items-center gap-3 bg-white/[0.02] p-3 rounded-lg border border-white/5">
                              <span className="text-accent">⚡</span>
                              {metric}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </LiquidGlass>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Projects