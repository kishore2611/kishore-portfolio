import { memo } from 'react'
import { SectionLayout } from './EditorialLayout'

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

  return (
    <SectionLayout
      id="experience"
      theme="dk"
      eyebrow="05 — Experience"
      title="Professional<br/><span style='color:var(--color-accent)'>Trajectory.</span>"
      description="Crafting scalable backends and real-time systems across various industries and roles."
      sidenav={[
        { label: 'Full Time', active: true },
        { label: 'Contract' },
        { label: 'Architecture' }
      ]}
      codeCard={{
        filename: 'experience.ts',
        code: (
          <>
            <span className="key">const</span> <span className="syntax">totalExp</span> = <span className="val">'2.5+ Years'</span>;<br/>
            <span className="key">const</span> <span className="syntax">roles</span> = [<br/>
            &nbsp;&nbsp;<span className="val">'Node.js Developer'</span>,<br/>
            &nbsp;&nbsp;<span className="val">'Software Engineer'</span><br/>
            ];
          </>
        )
      }}
      bgSvg={(
        <svg width="600" height="600" viewBox="0 0 600 600">
          <g fill="none" stroke="#c8a87a" strokeWidth=".7">
            <circle cx="300" cy="300" r="280"/><circle cx="300" cy="300" r="250"/>
            <line x1="20" y1="300" x2="580" y2="300"/>
            <line x1="300" y1="20" x2="300" y2="580"/>
          </g>
        </svg>
      )}
    >
      <div className="relative pl-8 w-full max-w-2xl">
        <div className="absolute left-0 top-1.5 bottom-0 w-[1px] bg-gradient-to-b from-accent to-[#2a2830]" />
        
        <div className="space-y-16">
          {experiences.map((exp, i) => (
            <div key={i} className="relative group">
              <div className="absolute -left-[37px] top-1.5 w-[13px] h-[13px] rounded-full border border-accent bg-dark group-hover:bg-accent transition-all duration-300 shadow-[0_0_15px_rgba(200,168,122,0.6)]">
                <div className="absolute inset-0 rounded-full bg-accent opacity-20 animate-ping group-hover:opacity-40" />
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                <div>
                  <h3 className="display-font text-2xl font-bold text-white leading-none uppercase">{exp.role}</h3>
                  <span className="font-mono text-[10px] text-accent uppercase tracking-widest mt-2 block">{exp.company}</span>
                </div>
                <div className="text-right flex flex-col items-start md:items-end">
                   <span className="font-mono text-[9.5px] text-[#5e5c62] tracking-widest uppercase">{exp.period}</span>
                   <span className="font-mono text-[8.5px] text-[#3a3840] tracking-widest uppercase mt-1">{exp.location}</span>
                </div>
              </div>

              <ul className="space-y-3 mt-6">
                {exp.points.map((point, pi) => (
                  <li key={pi} className="flex gap-3 text-[12px] text-[#5e5c62] leading-relaxed font-light group-hover:text-[#a1a1aa] transition-colors">
                    <span className="text-accent mt-1">▹</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </SectionLayout>
  )
}

export default memo(Experience)