import { memo } from 'react'
import { SectionLayout } from './EditorialLayout'
import { About3D } from './section3d'

const About = () => {
  return (
    <SectionLayout
      id="about"
      theme="lt"
      eyebrow="01 — About Me"
      title="Evolving<br/><span style='color:#7fb5c8'>Always.</span>"
      description="A creative maverick shaping the future of digital experiences. Bridging ECE hardware roots with modern backend craft."
      sidenav={[
        { label: 'System Design', active: true },
        { label: 'Architecture' },
        { label: 'Performance' },
        { label: 'IoT' }
      ]}
      codeCard={{
        filename: 'kishore.js',
        code: (
          <>
            <span className="key">const</span> <span className="syntax">kishore</span> = {'{'}<br/>
            &nbsp;&nbsp;<span className="key">role</span>: <span className="val">'Backend Dev'</span>,<br/>
            &nbsp;&nbsp;<span className="key">loc</span>: <span className="val">'Karachi, PK'</span>,<br/>
            &nbsp;&nbsp;<span className="key">edu</span>: <span className="val">'B.E. Node.js'</span>,<br/>
            &nbsp;&nbsp;<span className="key">open</span>: <span className="key">true</span>,<br/>
            {'}'};
          </>
        )
      }}
      bg3d={About3D}
      bgSvg={(
        <svg width="520" height="520" viewBox="0 0 520 520">
          <g fill="none" stroke="#2e2c30" strokeWidth=".8">
            <circle cx="260" cy="260" r="240"/><circle cx="260" cy="260" r="200"/>
            <circle cx="260" cy="260" r="160"/><circle cx="260" cy="260" r="120"/>
            <circle cx="260" cy="260" r="80"/> <circle cx="260" cy="260" r="40"/>
            <line x1="20" y1="260" x2="500" y2="260"/>
            <line x1="260" y1="20" x2="260" y2="500"/>
            <line x1="90" y1="90" x2="430" y2="430"/>
            <line x1="430" y1="90" x2="90" y2="430"/>
          </g>
        </svg>
      )}
    >
      <div className="bg-white glass-card !border-white/20 p-12 max-w-lg w-full shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-1000">
           <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
             <path d="M20 7h-7L10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm0 11H4V6h5.17l2 2H20v10z"/>
           </svg>
        </div>
        
        <div className="space-y-8 relative z-10">
          {[
            { k: 'Identity', v: 'Kishore Kumar', icon: '👤' },
            { k: 'HQ', v: 'Karachi, Pakistan', icon: '📍' },
            { k: 'Dialect', v: 'English · Urdu · Sindhi', icon: '🌐' },
            { k: 'Vocation', v: 'Backend Architect', icon: '💻' },
          ].map((item, i) => (
            <div key={i} className="flex justify-between items-end border-b border-black/5 pb-4 group/item">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[9px] text-muted uppercase tracking-[0.2em]">{item.k}</span>
                <span className="text-base font-semibold text-dark tracking-tight">{item.v}</span>
              </div>
              <span className="text-lg opacity-20 group-hover/item:opacity-100 transition-opacity duration-500">{item.icon}</span>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          {['Node.js', 'System Design', 'Redis', 'AWS', 'Secure APIs'].map(tag => (
            <span key={tag} className="font-mono text-[9px] uppercase tracking-widest px-4 py-2 bg-dark text-white rounded-full hover:bg-accent transition-colors cursor-default">
              {tag}
            </span>
          ))}
        </div>
        
        <div className="mt-12 pt-8 border-t border-black/5 flex justify-between items-center">
          <div className="font-display italic text-2xl text-dark opacity-80 select-none cursor-default hover:text-accent transition-colors duration-500" style={{ fontFamily: 'Syne, cursive' }}>
            Kishore Kumar
          </div>
          <span className="font-mono text-[8px] text-muted uppercase tracking-widest">Est. 2024</span>
        </div>
      </div>
    </SectionLayout>
  )
}

export default memo(About)
