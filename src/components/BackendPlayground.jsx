import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

const BackendPlayground = () => {
  const [activeTab, setActiveTab] = useState('api')
  const [apiEndpoint, setApiEndpoint] = useState('/api/users')
  const [method, setMethod] = useState('GET')
  const [requestBody, setRequestBody] = useState('')
  const [headers, setHeaders] = useState('Content-Type: application/json\nAuthorization: Bearer your-token')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [logs, setLogs] = useState([
    { id: 1, timestamp: new Date().toLocaleTimeString(), type: 'info', message: 'Backend Playground initialized' },
    { id: 2, timestamp: new Date().toLocaleTimeString(), type: 'success', message: 'API simulator ready' },
  ])
  const logsEndRef = useRef(null)
  const sectionRef = useRef(null)
  const containerRef = useRef(null)
  const contentRef = useRef(null)

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [logs])

  useEffect(() => {
    // Entrance
    gsap.fromTo(containerRef.current,
      { opacity: 0, scale: 0.98, y: 30 },
      { 
        opacity: 1, 
        scale: 1, 
        y: 0, 
        duration: 0.8, 
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        }
      }
    )
  }, [])

  useEffect(() => {
    // Tab transition
    gsap.fromTo(contentRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
    )
  }, [activeTab])

  const addLog = (type, message) => {
    const newLog = {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      type,
      message
    }
    setLogs(prev => [...prev, newLog])
  }

  const simulateApiCall = async () => {
    setIsLoading(true)
    addLog('info', `Making ${method} request to ${apiEndpoint}`)

    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200))

    try {
      let mockResponse = {}
      let statusCode = 200

      if (method === 'GET') {
        if (apiEndpoint.includes('/users')) {
          mockResponse = {
            users: [
              { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
              { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
            ],
            total: 2,
            page: 1,
            limit: 10
          }
        } else if (apiEndpoint.includes('/products')) {
          mockResponse = {
            products: [
              { id: 1, name: 'Laptop', price: 999.99, category: 'Electronics' },
              { id: 2, name: 'Book', price: 19.99, category: 'Education' },
            ],
            total: 2,
            page: 1,
            limit: 10
          }
        } else {
          mockResponse = { message: 'Endpoint not found', status: 404 }
          statusCode = 404
        }
      } else if (method === 'POST') {
        if (apiEndpoint.includes('/users')) {
          const newUser = JSON.parse(requestBody || '{}')
          mockResponse = { ...newUser, id: Date.now(), createdAt: new Date().toISOString() }
          statusCode = 201
        } else {
          mockResponse = { message: 'Method not allowed', status: 405 }
          statusCode = 405
        }
      } else if (method === 'PUT' || method === 'PATCH') {
        mockResponse = { message: 'Resource updated successfully', updatedAt: new Date().toISOString() }
      } else if (method === 'DELETE') {
        mockResponse = { message: 'Resource deleted successfully' }
        statusCode = 204
      }

      const responseText = JSON.stringify(mockResponse, null, 2)
      setResponse(`HTTP ${statusCode} ${getStatusText(statusCode)}\n\n${responseText}`)
      addLog('success', `Request completed with status ${statusCode}`)
    } catch (error) {
      setResponse('Error: Invalid JSON in request body')
      addLog('error', 'Request failed: Invalid JSON')
    }

    setIsLoading(false)
  }

  const getStatusText = (code) => {
    const statusTexts = {
      200: 'OK', 201: 'Created', 204: 'No Content', 400: 'Bad Request',
      401: 'Unauthorized', 404: 'Not Found', 405: 'Method Not Allowed', 500: 'Internal Server Error'
    }
    return statusTexts[code] || 'Unknown'
  }

  const clearLogs = () => {
    setLogs([])
    addLog('info', 'Logs cleared')
  }

  return (
    <section id="playground" ref={sectionRef} className="py-24 bg-dark-bg/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 glass-button rounded-full mb-4">
            <span className="text-accent font-mono text-sm uppercase tracking-widest font-bold">08 / Playground</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4 tracking-tight">API Environment</h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-lg leading-relaxed">Interactive node simulation for testing infrastructure protocols.</p>
        </div>

        <div ref={containerRef} className="glass-card rounded-3xl overflow-hidden border border-white/5 shadow-2xl bg-surface/50">
          <div className="flex border-b border-white/5 bg-white/[0.02]">
            {['api', 'logs'].map((tab) => (
              <button
                key={tab}
                className={`flex-1 px-8 py-5 font-bold text-xs uppercase tracking-widest transition-all duration-300 ${
                  activeTab === tab
                    ? 'text-accent border-b-2 border-accent bg-accent/5'
                    : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.02]'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'api' ? 'Network Simulator' : 'Terminal Output'}
              </button>
            ))}
          </div>

          <div ref={contentRef} className="p-8 lg:p-12">
            {activeTab === 'api' ? (
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12">
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-accent uppercase tracking-widest mb-3">Method</label>
                      <select
                        value={method}
                        onChange={(e) => setMethod(e.target.value)}
                        className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl font-bold text-xs focus:ring-1 focus:ring-accent outline-none appearance-none cursor-pointer"
                      >
                        <option>GET</option>
                        <option>POST</option>
                        <option>PUT</option>
                        <option>PATCH</option>
                        <option>DELETE</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-accent uppercase tracking-widest mb-3">Endpoint</label>
                      <input
                        type="text"
                        value={apiEndpoint}
                        onChange={(e) => setApiEndpoint(e.target.value)}
                        className="w-full h-12 px-5 bg-white/5 border border-white/10 rounded-xl focus:ring-1 focus:ring-accent outline-none font-mono text-sm"
                        placeholder="/api/v1/auth"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-accent uppercase tracking-widest mb-3">Request Headers</label>
                    <textarea
                      value={headers}
                      onChange={(e) => setHeaders(e.target.value)}
                      rows={3}
                      className="w-full p-5 bg-white/5 border border-white/10 rounded-xl focus:ring-1 focus:ring-accent outline-none font-mono text-xs resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-accent uppercase tracking-widest mb-3">Payload (JSON)</label>
                    <textarea
                      value={requestBody}
                      onChange={(e) => setRequestBody(e.target.value)}
                      rows={5}
                      className="w-full p-5 bg-white/5 border border-white/10 rounded-xl focus:ring-1 focus:ring-accent outline-none font-mono text-xs resize-none"
                      placeholder='{ "action": "deploy" }'
                    />
                  </div>

                  <button
                    onClick={simulateApiCall}
                    disabled={isLoading}
                    className="w-full h-14 bg-accent text-dark-bg font-bold rounded-xl hover:bg-accent-secondary transition-all duration-300 disabled:opacity-50 group overflow-hidden relative"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      {isLoading ? 'Executing Protocol...' : 'Invoke Request'}
                      {!isLoading && <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>}
                    </span>
                  </button>
                </div>

                <div className="flex flex-col">
                  <label className="block text-[10px] font-bold text-accent uppercase tracking-widest mb-3">Response Buffer</label>
                  <div className="flex-1 min-h-[400px] p-6 bg-surface-light border border-white/5 rounded-2xl font-mono text-xs overflow-auto shadow-inner relative group">
                    {!response && !isLoading && (
                      <div className="absolute inset-0 flex items-center justify-center text-white/20 uppercase tracking-widest font-bold">
                        Awaiting Invocations
                      </div>
                    )}
                    {isLoading && (
                      <div className="flex items-center gap-2 text-accent font-bold animate-pulse">
                        <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                        SYNCHRONIZING...
                      </div>
                    )}
                    <pre className="whitespace-pre-wrap text-text-primary leading-relaxed">
                      {response}
                    </pre>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-white/5 pb-6">
                  <h3 className="text-xl font-bold text-text-primary">System Runtime Logs</h3>
                  <button
                    onClick={clearLogs}
                    className="px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest border border-white/10 rounded-lg hover:border-red-500/50 hover:bg-red-500/5 transition-all duration-300"
                  >
                    FLUSH BUFFER
                  </button>
                </div>

                <div className="h-[500px] overflow-y-auto pr-4 font-mono text-[11px] space-y-3 custom-scrollbar">
                  {logs.map((log) => (
                    <div key={log.id} className="flex items-start gap-4 p-3 bg-white/[0.02] border border-white/5 rounded-xl group hover:border-accent/20 transition-colors">
                      <span className="text-text-secondary opacity-50 shrink-0 font-bold">
                        [{log.timestamp}]
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase shrink-0 ${
                        log.type === 'error' ? 'bg-red-500 text-white' :
                        log.type === 'success' ? 'bg-green-500 text-white' :
                        log.type === 'warning' ? 'bg-yellow-500 text-dark-bg' :
                        'bg-blue-500 text-white'
                      }`}>
                        {log.type}
                      </span>
                      <span className="text-text-primary opacity-80 group-hover:opacity-100 transition-opacity whitespace-pre-wrap">
                        {log.message}
                      </span>
                    </div>
                  ))}
                  <div ref={logsEndRef} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default BackendPlayground