import { motion } from 'framer-motion'

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
        'Implemented robust user authentication and authorization using OAuth and JWT.',
        'Managed database operations with PostgreSQL, MySQL and MongoDB, ensuring data integrity and optimized query performance.',
        'Optimized database queries and server performance to handle high user traffic efficiently.',
      ],
    },
    {
      company: 'Binate Digital',
      period: '08/2024 – 12/2024',
      location: 'Remote · Part Time',
      role: 'Software Engineer',
      points: [
        'Developed and maintained server-side applications using Node.js and Express.js for scalable solutions.',
        'Collaborated with cross-functional teams providing technical support, debugging and troubleshooting.',
        'Contributed to code reviews ensuring adherence to best practices in code quality and documentation.',
      ],
    },
    {
      company: 'Binate Digital',
      period: '05/2022 – 08/2024',
      location: 'Karachi, Pakistan',
      role: 'Software Engineer',
      points: [
        'Developed RESTful APIs using Node.js and Express.js for reliable server-side functionality.',
        'Utilized MongoDB with Mongoose for efficient data modeling and database interaction.',
        'Designed and implemented real-time chat features with Socket.io for seamless in-app communication.',
        'Integrated Agora and 100MS for live-streaming, enhancing user engagement through interactive features.',
        'Collaborated with front-end team to integrate back-end APIs into React.js, React Native, and Flutter applications.',
      ],
    },
  ]

  return (
    <section id="experience" className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="inline-block px-4 py-2 glass-button rounded-full mb-4">
            <span className="text-accent font-mono text-sm uppercase tracking-wider">03</span>
          </div>
          <h2 className="section-title">Work Experience</h2>
          <p className="section-subtitle">Building scalable backend solutions across multiple domains</p>
        </motion.div>

        <div className="space-y-6">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              className="glass-card p-6 rounded-xl"
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <h3 className="text-xl font-bold text-text-primary mb-2">{exp.company}</h3>
                  <div className="space-y-1">
                    <p className="text-accent font-mono text-sm">{exp.period}</p>
                    <p className="text-text-secondary font-mono text-sm">{exp.location}</p>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <h4 className="text-lg font-semibold text-accent mb-4">{exp.role}</h4>
                  <ul className="space-y-3">
                    {exp.points.map((point, pointIndex) => (
                      <motion.li
                        key={pointIndex}
                        className="text-text-secondary leading-relaxed flex items-start gap-3"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: (index * 0.1) + (pointIndex * 0.1) }}
                        viewport={{ once: true }}
                      >
                        <span className="text-accent mt-1">▸</span>
                        {point}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Experience