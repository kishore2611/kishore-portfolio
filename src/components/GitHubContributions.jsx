import { useEffect, useState, useRef } from 'react'
import { gsap } from 'gsap'
import LiquidGlass from './LiquidGlass'

const GITHUB_USER = 'kishore2611'

const GitHubContributions = () => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [contributions, setContributions] = useState([])
  const [monthlySummary, setMonthlySummary] = useState([])
  const [yearRange, setYearRange] = useState('Last 12 months')
  const [contributionsLoading, setContributionsLoading] = useState(true)
  const [contributionsError, setContributionsError] = useState(null)
  
  const sectionRef = useRef(null)
  const headerRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USER}`)
        if (!response.ok) throw new Error('Profile not found')
        const data = await response.json()
        setProfile(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    const fetchContributions = async () => {
      try {
        const response = await fetch(`https://github-contributions-api.deno.dev/${GITHUB_USER}.json`)
        if (!response.ok) throw new Error('Data fetch failed')
        const data = await response.json()
        
        // Transform the data to the format we need (flattening the weeks array)
        const allDays = data.contributions.flat()
        
        const levelMap = {
          'NONE': 0,
          'FIRST_QUARTILE': 1,
          'SECOND_QUARTILE': 2,
          'THIRD_QUARTILE': 3,
          'FOURTH_QUARTILE': 4
        }

        const parsed = allDays.map(day => ({
          date: day.date,
          count: day.contributionCount,
          level: levelMap[day.contributionLevel] ?? 0
        }))

        setContributions(parsed)
        
        // Build monthly summary
        const months = {}
        parsed.slice(-365).forEach(day => {
          const d = new Date(day.date)
          const key = `${d.getFullYear()}-${d.getMonth() + 1}`
          if (!months[key]) {
            months[key] = { label: `${d.toLocaleString('default', { month: 'short' })} ${d.getFullYear()}`, total: 0 }
          }
          months[key].total += day.count
        })
        setMonthlySummary(Object.values(months).slice(-6))

        const start = new Date(parsed[0].date)
        const end = new Date(parsed[parsed.length - 1].date)
        setYearRange(`${start.getFullYear()} - ${end.getFullYear()}`)
      } catch (err) {
        setContributionsError("Unable to fetch graph data")
      } finally {
        setContributionsLoading(false)
      }
    }

    fetchProfile()
    fetchContributions()
  }, [])

  useEffect(() => {
    if (!loading && !contributionsLoading) {
      gsap.fromTo(headerRef.current, 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } }
      )
      gsap.fromTo(contentRef.current, 
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.2, scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' } }
      )
    }
  }, [loading, contributionsLoading])

  return (
    <section id="github" ref={sectionRef} className="py-24 relative overflow-hidden bg-dark-bg">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="text-center mb-16 opacity-0">
          <div className="inline-block px-4 py-2 glass-button rounded-full mb-4">
            <span className="text-accent font-mono text-sm uppercase tracking-widest font-bold">02 / GitHub Pulse</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">Open Source Momentum</h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-lg">Live coding activity and repository insights</p>
        </div>

        <div ref={contentRef} className="opacity-0">
          <LiquidGlass cornerRadius={40}>
            <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] items-start">
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                  <div>
                    <p className="text-accent uppercase tracking-[0.2em] text-xs font-bold mb-2">Primary Profile</p>
                    <h3 className="text-3xl md:text-4xl font-bold text-text-primary">{profile?.name || 'Kishore Kumar'}</h3>
                    <p className="text-text-secondary mt-4 leading-relaxed italic">
                      "{profile?.bio || 'Full-stack engineer building scalable Node.js architectures.'}"
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl text-center min-w-[100px]">
                      <p className="text-text-secondary text-xs uppercase mb-1">Repos</p>
                      <p className="text-3xl font-bold text-accent">{profile?.public_repos ?? '—'}</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl text-center min-w-[100px]">
                      <p className="text-text-secondary text-xs uppercase mb-1">Followers</p>
                      <p className="text-3xl font-bold text-accent-secondary">{profile?.followers ?? '—'}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-accent/30 transition-colors">
                    <h4 className="text-text-primary font-bold mb-4 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                      Quick Stats
                    </h4>
                    <div className="space-y-3 text-sm text-text-secondary font-mono">
                      <p className="flex justify-between"><span>Joined:</span> <span className="text-text-primary">{profile ? new Date(profile.created_at).getFullYear() : '—'}</span></p>
                      <p className="flex justify-between"><span>Location:</span> <span className="text-text-primary">{profile?.location || 'Pakistan'}</span></p>
                      <p className="flex justify-between"><span>Gists:</span> <span className="text-text-primary">{profile?.public_gists || 0}</span></p>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-accent-secondary/30 transition-colors">
                    <h4 className="text-text-primary font-bold mb-4 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-accent-secondary rounded-full"></span>
                      Monthly Activity
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {monthlySummary.slice(-2).map((m, i) => (
                        <div key={i} className="text-center">
                          <p className="text-[10px] text-text-secondary uppercase">{m.label}</p>
                          <p className="text-xl font-bold text-text-primary">{m.total}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/20 p-6 lg:p-8">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-accent text-[10px] uppercase font-bold tracking-widest">Live Graph</p>
                    <h4 className="text-text-primary font-bold text-xl">{yearRange}</h4>
                  </div>
                  <div className="text-right">
                    <p className="text-text-secondary text-[10px] uppercase tracking-widest">Total</p>
                    <p className="text-xl font-bold text-accent-secondary">
                      {contributions.reduce((s, c) => s + c.count, 0)}
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar pb-4">
                  <div className="flex gap-1.5">
                    {Array.from({ length: 52 }).map((_, weekIndex) => (
                      <div key={weekIndex} className="grid grid-rows-7 gap-1.5">
                        {contributions.slice(weekIndex * 7, weekIndex * 7 + 7).map((day, dayIndex) => {
                          const colors = [
                            'bg-slate-800/40',
                            'bg-teal-900/40',
                            'bg-teal-700/60',
                            'bg-teal-500/80',
                            'bg-cyan-400'
                          ]
                          return (
                            <div
                              key={`${weekIndex}-${dayIndex}`}
                              className={`w-[11px] h-[11px] rounded-[2px] ${colors[day.level]} transition-all hover:scale-150 cursor-pointer`}
                              title={`${day.date}: ${day.count} contributions`}
                            />
                          )
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between text-[10px] text-text-secondary font-mono tracking-widest uppercase">
                  <span>Less</span>
                  <div className="flex gap-1">
                    {[0, 1, 2, 3, 4].map(l => (
                      <div key={l} className={`w-2 h-2 rounded-sm ${['bg-slate-800/40', 'bg-teal-900/40', 'bg-teal-700/60', 'bg-teal-500/80', 'bg-cyan-400'][l]}`} />
                    ))}
                  </div>
                  <span>More</span>
                </div>
              </div>
            </div>
          </LiquidGlass>
        </div>
      </div>
    </section>
  )
}

export default GitHubContributions
