import { memo, useState } from 'react'
import { SectionLayout } from './EditorialLayout'

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })

  return (
    <SectionLayout
      id="contact"
      theme="dk"
      eyebrow="05 — Contact"
      title="Initiate<br/><span style='color:var(--color-accent)'>Dialogue.</span>"
      description="Let's discuss architecture, collaboration, or infrastructure challenges. I maintain a 24-hour response cycle."
      sidenav={[
        { label: 'Hire Me', active: true },
        { label: 'Consulting' },
        { label: 'Open Source' }
      ]}
      codeCard={{
        filename: 'contact.ts',
        code: (
          <>
            <span className="key">const</span> <span className="syntax">contact</span> = {'{'}<br />
            &nbsp;&nbsp;<span className="key">email</span>: <span className="val">'kishore261100@outlook.com'</span>,<br />
            &nbsp;&nbsp;<span className="key">status</span>: <span className="val">'Available'</span>,<br />
            &nbsp;&nbsp;<span className="key">timezone</span>: <span className="val">'UTC+5'</span>,<br />
            {'}'};
          </>
        )
      }}
      bgSvg={(
        <svg width="500" height="500" viewBox="0 0 500 500">
          <g fill="none" stroke="#c8a87a" strokeWidth=".8">
            <rect x="40" y="40" width="420" height="420" rx="8" />
            <circle cx="250" cy="250" r="200" />
            <line x1="40" y1="250" x2="460" y2="250" />
            <line x1="250" y1="40" x2="250" y2="460" />
          </g>
        </svg>
      )}
    >
      <div className="w-full max-w-lg lg:ml-auto">
        <form className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted ml-1">Your Identity</label>
              <input
                className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-6 py-4 text-sm text-white focus:border-accent focus:bg-white/[0.05] outline-none transition-all placeholder:text-muted/50"
                placeholder="Full Name"
              />
            </div>
            <div className="space-y-2">
              <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted ml-1">Digital Mail</label>
              <input
                className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-6 py-4 text-sm text-white focus:border-accent focus:bg-white/[0.05] outline-none transition-all placeholder:text-muted/50"
                placeholder="email@example.com"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted ml-1">Message Buffer</label>
            <textarea
              className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-6 py-4 text-sm text-white focus:border-accent focus:bg-white/[0.05] outline-none transition-all min-h-[160px] placeholder:text-muted/50 resize-none"
              placeholder="Detail your technical requirements..."
            />
          </div>
          <button className="w-full py-5 bg-accent text-dark font-mono text-[11px] uppercase tracking-[0.25em] font-bold rounded-lg hover:bg-accent-vibrant accent-glow transition-all duration-500">
            Transmit Signal
          </button>
        </form>

        <div className="mt-8 flex flex-col gap-3">
          {[
            { icon: '📧', val: 'kishore261100@outlook.com' },
            { icon: '💼', val: 'linkedin.com/in/kishore2611' },
            { icon: '📍', val: 'Karachi, Pakistan' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-xs opacity-80">
                {item.icon}
              </div>
              <span className="font-mono text-[10.5px] text-muted">{item.val}</span>
            </div>
          ))}
        </div>
      </div>
    </SectionLayout>
  )
}

export default memo(Contact)