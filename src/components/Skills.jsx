import { memo, useState } from 'react'
import { SectionLayout } from './EditorialLayout'
import { Skills3D } from './section3d'

const Skills = () => {
  const [activeTab, setActiveTab] = useState('technical')

  const skillTabs = {
    technical: [
      { name: 'Node.js', icon: '🟢' },
      { name: 'Express', icon: '🚀' },
      { name: 'NestJS', icon: '⚛️' },
      { name: 'MongoDB', icon: '🍃' },
      { name: 'Postgres', icon: '🐘' },
      { name: 'Redis', icon: '🔴' },
      { name: 'REST APIs', icon: '🔗' },
      { name: 'GraphQL', icon: '📊' },
    ],
    tools: [
      { name: 'Docker', icon: '🐳' },
      { name: 'AWS', icon: '☁️' },
      { name: 'Git', icon: '🐙' },
      { name: 'Jest', icon: '✅' },
      { name: 'PM2', icon: '🛠️' },
      { name: 'VS Code', icon: '💻' },
    ],
    design: [
      { name: 'System Design', icon: '🏗️' },
      { name: 'Dist. Systems', icon: '🔄' },
      { name: 'Microservices', icon: '🌩️' },
      { name: 'Security', icon: '🔒' },
    ]
  }

  return (
    <SectionLayout
      id="skills"
      theme="dk"
      eyebrow="02 — Skills"
      title="Beyond<br/><span style='color:var(--color-accent)'>Classroom.</span>"
      description="From low-level server logic to modern scalable architectures — a full spectrum of technical and creative skills refined through real projects."
      sidenav={[
        { label: 'Technical', active: activeTab === 'technical' },
        { label: 'Tools', active: activeTab === 'tools' },
        { label: 'Architecture', active: activeTab === 'design' }
      ]}
      codeCard={{
        filename: 'skills.ts',
        code: (
          <>
            <span className="key">const</span> <span className="syntax">skills</span> = {'{'}<br/>
            &nbsp;&nbsp;<span className="key">backend</span>: [<span className="val">'Node'</span>,<span className="val">'Nest'</span>],<br/>
            &nbsp;&nbsp;<span className="key">db</span>:      [<span className="val">'Postgres'</span>,<span className="val">'Redis'</span>],<br/>
            &nbsp;&nbsp;<span className="key">cloud</span>:   [<span className="val">'AWS'</span>,<span className="val">'Docker'</span>],<br/>
            &nbsp;&nbsp;<span className="key">scalable</span>: <span className="key">true</span>,<br/>
            {'}'};
          </>
        )
      }}
      bg3d={Skills3D}
      bgSvg={(
        <svg width="580" height="580" viewBox="0 0 580 580">
          <g fill="none" stroke="#c8a87a" strokeWidth=".7">
            <rect x="50" y="50" width="480" height="480" rx="6"/>
            <rect x="90" y="90" width="400" height="400" rx="5"/>
            <rect x="130" y="130" width="320" height="320" rx="4"/>
            <circle cx="290" cy="290" r="220"/>
            <line x1="50" y1="290" x2="530" y2="290"/>
            <line x1="290" y1="50" x2="290" y2="530"/>
          </g>
        </svg>
      )}
    >
      <div className="w-full flex flex-col gap-6">
        <div className="flex gap-2">
          {Object.keys(skillTabs).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 font-mono text-[9px] uppercase tracking-widest rounded border transition-all duration-300 ${
                activeTab === tab 
                  ? 'bg-white text-dark border-white' 
                  : 'bg-transparent text-muted border-[#c6bfb2]'
              }`}
            >
              {tab === 'design' ? 'Architecture' : tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {skillTabs[activeTab].map((skill, i) => (
            <div 
              key={i} 
              onMouseMove={(e) => {
                const card = e.currentTarget;
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
              }}
              className="relative bg-dark-soft/40 border border-white/5 rounded-2xl p-8 flex flex-col items-center gap-4 hover:border-accent/30 transition-all duration-500 group overflow-hidden"
              style={{
                background: 'radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(200, 168, 122, 0.08), transparent 40%)'
              }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                   style={{ background: 'radial-gradient(120px circle at var(--mouse-x) var(--mouse-y), rgba(200, 168, 122, 0.15), transparent 80%)' }} />
              <span className="text-4xl filter grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-110">{skill.icon}</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted text-center group-hover:text-white transition-colors">
                {skill.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </SectionLayout>
  )
}

export default memo(Skills)