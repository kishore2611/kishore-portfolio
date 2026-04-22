import { memo } from 'react'
import { SectionLayout } from './EditorialLayout'

const Projects = () => {
  const projects = [
    {
      title: 'Social App Backend',
      type: 'Social Platform',
      color: 'var(--color-accent)',
      description: 'Full-featured social app with real-time one-to-one and group chat, 24-hour expiring stories, live streaming with 100MS, and exclusive paid groups via Stripe.',
      technologies: ['Node.js', 'Socket.IO', '100MS', 'MongoDB', 'Stripe', 'Express.js'],
      metrics: ['10k+ concurrent users', '99.9% uptime'],
      links: [{ label: 'GitHub ↗', url: '#' }, { label: 'Case Study ↗', url: '#' }]
    },
    {
      title: 'E-Commerce Platform',
      type: 'E-commerce',
      color: 'var(--color-accent2)',
      description: 'E-commerce platform with third-party product listing APIs, real-time order tracking, live rider-user chat via Socket.io, wallet system for users, and merchant payouts via Stripe.',
      technologies: ['Node.js', 'Socket.IO', 'Stripe', 'MongoDB', 'Express.js', 'Redis'],
      metrics: ['50k+ products', '100k+ orders'],
      links: [{ label: 'GitHub ↗', url: '#' }, { label: 'Live ↗', url: '#' }]
    },
    {
      title: 'Ride Booking System',
      type: 'Mobility',
      color: 'var(--color-accent3)',
      description: 'Uber-like ride booking app with driver and user roles, real-time location updates via Socket.io, wallet system for users, and merchant payouts for drivers via Stripe.',
      technologies: ['Node.js', 'Socket.IO', 'Stripe', 'PostgreSQL', 'Express.js', 'Redis'],
      metrics: ['1M+ rides booked', 'Real-time GPS'],
      links: [{ label: 'GitHub ↗', url: '#' }, { label: 'Architecture ↗', url: '#' }]
    },
  ]

  return (
    <SectionLayout
      id="projects"
      theme="lt"
      eyebrow="04 — Projects"
      title="Scalable<br/><span style='color:var(--color-accent2)'>Architectures.</span>"
      description="Production-grade systems optimized for high throughput and reliability. Focused on real-time features and secure payment flows."
      sidenav={[
        { label: 'Social', active: true },
        { label: 'E-Commerce' },
        { label: 'Mobility' }
      ]}
      codeCard={{
        filename: 'projects.js',
        code: (
          <>
            <span className="key">const</span> <span className="syntax">stats</span> = {'{'}<br/>
            &nbsp;&nbsp;<span className="key">rides</span>: <span className="val">'1M+'</span>,<br/>
            &nbsp;&nbsp;<span className="key">orders</span>: <span className="val">'100k+'</span>,<br/>
            &nbsp;&nbsp;<span className="key">uptime</span>: <span className="val">'99.9%'</span><br/>
            {'}'};
          </>
        )
      }}
      bgSvg={(
        <svg width="560" height="560" viewBox="0 0 560 560">
          <g fill="none" stroke="#2e2c30" strokeWidth=".8">
            <circle cx="280" cy="280" r="260"/><circle cx="280" cy="280" r="220"/>
            <line x1="20" y1="280" x2="540" y2="280"/>
            <line x1="280" y1="20" x2="280" y2="540"/>
          </g>
        </svg>
      )}
    >
      <div className="flex flex-col gap-6 w-full max-w-2xl">
        {projects.map((proj, i) => (
          <div 
            key={i}
            onMouseMove={(e) => {
              const card = e.currentTarget;
              const rect = card.getBoundingClientRect();
              const x = (e.clientX - rect.left) / rect.width - 0.5;
              const y = (e.clientY - rect.top) / rect.height - 0.5;
              card.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-8px)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0)';
            }}
            className="bg-dark2/40 glass-card p-10 hover:border-accent/30 transition-all duration-300 ease-out group"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="font-mono text-[9px] uppercase tracking-widest block mb-2" style={{ color: proj.color }}>
                  {proj.type}
                </span>
                <h3 className="display-font text-3xl font-bold text-white leading-none uppercase">{proj.title}</h3>
              </div>
              <div className="flex gap-4">
                {proj.metrics.map((m, mi) => (
                  <div key={mi} className="text-right">
                    <span className="font-mono text-[8px] text-[#3a3840] uppercase block">{m.split(' ')[1]}</span>
                    <span className="font-display font-bold text-white text-xs">{m.split(' ')[0]}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-[#5e5c62] text-[13px] font-light leading-relaxed mb-8">{proj.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-8">
              {proj.technologies.map((tech, ti) => (
                <span key={ti} className="px-3 py-1 bg-white/5 border border-white/5 text-[#5e5c62] font-mono text-[9px] uppercase tracking-widest rounded transition-colors group-hover:border-white/10">
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex gap-6 pt-6 border-t border-[#252330]">
              {proj.links.map((link, li) => (
                <a 
                  key={li} 
                  href={link.url} 
                  className="font-mono text-[9px] uppercase tracking-widest text-[#5e5c62] hover:text-accent transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SectionLayout>
  )
}

export default memo(Projects)