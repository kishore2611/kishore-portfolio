import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'

const CodeSnippets = () => {
  const [activeSnippet, setActiveSnippet] = useState(0)
  const [typedText, setTypedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const typedCache = useRef({})
  const typingInterval = useRef(null)

  const sectionRef = useRef(null)
  const navRef = useRef(null)
  const displayRef = useRef(null)
  const cursorRef = useRef(null)

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
    // Entrance
    gsap.fromTo(navRef.current, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.8, scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } })
    gsap.fromTo(displayRef.current, { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.8, delay: 0.2, scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } })
  }, [])

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

  useEffect(() => {
    if (isTyping && cursorRef.current) {
      gsap.to(cursorRef.current, { opacity: 0, duration: 0.5, repeat: -1, yoyo: true, ease: 'power2.inOut' })
    }
  }, [isTyping])

  return (
    <section id="code" ref={sectionRef} className="py-24 bg-dark-bg/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 glass-button rounded-full mb-4">
            <span className="text-accent font-mono text-sm uppercase tracking-widest font-bold">07 / Patterns</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4 tracking-tight">Code Architecture</h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-lg leading-relaxed">Production-grade implementations for critical backend flows.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div ref={navRef} className="lg:col-span-1 space-y-4">
            {snippets.map((snippet, index) => (
              <button
                key={index}
                className={`w-full text-left p-6 glass-card rounded-2xl border transition-all duration-300 group ${
                  activeSnippet === index 
                    ? 'border-accent/40 bg-accent/5 shadow-[0_0_20px_rgba(0,212,255,0.05)]' 
                    : 'border-white/5 hover:border-white/10 hover:bg-white/[0.02]'
                }`}
                onClick={() => setActiveSnippet(index)}
              >
                <h3 className={`font-bold mb-2 group-hover:text-accent transition-colors ${activeSnippet === index ? 'text-accent' : 'text-text-primary'}`}>
                  {snippet.title}
                </h3>
                <p className="text-text-secondary text-xs leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity">
                  {snippet.description}
                </p>
              </button>
            ))}
          </div>

          <div ref={displayRef} className="lg:col-span-3">
            <div className="glass-card rounded-3xl overflow-hidden border border-white/5 shadow-2xl bg-surface-light">
              <div className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-white/[0.02]">
                <div className="flex gap-2.5">
                  <div className="w-3 h-3 bg-[#ff5f56] rounded-full"></div>
                  <div className="w-3 h-3 bg-[#ffbd2e] rounded-full"></div>
                  <div className="w-3 h-3 bg-[#27c93f] rounded-full"></div>
                </div>
                <div className="text-text-secondary font-mono text-xs opacity-50 absolute left-1/2 -translate-x-1/2">
                  kishore.js / {snippets[activeSnippet].title.toLowerCase().replace(/\s+/g, '-')}
                </div>
                <button 
                  className="text-accent hover:text-white transition-colors font-mono text-xs font-bold px-3 py-1 rounded"
                  onClick={() => navigator.clipboard.writeText(snippets[activeSnippet].code)}
                >
                  COPY
                </button>
              </div>

              <div className="relative p-6 font-mono">
                <SyntaxHighlighter
                  language={snippets[activeSnippet].language}
                  style={tomorrow}
                  customStyle={{
                    margin: 0,
                    padding: 0,
                    background: 'transparent',
                    fontSize: '0.85rem',
                    lineHeight: '1.6',
                  }}
                  showLineNumbers={true}
                  wrapLines={true}
                >
                  {isTyping ? typedText : snippets[activeSnippet].code}
                </SyntaxHighlighter>

                {isTyping && (
                  <div
                    ref={cursorRef}
                    className="absolute bottom-6 right-6 w-2.5 h-5 bg-accent shadow-[0_0_10px_#00d4ff]"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CodeSnippets