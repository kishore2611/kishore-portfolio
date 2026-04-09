import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const GITHUB_USER = 'kishore2611'
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const startDate = (() => {
  const date = new Date()
  date.setDate(date.getDate() - 365)
  const day = date.getDay()
  date.setDate(date.getDate() - day)
  return date
})()

const getContributionDate = (weekIndex, dayIndex) => {
  const date = new Date(startDate)
  date.setDate(date.getDate() + weekIndex * 7 + dayIndex)
  return date
}

const getContributionLevel = (count) => {
  if (count === 0) return 0
  if (count < 3) return 1
  if (count < 6) return 2
  if (count < 12) return 3
  return 4
}

const parseContributionSVG = (html) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const rects = Array.from(doc.querySelectorAll('rect[data-date][data-count]'))

  return rects
    .map((rect) => ({
      date: rect.getAttribute('data-date'),
      count: Number(rect.getAttribute('data-count')),
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date))
}

const buildMonthlySummary = (contributions) => {
  const map = new Map()
  contributions.forEach(({ date, count }) => {
    const current = new Date(date)
    const key = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`
    if (!map.has(key)) {
      map.set(key, {
        key,
        label: `${MONTHS[current.getMonth()]} ${current.getFullYear()}`,
        total: 0,
        month: current.getMonth(),
        year: current.getFullYear(),
      })
    }
    map.get(key).total += count
  })
  return Array.from(map.values())
}

const GitHubContributions = () => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [contributions, setContributions] = useState([])
  const [monthlySummary, setMonthlySummary] = useState([])
  const [yearRange, setYearRange] = useState('Last 12 months')
  const [contributionsLoading, setContributionsLoading] = useState(true)
  const [contributionsError, setContributionsError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    const fetchProfile = async () => {
      try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USER}`, {
          signal: controller.signal,
        })
        if (!response.ok) {
          throw new Error('Unable to load GitHub profile')
        }
        const data = await response.json()
        setProfile(data)
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message)
        }
      } finally {
        setLoading(false)
      }
    }

    const fetchContributions = async () => {
      const githubUrl = `https://github.com/users/${GITHUB_USER}/contributions`
      const proxyUrl = import.meta.env.DEV
        ? '/github-contributions'
        : `https://api.allorigins.win/raw?url=${encodeURIComponent(githubUrl)}`

      try {
        const response = await fetch(proxyUrl, {
          signal: controller.signal,
        })
        if (!response.ok) {
          throw new Error('Unable to load GitHub contributions')
        }
        const html = await response.text()
        const parsed = parseContributionSVG(html)
        if (!parsed.length) {
          throw new Error('No contribution data found')
        }
        setContributions(parsed)
        setMonthlySummary(buildMonthlySummary(parsed))
        const start = new Date(parsed[0].date)
        const end = new Date(parsed[parsed.length - 1].date)
        setYearRange(`${start.getFullYear()} - ${end.getFullYear()}`)
      } catch (err) {
        if (err.name !== 'AbortError') {
          setContributionsError(
            err.message || 'Unable to load contributions. GitHub blocks this resource from browser requests.'
          )
        }
      } finally {
        setContributionsLoading(false)
      }
    }

    fetchProfile()
    fetchContributions()

    return () => controller.abort()
  }, [])

  return (
    <section id="github" className="py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 via-transparent to-teal-900/5 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <div className="inline-block px-4 py-2 glass-button rounded-full mb-4">
            <span className="text-accent font-mono text-sm uppercase tracking-wider">02</span>
          </div>
          <h2 className="section-title">GitHub Contributions</h2>
          <p className="section-subtitle">Track recent activity, contributions, and open-source momentum</p>
        </motion.div>

        <motion.div
          className="glass-card rounded-3xl p-8 lg:p-10 grid gap-10 lg:grid-cols-[1.2fr_1fr] items-start"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-text-secondary uppercase tracking-[0.24em] text-sm mb-2">Open Source Pulse</p>
                <h3 className="text-3xl md:text-4xl font-bold text-text-primary">{profile?.name || 'Backend Developer'}</h3>
                <p className="text-text-secondary max-w-2xl mt-3">
                  Live GitHub activity, repositories, and the contribution graph for the primary developer profile.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 justify-center sm:justify-end">
                <div className="glass-card px-4 py-3 rounded-2xl text-center">
                  <p className="text-text-secondary text-sm">Repos</p>
                  <p className="text-3xl font-semibold text-text-primary">{profile?.public_repos ?? '—'}</p>
                </div>
                <div className="glass-card px-4 py-3 rounded-2xl text-center">
                  <p className="text-text-secondary text-sm">Followers</p>
                  <p className="text-3xl font-semibold text-text-primary">{profile?.followers ?? '—'}</p>
                </div>
              </div>
            </div>

            {loading && (
              <div className="glass-card rounded-3xl border border-border p-8 text-center text-text-secondary">
                Loading GitHub profile...
              </div>
            )}

            {error && (
              <div className="glass-card rounded-3xl border border-red-500/30 bg-red-500/10 p-6 text-red-400">
                {error}
              </div>
            )}

            {profile && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="glass-card rounded-3xl p-6">
                  <h4 className="text-text-primary font-semibold mb-3">Github Summary</h4>
                  <p className="text-text-secondary leading-relaxed">
                    {profile.bio || 'Backend engineer building APIs, services, and scalable systems.'}
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-text-secondary">
                    <div className="space-y-1">
                      <p className="uppercase tracking-[0.2em]">Location</p>
                      <p className="text-text-primary">{profile.location || 'Remote'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="uppercase tracking-[0.2em]">Top language</p>
                      <p className="text-text-primary">{profile.blog ? profile.blog.replace(/^https?:\/\//, '') : 'Node.js'}</p>
                    </div>
                  </div>
                </div>

                <div className="glass-card rounded-3xl p-6 border border-border/40">
                  <h4 className="text-text-primary font-semibold mb-3">Recent Activity</h4>
                  <div className="space-y-3 text-sm text-text-secondary">
                    <p><span className="text-text-primary font-semibold">Joined:</span> {new Date(profile.created_at).toLocaleDateString()}</p>
                    <p><span className="text-text-primary font-semibold">Public Repos:</span> {profile.public_repos}</p>
                    <p><span className="text-text-primary font-semibold">Followers:</span> {profile.followers}</p>
                    <p><span className="text-text-primary font-semibold">Following:</span> {profile.following}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="relative rounded-3xl overflow-hidden border border-border/50 glass-card-solid">
            <div className="bg-gradient-to-bl from-accent/10 via-transparent to-transparent absolute inset-0 pointer-events-none" />
            <div className="p-6 border-b border-border/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent text-xl">🐙</div>
                <div>
                  <p className="text-text-primary font-semibold">GitHub Contributions</p>
                  <p className="text-text-secondary text-sm">Live contributions from GitHub</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid gap-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="text-text-secondary uppercase tracking-[0.3em] text-xs">Live GitHub activity</p>
                    <h4 className="text-text-primary font-semibold text-lg">{yearRange}</h4>
                    <p className="text-text-secondary text-sm mt-2">
                      {contributionsLoading
                        ? 'Fetching contributions from GitHub...' 
                        : `${contributions.reduce((sum, item) => sum + item.count, 0)} total contributions in the last 12 months`}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-[11px] text-text-secondary">
                    <span className="px-3 py-1 rounded-full bg-white/5">{GITHUB_USER}</span>
                    <span className="px-3 py-1 rounded-full bg-white/5">Monthly totals</span>
                  </div>
                </div>

                {contributionsError && (
                  <div className="glass-card rounded-3xl border border-red-500/30 bg-red-500/10 p-4 text-red-300 text-sm">
                    {contributionsError}
                  </div>
                )}

                {monthlySummary.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm text-text-secondary">
                    {monthlySummary.map((month) => (
                      <div key={month.key} className="rounded-3xl border border-white/10 bg-white/5 p-3">
                        <p className="text-text-primary font-semibold">{month.label}</p>
                        <p className="mt-2 text-xs text-text-secondary">{month.total} contributions</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <div className="grid grid-rows-7 gap-2 text-[10px] text-text-secondary">
                    <span className="h-4">Mon</span>
                    <span className="h-4"></span>
                    <span className="h-4">Wed</span>
                    <span className="h-4"></span>
                    <span className="h-4">Fri</span>
                    <span className="h-4"></span>
                    <span className="h-4"></span>
                  </div>

                  <div className="overflow-x-auto pb-2">
                    <div className="grid grid-flow-col auto-cols-[12px] gap-1">
                      {Array.from({ length: 53 }).map((_, weekIndex) => (
                        <div key={weekIndex} className="grid grid-rows-7 gap-1">
                          {Array.from({ length: 7 }).map((__, dayIndex) => {
                            const date = getContributionDate(weekIndex, dayIndex)
                            const isoDate = date.toISOString().slice(0, 10)
                            const dayCount = contributions.find((item) => item.date === isoDate)?.count ?? 0
                            const level = getContributionLevel(dayCount)
                            const colors = [
                              'bg-slate-900 border border-white/5',
                              'bg-teal-600/20 border border-teal-500/10',
                              'bg-teal-600/40 border border-teal-500/20',
                              'bg-teal-500/60 border border-teal-400/25',
                              'bg-cyan-400 border border-cyan-300/30',
                            ]
                            return (
                              <div
                                key={`${weekIndex}-${dayIndex}`}
                                className={`${colors[level]} w-3 h-3 rounded-sm transition-all duration-200`}
                                title={`${date.toLocaleDateString()} • ${dayCount} contributions`}
                              />
                            )
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-text-secondary">
                  <span>Less</span>
                  <span>More</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default GitHubContributions
