import { memo } from 'react'
import { SectionLayout } from './EditorialLayout'

const Testimonials = () => {
  const reviews = [
    {
      name: 'Technical Lead',
      role: 'Sixlogs Technologies',
      quote: "Kishore's ability to architect scalable solutions under tight deadlines was instrumental to our platform's success. His Node.js expertise is top-tier.",
      initial: 'L'
    },
    {
      name: 'Project Manager',
      role: 'Binate Digital',
      quote: "A rare mix of technical finesse and architectural clarity. He doesn't just code; he solves problems with future-proof designs.",
      initial: 'PM'
    }
  ]

  return (
    <SectionLayout
      id="testimonials"
      theme="dk"
      eyebrow="06 — Recognition"
      title="Peer<br/><span style='color:var(--color-accent)'>Evaluation.</span>"
      description="What industry leaders and colleagues say about my technical contribution and collaborative spirit."
      sidenav={[
        { label: 'Leadership', active: true },
        { label: 'Peers' },
        { label: 'Clients' }
      ]}
      bgSvg={(
        <svg width="400" height="400" viewBox="0 0 400 400">
           <circle cx="200" cy="200" r="180" stroke="var(--color-accent)" strokeWidth=".5" strokeDasharray="4 4" opacity=".2" />
        </svg>
      )}
    >
      <div className="flex flex-col gap-6 w-full max-w-lg">
        {reviews.map((rev, i) => (
          <div key={i} className="group relative p-10 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.04] transition-all duration-700">
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-accent text-dark flex items-center justify-center font-display font-bold text-xl rounded-full shadow-xl">
               {rev.initial}
            </div>
            
            <div className="text-3xl text-accent/20 mb-6 font-serif">"</div>
            <p className="text-lg font-light text-white/80 italic leading-relaxed mb-8 relative z-10 italic">
               {rev.quote}
            </p>
            
            <div className="pt-6 border-t border-white/5 flex items-center justify-between">
               <div>
                  <h4 className="font-display font-bold text-white uppercase text-sm tracking-tight">{rev.name}</h4>
                  <p className="font-mono text-[9px] text-muted uppercase tracking-widest mt-1">{rev.role}</p>
               </div>
               <div className="flex gap-1">
                  {[1,2,3,4,5].map(s => <span key={s} className="text-accent text-[10px]">★</span>)}
               </div>
            </div>
          </div>
        ))}
      </div>
    </SectionLayout>
  )
}

export default memo(Testimonials)
