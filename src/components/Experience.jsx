import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import LiquidGlass from './LiquidGlass'

gsap.registerPlugin(ScrollTrigger)

const Experience = () => {
  const experiences = [
    {
      company: 'Sixlogs Technologies',
      period: '08/2024 – Present',
      location: 'Karachi, Pakistan',
      role: 'Node.js Developer',
      points: [
        'Developed and maintained scalable back-end systems using Node.js, including RESTful APIs and WebSocket services.',
        'Integrated third-party services and payment gateways (Stripe, PayPal) to streamline business operations.',
        'Implemented robust user authentication and authorization (OAuth, JWT).',
        'Managed database operations with PostgreSQL, MySQL and MongoDB.',
        'Optimized database queries and server performance for high traffic.',
      ],
    },
    {
      company: 'Binate Digital',
      period: '08/2024 – 12/2024',
      location: 'Remote · Part Time',
      role: 'Software Engineer',
      points: [
        'Developed server-side applications using Node.js and Express.js.',
        'Collaborated with cross-functional teams for technical support and troubleshooting.',
        'Contributed to code reviews and technical documentation.',
      ],
    },
    {
      company: 'Binate Digital',
      period: '05/2022 – 08/2024',
      location: 'Karachi, Pakistan',
      role: 'Software Engineer',
      points: [
        'Developed RESTful APIs using Node.js and Express.js.',
        'Utilized MongoDB with Mongoose for efficient data modeling.',
        'Designed real-time chat features with Socket.io.',
        'Integrated Agora and 100MS for live-streaming features.',
        'Integrated back-end APIs into React.js, React Native, and Flutter applications.',
      ],
    },
  ]

  const sectionRef = useRef(null)
  const cardsRef = useRef([])

  useEffect(() => {
    const cards = cardsRef.current

    gsap.fromTo(cards,
      { opacity: 0, y: 50, scale: 0.98 },
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

  return (
    <section id="experience" ref={sectionRef} className="py-20 md:py-32 bg-dark-bg/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-block px-4 py-2 glass-button rounded-full mb-4">
            <span className="text-accent font-mono text-xs md:text-sm uppercase tracking-widest font-bold">03 / Experience</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-text-primary mb-4 leading-tight tracking-tighter">Professional Journey</h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-base md:text-lg leading-relaxed">Building production-grade systems across diverse industries.</p>
        </div>

        <div className="grid gap-6 md:gap-10">
          {experiences.map((exp, index) => (
            <LiquidGlass
              key={index}
              className="w-full"
            >
              <div
                ref={el => cardsRef.current[index] = el}
                className="p-8 md:p-12 transition-all duration-300 group"
              >
                <div className="grid lg:grid-cols-[1fr_2fr] gap-10">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-black text-text-primary group-hover:text-accent transition-colors leading-none tracking-tight">{exp.company}</h3>
                      <p className="text-accent-secondary font-mono text-sm mt-3 font-bold uppercase tracking-widest">{exp.role}</p>
                    </div>
                    <div className="space-y-3">
                      <p className="flex items-center gap-3 text-text-secondary font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] font-black">
                        <span className="w-6 h-[1px] bg-accent"></span>
                        {exp.period}
                      </p>
                      <p className="text-text-secondary font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] opacity-50 font-black">
                        {exp.location}
                      </p>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-5 top-0 bottom-0 w-[1px] bg-white/10 hidden lg:block" />
                    <ul className="space-y-6">
                      {exp.points.map((point, pointIndex) => (
                        <li
                          key={pointIndex}
                          className="text-text-secondary leading-relaxed flex items-start gap-4 text-sm md:text-base font-medium"
                        >
                          <span className="w-2 h-2 rounded-full bg-accent mt-2 shrink-0 shadow-[0_0_10px_#00d4ff]"></span>
                          <span className="opacity-80 group-hover:opacity-100 transition-opacity">{point}</span>
                        </li>
                      ))}
                    </ul>
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

export default Experience