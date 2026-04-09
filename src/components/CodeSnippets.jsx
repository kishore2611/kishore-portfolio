import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'

const CodeSnippets = () => {
  const [activeSnippet, setActiveSnippet] = useState(0)
  const [typedText, setTypedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const typedCache = useRef({})
  const typingInterval = useRef(null)

  const snippets = [
    {
      title: 'JWT Authentication Middleware',
      language: 'javascript',
      code: `const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Access denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = authenticateToken;`,
      description: 'Secure JWT authentication middleware with database verification',
    },
    {
      title: 'Real-time Chat with Socket.IO',
      language: 'javascript',
      code: `const io = require('socket.io')(server, {
  cors: { origin: process.env.CLIENT_URL }
});

const users = new Map();

io.on('connection', (socket) => {
  console.log(\`User connected: \${socket.id}\`);

  socket.on('join-room', ({ roomId, userId }) => {
    socket.join(roomId);
    users.set(socket.id, { userId, roomId });

    socket.to(roomId).emit('user-joined', {
      userId,
      message: 'joined the chat'
    });
  });

  socket.on('send-message', (data) => {
    socket.to(data.roomId).emit('receive-message', {
      ...data,
      timestamp: new Date()
    });
  });

  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    if (user) {
      socket.to(user.roomId).emit('user-left', {
        userId: user.userId
      });
      users.delete(socket.id);
    }
  });
});`,
      description: 'Scalable real-time chat implementation with room management',
    },
    {
      title: 'Stripe Payment Integration',
      language: 'javascript',
      code: `const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');

const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = 'usd', orderId } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency,
      metadata: { orderId },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Update order with payment intent
    await Order.findByIdAndUpdate(orderId, {
      paymentIntentId: paymentIntent.id,
      status: 'payment_pending'
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Payment creation failed:', error);
    res.status(500).json({ error: 'Payment creation failed' });
  }
};

const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(\`Webhook Error: \${err.message}\`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    await Order.findOneAndUpdate(
      { paymentIntentId: paymentIntent.id },
      { status: 'paid', paidAt: new Date() }
    );
  }

  res.json({ received: true });
};`,
      description: 'Complete Stripe payment processing with webhook handling',
    },
  ]

  useEffect(() => {
    if (typedCache.current[activeSnippet]) {
      setTypedText(typedCache.current[activeSnippet])
      setIsTyping(false)
      return
    }

    setIsTyping(true)
    setTypedText('')

    const currentCode = snippets[activeSnippet].code
    let index = 0

    if (typingInterval.current) {
      clearInterval(typingInterval.current)
    }

    typingInterval.current = setInterval(() => {
      index += 1
      setTypedText(currentCode.slice(0, index))

      if (index >= currentCode.length) {
        clearInterval(typingInterval.current)
        typingInterval.current = null
        typedCache.current[activeSnippet] = currentCode
        setIsTyping(false)
      }
    }, 12)

    return () => {
      if (typingInterval.current) {
        clearInterval(typingInterval.current)
        typingInterval.current = null
      }
    }
  }, [activeSnippet])

  return (
    <section id="code" className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="inline-block px-4 py-2 glass-button rounded-full mb-4">
            <span className="text-accent font-mono text-sm uppercase tracking-wider">07</span>
          </div>
          <h2 className="section-title">Code Snippets</h2>
          <p className="section-subtitle">Production-ready backend code patterns and implementations</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Snippet Navigation */}
          <div className="lg:col-span-1 space-y-4">
            {snippets.map((snippet, index) => (
              <motion.button
                key={index}
                className={`w-full text-left p-4 glass-card glass-interactive rounded-xl transition-all duration-300 ${
                  activeSnippet === index ? 'ring-2 ring-accent bg-accent/10' : ''
                }`}
                onClick={() => setActiveSnippet(index)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h3 className="font-semibold text-text-primary mb-2">{snippet.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{snippet.description}</p>
              </motion.button>
            ))}
          </div>

          {/* Code Display */}
          <div className="lg:col-span-3">
            <motion.div
              className="glass-card rounded-xl overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Terminal Header */}
              <div className="glass-card px-4 py-3 flex items-center gap-2 border-b border-border">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="text-text-secondary font-mono text-sm ml-4">
                  ~/projects/backend/{snippets[activeSnippet].title.toLowerCase().replace(/\s+/g, '-')}
                </div>
                <div className="ml-auto flex gap-2">
                  <button className="text-text-secondary hover:text-accent text-sm px-2 py-1 rounded">
                    Copy
                  </button>
                </div>
              </div>

              {/* Code Content */}
              <div className="relative">
                <SyntaxHighlighter
                  language={snippets[activeSnippet].language}
                  style={tomorrow}
                  customStyle={{
                    margin: 0,
                    padding: '1.5rem',
                    background: 'transparent',
                    fontSize: '0.875rem',
                    lineHeight: '1.5',
                  }}
                  showLineNumbers={true}
                  wrapLines={true}
                >
                  {isTyping ? typedText : snippets[activeSnippet].code}
                </SyntaxHighlighter>

                {isTyping && (
                  <motion.div
                    className="absolute bottom-4 right-4 w-2 h-4 bg-accent"
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
                  />
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CodeSnippets