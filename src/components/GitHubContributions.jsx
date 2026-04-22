import { memo, useEffect, useState } from 'react'
import { SectionLayout } from './EditorialLayout'

const GITHUB_USER = 'kishore2611'

const GitHubContributions = () => {
  const [profile, setProfile] = useState(null)
  const [contributions, setContributions] = useState([])

  useEffect(() => {
    fetch(`https://api.github.com/users/${GITHUB_USER}`).then(r => r.json()).then(setProfile)
    fetch(`https://github-contributions-api.deno.dev/${GITHUB_USER}.json`)
      .then(r => r.json())
      .then(data => setContributions(data.contributions.flat()))
  }, [])

  return (
    <SectionLayout
      id="github"
      theme="dk"
      eyebrow="03 — GitHub Pulse"
      title="Open Source<br/><span style='color:var(--color-accent2)'>Momentum.</span>"
      description="Live coding activity and repository insights. Bridging the gap between theory and production code."
      sidenav={[
        { label: 'Activity', active: true },
        { label: 'Repositories' },
        { label: 'OSS Momentum' }
      ]}
      codeCard={{
        filename: 'github.json',
        code: (
          <>
            {'{'}<br/>
            &nbsp;&nbsp;<span className="key">"exp"</span>: <span className="val">"3 Years"</span>,<br/>
            &nbsp;&nbsp;<span className="key">"repos"</span>: <span className="val">{profile?.public_repos || 0}</span>,<br/>
            &nbsp;&nbsp;<span className="key">"status"</span>: <span className="val">"active"</span><br/>
            {'}'}
          </>
        )
      }}
      bgSvg={(
        <svg width="500" height="500" viewBox="0 0 500 500">
          <g fill="none" stroke="#2a2830" strokeWidth=".5">
            <rect x="50" y="50" width="400" height="400" rx="4"/>
            <line x1="50" y1="150" x2="450" y2="150"/>
            <line x1="50" y1="250" x2="450" y2="250"/>
          </g>
        </svg>
      )}
    >
      <div className="w-full bg-[#1c1b20] border border-[#252330] rounded-xl p-8 lg:p-10">
        <div className="flex items-center gap-6 mb-10">
          <div className="w-16 h-16 rounded-full border-2 border-accent/20 overflow-hidden bg-dark">
            <img src={profile?.avatar_url || `https://github.com/${GITHUB_USER}.png`} alt="GitHub" className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="display-font text-2xl font-bold text-white leading-none uppercase">{profile?.name || 'Kishore'}</h3>
            <span className="font-mono text-[9px] text-accent uppercase tracking-widest mt-2 block">@{GITHUB_USER}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="bg-white/5 border border-white/5 px-6 py-5 rounded-lg">
            <span className="font-mono text-[8px] text-muted uppercase tracking-widest block mb-1">Repositories</span>
            <span className="display-font text-3xl font-bold text-white">{profile?.public_repos || '—'}</span>
          </div>
          <div className="bg-white/5 border border-white/5 px-6 py-5 rounded-lg">
            <span className="font-mono text-[8px] text-muted uppercase tracking-widest block mb-1">Followers</span>
            <span className="display-font text-3xl font-bold text-white">{profile?.followers || '—'}</span>
          </div>
        </div>

        {/* Contribution Graph (Much more robust) */}
        <div className="bg-black/20 border border-white/5 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <span className="font-mono text-[9px] text-muted uppercase tracking-widest">Yearly Contribution Pipeline</span>
            <div className="flex gap-1.5 items-center">
              <span className="font-mono text-[8px] text-[#333139] uppercase mr-2">Less</span>
              {[0, 1, 2, 3, 4].map(l => (
                  <div key={l} className={`w-2 h-2 rounded-[1px] ${['bg-[#1a191e]', 'bg-[#2d2d35]', 'bg-[#3d3d45]', 'bg-[#c8a87a]/40', 'bg-[#c8a87a]'][l]}`} />
              ))}
              <span className="font-mono text-[8px] text-[#333139] uppercase ml-2">More</span>
            </div>
          </div>
          
          <div className="overflow-x-auto pb-2 custom-scrollbar">
            <div className="flex gap-[3px] min-w-[500px]">
               {Array.from({ length: 53 }).map((_, weekI) => (
                 <div key={weekI} className="grid grid-rows-7 gap-[3px]">
                    {Array.from({ length: 7 }).map((_, dayI) => {
                      const contribution = contributions[weekI * 7 + dayI];
                      const level = contribution?.contributionLevel || 'NONE';
                      const colors = {
                        'NONE': 'bg-[#1a191e]',
                        'FIRST_QUARTILE': 'bg-[#2d2d35]',
                        'SECOND_QUARTILE': 'bg-[#3d3d45]',
                        'THIRD_QUARTILE': 'bg-[#c8a87a]/60',
                        'FOURTH_QUARTILE': 'bg-[#c8a87a]'
                      };
                      return <div key={dayI} className={`w-[10px] h-[10px] rounded-[1px] ${colors[level] || colors['NONE']}`} />;
                    })}
                 </div>
               ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-8">
          <span className="font-mono text-[8px] text-muted uppercase tracking-widest">36 Months / Full-Stack Velocity</span>
          <a href={`https://github.com/${GITHUB_USER}`} target="_blank" className="font-mono text-[8px] text-accent uppercase tracking-widest hover:opacity-70 transition-opacity">Explore Profile →</a>
        </div>
      </div>
    </SectionLayout>
  )
}

export default memo(GitHubContributions)
