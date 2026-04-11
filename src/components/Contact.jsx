import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import LiquidGlass from './LiquidGlass'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState({})

  const sectionRef = useRef(null)
  const leftColRef = useRef(null)
  const rightColRef = useRef(null)
  const successRef = useRef(null)
  const formRef = useRef(null)

  useEffect(() => {
    // Entrance animations
    gsap.fromTo(leftColRef.current,
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        }
      }
    )
    gsap.fromTo(rightColRef.current,
      { opacity: 0, x: 30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        delay: 0.2, // Slight stagger
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        }
      }
    )
  }, [])

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required'
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSubmitting(false)
    
    // Animation for success state
    gsap.to(formRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.4,
      onComplete: () => {
        setIsSubmitted(true)
        gsap.fromTo(successRef.current, 
          { opacity: 0, scale: 0.9, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(1.7)' }
        )
      }
    })

    // Reset after delay
    setTimeout(() => {
      gsap.to(successRef.current, {
        opacity: 0,
        duration: 0.4,
        onComplete: () => {
          setIsSubmitted(false)
          setFormData({ name: '', email: '', subject: '', message: '' })
          gsap.fromTo(formRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.4 }
          )
        }
      })
    }, 4000)
  }

  const contactInfo = [
    { icon: '📧', label: 'Email', value: 'kishore261100@outlook.com', href: 'mailto:kishore261100@outlook.com' },
    { icon: '💼', label: 'LinkedIn', value: 'linkedin.com/in/kishore2611', href: 'https://www.linkedin.com/in/kishore2611/' },
    { icon: '🐙', label: 'GitHub', value: 'github.com/kishore2611', href: 'https://github.com/kishore2611' },
    { icon: '📍', label: 'Location', value: 'Remote / Global', href: null }
  ]

  return (
    <section id="contact" ref={sectionRef} className="py-20 md:py-32 relative overflow-hidden bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-block px-4 py-2 glass-button rounded-full mb-4">
            <span className="text-accent font-mono text-xs md:text-sm uppercase tracking-widest font-bold">10 / Contact</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-text-primary mb-4 tracking-tighter transition-all">Initiate Dialogue</h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-base md:text-lg leading-relaxed">Let's discuss architecture, collaboration, or infrastructure challenges.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 md:gap-12 items-start">
          <LiquidGlass className="w-full">
            <div ref={leftColRef} className="p-8 md:p-14 relative overflow-hidden">
              <h3 className="text-2xl md:text-3xl font-black text-text-primary mb-10 tracking-tight">Direct Transmission</h3>
              
              <div className="relative min-h-[400px]">
                {!isSubmitted ? (
                  <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-[10px] font-black text-accent uppercase tracking-widest mb-4">Your Identity</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`w-full px-6 py-5 bg-white/5 border rounded-xl focus:ring-1 focus:ring-accent focus:border-accent transition-all duration-300 outline-none text-sm font-bold placeholder:opacity-20 ${errors.name ? 'border-red-500/50' : 'border-white/10'}`}
                          placeholder="Kishore Kumar"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-accent uppercase tracking-widest mb-4">Digital Mail</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full px-6 py-5 bg-white/5 border rounded-xl focus:ring-1 focus:ring-accent focus:border-accent transition-all duration-300 outline-none text-sm font-bold placeholder:opacity-20 ${errors.email ? 'border-red-500/50' : 'border-white/10'}`}
                          placeholder="engineer@domain.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-accent uppercase tracking-widest mb-4">Objective</label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className={`w-full px-6 py-5 bg-white/5 border rounded-xl focus:ring-1 focus:ring-accent focus:border-accent transition-all duration-300 outline-none text-sm font-bold placeholder:opacity-20 ${errors.subject ? 'border-red-500/50' : 'border-white/10'}`}
                        placeholder="Project architecture inquiry"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-accent uppercase tracking-widest mb-4">Message Buffer</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={5}
                        className={`w-full px-6 py-5 bg-white/5 border rounded-xl focus:ring-1 focus:ring-accent focus:border-accent transition-all duration-300 outline-none resize-none text-sm font-bold placeholder:opacity-20 ${errors.message ? 'border-red-500/50' : 'border-white/10'}`}
                        placeholder="Detail your technical requirements..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full btn-primary py-5 group relative overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        {isSubmitting ? 'Transmitting Data...' : 'Relay Protocol'}
                        {!isSubmitting && <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>}
                      </span>
                    </button>
                  </form>
                ) : (
                  <div ref={successRef} className="flex flex-col items-center justify-center h-full py-12 text-center opacity-0 px-4">
                    <div className="w-24 h-24 bg-accent/20 rounded-full flex items-center justify-center mb-10 border border-accent/50 shadow-[0_0_40px_rgba(0,212,255,0.3)]">
                      <svg className="w-12 h-12 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-3xl font-black text-text-primary mb-4 tracking-tighter">Transmission Completed</h3>
                    <p className="text-text-secondary text-lg max-w-sm font-medium">Message received. System response in T-24 hours.</p>
                  </div>
                )}
              </div>
            </div>
          </LiquidGlass>

          <div ref={rightColRef} className="space-y-6 md:space-y-8 h-full">
            <LiquidGlass cornerRadius={32} className="h-full">
              <h3 className="text-2xl font-black text-text-primary mb-8 tracking-tight">Network Nodes</h3>
              <div className="space-y-4">
                {contactInfo.map((info) => (
                  <div key={info.label} className="group flex items-center gap-6 p-5 bg-white/5 rounded-2xl hover:bg-white/10 border border-white/5 hover:border-accent/30 transition-all duration-300">
                    <div className="w-14 h-14 bg-dark-bg border border-white/10 rounded-xl flex items-center justify-center text-3xl group-hover:scale-110 group-hover:bg-accent/10 transition-all duration-300">
                      {info.icon}
                    </div>
                    <div>
                      <h4 className="text-[9px] font-black text-text-secondary uppercase tracking-[0.2em] mb-1.5 opacity-50">{info.label}</h4>
                      {info.href ? (
                        <a href={info.href} className="text-text-primary font-black hover:text-accent transition-colors text-sm break-all" target="_blank" rel="noopener noreferrer">
                          {info.value}
                        </a>
                      ) : (
                        <span className="text-text-primary font-black text-sm">{info.value}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </LiquidGlass>

            <LiquidGlass cornerRadius={24} intensity={0.5}>
              <div className="relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all duration-1000 group-hover:bg-accent/30 opacity-50" />
                <h4 className="text-white font-black text-lg mb-4 tracking-tight">Service Level Agreement</h4>
                <p className="text-text-secondary text-sm md:text-base leading-relaxed opacity-70 font-medium">
                  I maintain a 24-hour response cycle for all transmissions. For priority architectural consulting, please specify "Urgent" in the objective field.
                </p>
              </div>
            </LiquidGlass>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact