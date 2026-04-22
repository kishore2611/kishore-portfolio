import { memo } from 'react'
import { SectionLayout } from './EditorialLayout'

const Process = () => {
  const steps = [
    {
      num: '01',
      title: 'Structural Analysis',
      desc: 'Deep diving into business logic, data flow constraints, and performance requirements before a single line is written.',
      icon: '🔍',
    },
    {
      num: '02',
      title: 'Architectural Blueprint',
      desc: 'Selecting the optimal stack, designing database schemas, and mapping out microservices vs monolithic structures.',
      icon: '🏗️',
    },
    {
      num: '03',
      title: 'Execution & Flow',
      desc: 'Developing high-performance, documented code with a focus on modularity, security, and real-time reliability.',
      icon: '⚡',
    },
    {
      num: '04',
      title: 'Scaling & Optimization',
      desc: 'Continuous monitoring, load balancing, and query optimization to ensure the system grows with the user base.',
      icon: '📈',
    }
  ]

  return (
    <SectionLayout
      id="process"
      theme="lt"
      eyebrow="03 — Workflow"
      title="The Engine<br/><span style='color:var(--color-accent)'>Room.</span>"
      description="A disciplined approach to engineering. I don't just build; I architect systems that last and scale."
      sidenav={[
        { label: 'Discovery', active: true },
        { label: 'Design' },
        { label: 'Build' },
        { label: 'Scale' }
      ]}
      codeCard={{
        filename: 'workflow.yaml',
        code: (
          <>
            <span className="key">process</span>:<br />
            &nbsp;&nbsp;<span className="key">mode</span>: <span className="val">Agile</span><br />
            &nbsp;&nbsp;<span className="key">quality</span>: <span className="val">Production-Grade</span><br />
            &nbsp;&nbsp;<span className="key">deployment</span>: <span className="val">Automated</span>
          </>
        )
      }}
      bgSvg={(
        <svg width="400" height="400" viewBox="0 0 400 400">
          <g fill="none" stroke="#2e2c30" strokeWidth=".8" opacity=".2">
             <path d="M50,200 Q200,50 350,200 Q200,350 50,200" />
             <circle cx="200" cy="200" r="100" />
             <line x1="200" y1="50" x2="200" y2="350" />
             <line x1="50" y1="200" x2="350" y2="200" />
          </g>
        </svg>
      )}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        {steps.map((step, i) => (
          <div key={i} className="group relative bg-[#ffffff] border border-black/5 p-8 rounded-2xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] transition-all duration-700 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-700" />
            <div className="flex justify-between items-start mb-6">
              <span className="font-mono text-[10px] text-accent font-bold tracking-widest">{step.num} —</span>
              <span className="text-2xl opacity-20 group-hover:opacity-100 transition-opacity duration-700 grayscale group-hover:grayscale-0">{step.icon}</span>
            </div>
            <h3 className="display-font text-xl font-bold text-dark mb-4 group-hover:text-accent transition-colors">{step.title}</h3>
            <p className="text-[12px] text-muted leading-relaxed font-light">{step.desc}</p>
            
            <div className="mt-8 flex items-center gap-2">
               <div className="h-[1px] w-8 bg-black/5 translate-x-[-10px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-700" />
               <span className="font-mono text-[8px] text-muted uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity delay-300">Phase Complete</span>
            </div>
          </div>
        ))}
      </div>
    </SectionLayout>
  )
}

export default memo(Process)
