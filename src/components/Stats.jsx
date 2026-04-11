import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import LiquidGlass from './LiquidGlass'

const Stats = () => {
  const stats = [
    { number: 3, label: 'Years Experience', suffix: '+' },
    { number: 12, label: 'Projects Shipped', suffix: '+' },
    { number: 25, label: 'APIs Built', suffix: '+' },
    { number: 5, label: 'Companies Worked', suffix: '+' },
  ]

  const sectionRef = useRef(null)
  const cardsRef = useRef([])
  const numbersRef = useRef([])

  useEffect(() => {
    // Entrance animation
    gsap.fromTo(cardsRef.current,
      { opacity: 0, y: 30, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
        }
      }
    )

    // Counter animation
    stats.forEach((stat, index) => {
      const obj = { value: 0 }
      gsap.to(obj, {
        value: stat.number,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
        onUpdate: () => {
          if (numbersRef.current[index]) {
            numbersRef.current[index].innerText = Math.floor(obj.value)
          }
        }
      })
    })
  }, [])

  return (
    <section ref={sectionRef} className="py-20 md:py-32 bg-dark-bg/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              ref={el => cardsRef.current[index] = el}
              className="h-full"
            >
              <LiquidGlass className="text-center group" cornerRadius={32}>
                <div className="text-5xl md:text-6xl font-bold text-accent mb-4 tabular-nums">
                  <span ref={el => numbersRef.current[index] = el}>0</span>
                  {stat.suffix}
                </div>
                <div className="text-text-secondary font-mono text-xs uppercase tracking-[0.2em] font-bold opacity-70 group-hover:opacity-100 transition-opacity">
                  {stat.label}
                </div>
                <div className="w-10 h-[1px] bg-accent/30 mx-auto mt-6 group-hover:w-20 transition-all duration-500" />
              </LiquidGlass>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Stats