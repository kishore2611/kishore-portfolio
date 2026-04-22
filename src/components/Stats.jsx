import { memo, useEffect, useRef } from 'react'
import { SectionLayout } from './EditorialLayout'
import { gsap } from 'gsap'

const Stats = () => {
  const stats = [
    { num: 3, label: 'Projects', sub: 'Production Ready' },
    { num: 4, label: 'Internships', sub: 'Industry Experience' },
    { num: 12, label: 'Skills', sub: 'Core Competencies' },
    { num: 100, label: 'APIs', sub: 'Scalable Endpoints', suffix: '%' }
  ]

  const numbersRef = useRef([])

  useEffect(() => {
    stats.forEach((stat, i) => {
      const obj = { val: 0 }
      gsap.to(obj, {
        val: stat.num,
        duration: 2,
        scrollTrigger: {
          trigger: '#stats',
          start: 'top 80%'
        },
        onUpdate: () => {
          if (numbersRef.current[i]) {
            numbersRef.current[i].innerText = Math.floor(obj.val)
          }
        }
      })
    })
  }, [])

  return (
    <SectionLayout
      id="stats"
      theme="lt"
      eyebrow="04 — Statistics"
      title="Quantified<br/><span style='color:var(--color-accent)'>Excellence.</span>"
      description="Metrics that define the scale and reliability of my architectural decisions."
      sidenav={[
        { label: 'Metrics', active: true },
        { label: 'KPIs' }
      ]}
      codeCard={{
        filename: 'metrics.log',
        code: (
          <>
            [UPTIME]: <span className="val">99.9%</span><br/>
            [LATENCY]: <span className="val">&lt;40ms</span><br/>
            [STATUS]: <span className="key">STABLE</span>
          </>
        )
      }}
      bgSvg={(
        <svg width="400" height="400" viewBox="0 0 400 400">
          <g fill="none" stroke="#2a2830" strokeWidth=".4">
            <line x1="0" y1="200" x2="400" y2="200"/>
            <line x1="200" y1="0" x2="200" y2="400"/>
            <rect x="100" y="100" width="200" height="200"/>
          </g>
        </svg>
      )}
    >
      <div className="grid grid-cols-2 gap-4 w-full max-w-xl">
        {stats.map((stat, i) => (
          <div key={i} className="bg-dark/5 border border-dark/10 rounded-xl p-8 flex flex-col items-center">
            <div className="display-font text-5xl md:text-7xl font-bold text-dark leading-none">
              <span ref={el => numbersRef.current[i] = el}>0</span>
              <span className="text-accent">{stat.suffix || '+'}</span>
            </div>
            <span className="font-mono text-[9px] text-[#5e5c62] uppercase tracking-widest mt-6 text-center">{stat.label}</span>
          </div>
        ))}
      </div>
    </SectionLayout>
  )
}

export default memo(Stats)