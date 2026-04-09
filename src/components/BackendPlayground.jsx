import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'

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

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [logs])

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

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

    try {
      // Mock responses based on endpoint and method
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
          mockResponse = {
            ...newUser,
            id: Date.now(),
            createdAt: new Date().toISOString()
          }
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
      200: 'OK',
      201: 'Created',
      204: 'No Content',
      400: 'Bad Request',
      401: 'Unauthorized',
      404: 'Not Found',
      405: 'Method Not Allowed',
      500: 'Internal Server Error'
    }
    return statusTexts[code] || 'Unknown'
  }

  const clearLogs = () => {
    setLogs([])
    addLog('info', 'Logs cleared')
  }

  return (
    <section id="playground" className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="inline-block px-4 py-2 glass-button rounded-full mb-4">
            <span className="text-accent font-mono text-sm uppercase tracking-wider">08</span>
          </div>
          <h2 className="section-title">Backend Playground</h2>
          <p className="section-subtitle">Interactive API testing and backend simulation environment</p>
        </motion.div>

        <motion.div
          className="glass-card rounded-xl overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {/* Tabs */}
          <div className="border-b border-border">
            <div className="flex">
              {['api', 'logs'].map((tab) => (
                <button
                  key={tab}
                  className={`px-6 py-4 font-medium transition-colors capitalize ${
                    activeTab === tab
                      ? 'text-accent border-b-2 border-accent bg-accent/5'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === 'api' ? 'API Tester' : 'Console Logs'}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === 'api' && (
                <motion.div
                  key="api"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Request Configuration */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">Method</label>
                      <select
                        value={method}
                        onChange={(e) => setMethod(e.target.value)}
                        className="w-full px-3 py-2 glass-input border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                      >
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="PATCH">PATCH</option>
                        <option value="DELETE">DELETE</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-text-primary mb-2">Endpoint</label>
                      <input
                        type="text"
                        value={apiEndpoint}
                        onChange={(e) => setApiEndpoint(e.target.value)}
                        placeholder="/api/endpoint"
                        className="w-full px-3 py-2 glass-input border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Headers */}
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Headers</label>
                    <textarea
                      value={headers}
                      onChange={(e) => setHeaders(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 glass-input border border-border rounded-lg font-mono text-sm focus:ring-2 focus:ring-accent focus:border-transparent"
                      placeholder="Content-Type: application/json"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Request Body (JSON)</label>
                    <textarea
                      value={requestBody}
                      onChange={(e) => setRequestBody(e.target.value)}
                      rows={6}
                      className="w-full px-3 py-2 glass-input border border-border rounded-lg font-mono text-sm focus:ring-2 focus:ring-accent focus:border-transparent"
                      placeholder='{"name": "John Doe", "email": "john@example.com"}'
                    />
                  </div>

                  {/* Send Button */}
                  <div className="flex justify-between items-center">
                    <button
                      onClick={simulateApiCall}
                      disabled={isLoading}
                      className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Sending...
                        </>
                      ) : (
                        'Send Request'
                      )}
                    </button>
                  </div>

                  {/* Response */}
                  {response && (
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">Response</label>
                      <pre className="w-full px-4 py-3 glass-card border border-border rounded-lg font-mono text-sm overflow-x-auto whitespace-pre-wrap">
                        {response}
                      </pre>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'logs' && (
                <motion.div
                  key="logs"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-text-primary">Console Logs</h3>
                    <button
                      onClick={clearLogs}
                      className="px-4 py-2 text-sm glass-button rounded-lg hover:bg-accent hover:text-white transition-colors"
                    >
                      Clear Logs
                    </button>
                  </div>

                  <div className="glass-card border border-border rounded-lg h-96 overflow-y-auto p-4 space-y-2">
                    {logs.map((log) => (
                      <div key={log.id} className="flex items-start gap-3 text-sm">
                        <span className="text-text-secondary font-mono text-xs whitespace-nowrap">
                          {log.timestamp}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          log.type === 'error' ? 'bg-red-500/20 text-red-400' :
                          log.type === 'success' ? 'bg-green-500/20 text-green-400' :
                          log.type === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {log.type.toUpperCase()}
                        </span>
                        <span className="text-text-primary font-mono">{log.message}</span>
                      </div>
                    ))}
                    <div ref={logsEndRef} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default BackendPlayground