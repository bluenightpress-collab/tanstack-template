import { useState, useEffect, useRef, useCallback } from 'react'

// ─── Utility: Intersection Observer hook ────────────────────────────────
function useInView(threshold = 0.3) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

// ─── Section wrapper with fade-in ───────────────────────────────────────
function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { ref, inView } = useInView(0.15)
  return (
    <section
      ref={ref}
      className={`transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${className}`}
    >
      {children}
    </section>
  )
}

// ─── Animated dots background ───────────────────────────────────────────
function NeuralBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden opacity-20">
      {Array.from({ length: 40 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-blue-400"
          style={{
            width: `${3 + Math.random() * 4}px`,
            height: `${3 + Math.random() * 4}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${6 + Math.random() * 8}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
  )
}

// ─── Animated token prediction demo ─────────────────────────────────────
function TokenPredictor() {
  const words = ['The', 'cat', 'sat', 'on', 'the', 'warm', 'sunny', 'windowsill']
  const [visibleCount, setVisibleCount] = useState(0)
  const { ref, inView } = useInView(0.4)

  useEffect(() => {
    if (!inView) return
    setVisibleCount(0)
    const interval = setInterval(() => {
      setVisibleCount(prev => {
        if (prev >= words.length) { clearInterval(interval); return prev }
        return prev + 1
      })
    }, 600)
    return () => clearInterval(interval)
  }, [inView])

  return (
    <div ref={ref} className="mx-auto max-w-2xl rounded-2xl border border-slate-700 bg-slate-900/80 p-8 backdrop-blur">
      <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-blue-400">Watch the LLM predict one word at a time:</p>
      <div className="flex flex-wrap gap-2 text-xl min-h-[3rem]">
        {words.slice(0, visibleCount).map((w, i) => (
          <span
            key={i}
            className="inline-block rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-3 py-1 text-white transition-all duration-500"
            style={{ animation: 'popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' }}
          >
            {w}
          </span>
        ))}
        {visibleCount < words.length && visibleCount > 0 && (
          <span className="inline-block animate-pulse rounded-lg border-2 border-dashed border-yellow-400 px-3 py-1 text-yellow-300">
            ???
          </span>
        )}
      </div>
      {visibleCount > 0 && visibleCount < words.length && (
        <p className="mt-4 text-sm text-slate-400">
          The model looks at <span className="text-blue-300 font-semibold">{words.slice(0, visibleCount).join(' ')}</span> and predicts the most likely next word...
        </p>
      )}
      {visibleCount >= words.length && (
        <p className="mt-4 text-sm text-emerald-400 font-semibold">Complete! Each word was predicted based on all the words before it.</p>
      )}
    </div>
  )
}

// ─── Animated neural network visualization ──────────────────────────────
function NeuralNetworkViz() {
  const { ref, inView } = useInView(0.3)
  const layers = [4, 8, 12, 8, 4]

  return (
    <div ref={ref} className="mx-auto max-w-3xl py-4">
      <div className="flex items-center justify-between gap-1 sm:gap-2 px-4">
        {layers.map((nodeCount, layerIdx) => (
          <div key={layerIdx} className="flex flex-col items-center gap-1">
            <p className="mb-2 text-[10px] sm:text-xs text-slate-500 font-semibold">
              {layerIdx === 0 ? 'Input' : layerIdx === layers.length - 1 ? 'Output' : `Hidden ${layerIdx}`}
            </p>
            {Array.from({ length: nodeCount }).map((_, nodeIdx) => (
              <div
                key={nodeIdx}
                className={`h-3 w-3 sm:h-4 sm:w-4 rounded-full border transition-all duration-700 ${
                  inView
                    ? 'scale-100 border-blue-400 bg-blue-500/60 shadow-[0_0_8px_rgba(59,130,246,0.5)]'
                    : 'scale-0 border-slate-600 bg-slate-800'
                }`}
                style={{ transitionDelay: `${layerIdx * 150 + nodeIdx * 50}ms` }}
              />
            ))}
          </div>
        ))}
      </div>
      {/* Connection lines (simplified SVG) */}
      {inView && (
        <div className="relative -mt-[calc(100%-2rem)] pointer-events-none h-0">
          <svg className="absolute inset-0 w-full h-full opacity-10" style={{ height: '200px' }}>
            {/* Decorative flowing lines */}
            {Array.from({ length: 15 }).map((_, i) => (
              <line
                key={i}
                x1={`${10 + Math.random() * 15}%`}
                y1={`${20 + Math.random() * 60}%`}
                x2={`${75 + Math.random() * 15}%`}
                y2={`${20 + Math.random() * 60}%`}
                stroke="rgb(96, 165, 250)"
                strokeWidth="0.5"
                className="animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </svg>
        </div>
      )}
    </div>
  )
}

// ─── Training data visualization ────────────────────────────────────────
function TrainingDataViz() {
  const { ref, inView } = useInView(0.3)
  const sources = [
    { label: 'Books', icon: '📚', count: '~200,000', color: 'from-amber-500 to-orange-600' },
    { label: 'Websites', icon: '🌐', count: 'Billions of pages', color: 'from-blue-500 to-cyan-600' },
    { label: 'Articles', icon: '📰', count: 'Millions', color: 'from-green-500 to-emerald-600' },
    { label: 'Code', icon: '💻', count: 'Billions of lines', color: 'from-purple-500 to-violet-600' },
    { label: 'Conversations', icon: '💬', count: 'Millions', color: 'from-pink-500 to-rose-600' },
  ]
  return (
    <div ref={ref} className="mx-auto max-w-3xl">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
        {sources.map((src, i) => (
          <div
            key={i}
            className={`flex flex-col items-center gap-2 rounded-xl bg-gradient-to-br ${src.color} p-4 text-center transition-all duration-700 ${
              inView ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
            }`}
            style={{ transitionDelay: `${i * 120}ms` }}
          >
            <span className="text-3xl">{src.icon}</span>
            <span className="text-sm font-bold">{src.label}</span>
            <span className="text-xs opacity-80">{src.count}</span>
          </div>
        ))}
      </div>
      {inView && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
          <span className="text-sm font-semibold text-blue-400 whitespace-nowrap">All funneled into the model</span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
        </div>
      )}
    </div>
  )
}

// ─── Scale counter animation ────────────────────────────────────────────
function ScaleCounter({ label, target, suffix = '' }: { label: string; target: number; suffix?: string }) {
  const { ref, inView } = useInView(0.5)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    let frame: number
    const duration = 2000
    const start = performance.now()
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [inView, target])

  return (
    <div ref={ref} className="flex flex-col items-center gap-1 rounded-xl border border-slate-700 bg-slate-900/60 p-6">
      <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 sm:text-4xl">
        {count.toLocaleString()}{suffix}
      </span>
      <span className="text-sm text-slate-400">{label}</span>
    </div>
  )
}

// ─── Training loop animation ────────────────────────────────────────────
function TrainingLoopViz() {
  const { ref, inView } = useInView(0.3)
  const steps = [
    { label: 'Read text', desc: 'Take a chunk of training data', icon: '📖' },
    { label: 'Predict next word', desc: 'The model guesses what comes next', icon: '🔮' },
    { label: 'Check answer', desc: 'Compare prediction to the real word', icon: '✅' },
    { label: 'Adjust weights', desc: 'Tune millions of numbers slightly', icon: '🔧' },
    { label: 'Repeat', desc: 'Do this trillions of times', icon: '🔄' },
  ]

  return (
    <div ref={ref} className="mx-auto max-w-2xl">
      <div className="relative">
        {steps.map((step, i) => (
          <div
            key={i}
            className={`mb-4 flex items-start gap-4 rounded-xl border border-slate-700/50 bg-slate-900/50 p-4 transition-all duration-700 ${
              inView ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
            }`}
            style={{ transitionDelay: `${i * 200}ms` }}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600/20 text-xl">
              {step.icon}
            </div>
            <div>
              <h4 className="font-bold text-white">{step.label}</h4>
              <p className="text-sm text-slate-400">{step.desc}</p>
            </div>
            {i < steps.length - 1 && (
              <div className="absolute left-[1.7rem] ml-4 mt-14 h-4 w-px bg-gradient-to-b from-blue-500 to-transparent" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Attention mechanism demo ───────────────────────────────────────────
function AttentionDemo() {
  const { ref, inView } = useInView(0.3)
  const sentence = ['The', 'bank', 'by', 'the', 'river', 'was', 'steep']
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  // Simulated attention weights: when hovering "bank", show it attends to "river" and "steep"
  const attentionMap: Record<number, number[]> = {
    1: [4, 6],       // "bank" -> "river", "steep"
    4: [1, 6],       // "river" -> "bank", "steep"
    6: [1, 4],       // "steep" -> "bank", "river"
  }

  const getHighlight = (idx: number) => {
    if (hoveredIdx === null) return ''
    if (idx === hoveredIdx) return 'bg-yellow-500/30 border-yellow-400'
    if (attentionMap[hoveredIdx]?.includes(idx)) return 'bg-blue-500/30 border-blue-400'
    return 'opacity-40'
  }

  return (
    <div ref={ref} className={`mx-auto max-w-2xl rounded-2xl border border-slate-700 bg-slate-900/80 p-8 backdrop-blur transition-all duration-700 ${inView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
      <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-purple-400">Attention: How the model understands context</p>
      <p className="mb-6 text-sm text-slate-400">Hover over a highlighted word to see which other words it pays attention to:</p>
      <div className="flex flex-wrap gap-3 text-lg">
        {sentence.map((word, i) => (
          <span
            key={i}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
            className={`cursor-pointer rounded-lg border border-transparent px-3 py-1.5 font-semibold transition-all duration-300 ${
              [1, 4, 6].includes(i) ? 'text-yellow-200 border-slate-600 ' : 'text-slate-300 '
            }${getHighlight(i)}`}
          >
            {word}
          </span>
        ))}
      </div>
      {hoveredIdx !== null && attentionMap[hoveredIdx] && (
        <p className="mt-4 text-sm text-blue-300">
          "<span className="font-bold">{sentence[hoveredIdx]}</span>" pays attention to{' '}
          {attentionMap[hoveredIdx].map((idx, i) => (
            <span key={idx}>
              {i > 0 && ' and '}"<span className="font-bold">{sentence[idx]}</span>"
            </span>
          ))}
          {' '}to understand meaning in context.
        </p>
      )}
      {hoveredIdx === null && (
        <p className="mt-4 text-sm text-slate-500 italic">Try hovering over "bank", "river", or "steep"</p>
      )}
    </div>
  )
}

// ─── Parameter visualization ────────────────────────────────────────────
function ParameterGrid() {
  const { ref, inView } = useInView(0.3)
  const gridSize = 20
  const [activeIndices, setActiveIndices] = useState<Set<number>>(new Set())

  useEffect(() => {
    if (!inView) return
    const interval = setInterval(() => {
      setActiveIndices(prev => {
        const next = new Set(prev)
        // Add some random new ones
        for (let j = 0; j < 8; j++) {
          next.add(Math.floor(Math.random() * gridSize * gridSize))
        }
        // Remove some old ones if too many
        if (next.size > 60) {
          const arr = Array.from(next)
          for (let j = 0; j < 5; j++) {
            next.delete(arr[Math.floor(Math.random() * arr.length)])
          }
        }
        return next
      })
    }, 150)
    return () => clearInterval(interval)
  }, [inView])

  return (
    <div ref={ref} className="mx-auto max-w-md">
      <div className="grid gap-[2px]" style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}>
        {Array.from({ length: gridSize * gridSize }).map((_, i) => (
          <div
            key={i}
            className={`aspect-square rounded-[2px] transition-colors duration-500 ${
              activeIndices.has(i)
                ? 'bg-blue-400 shadow-[0_0_4px_rgba(96,165,250,0.6)]'
                : 'bg-slate-800'
            }`}
          />
        ))}
      </div>
      <p className="mt-3 text-center text-xs text-slate-500">
        Each square = a tiny number (parameter). A real LLM has <span className="text-blue-400 font-bold">billions</span> of these.
      </p>
    </div>
  )
}

// ─── Main Explainer Component ───────────────────────────────────────────
export function LLMExplainer() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(h > 0 ? window.scrollY / h : 0)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="relative min-h-screen">
      <NeuralBackground />

      {/* Progress bar */}
      <div className="fixed top-0 left-0 z-50 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-150"
        style={{ width: `${scrollProgress * 100}%` }}
      />

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-16">

        {/* ── HERO ── */}
        <Section className="mb-24 text-center">
          <h1 className="mb-4 text-5xl font-black sm:text-7xl">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              How Do LLMs Work?
            </span>
          </h1>
          <p className="mx-auto max-w-xl text-lg text-slate-400">
            A visual guide to understanding Large Language Models — the technology behind AI chatbots like ChatGPT, Claude, and Gemini.
          </p>
          <div className="mt-8 animate-bounce text-slate-500">
            <svg className="mx-auto h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            <span className="text-xs">Scroll to explore</span>
          </div>
        </Section>

        {/* ── WHAT IS AN LLM? ── */}
        <Section className="mb-24">
          <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl">What <span className="text-blue-400">is</span> an LLM?</h2>
          <div className="space-y-4 text-slate-300 text-lg leading-relaxed">
            <p>
              <strong className="text-white">LLM</strong> stands for <strong className="text-blue-400">Large Language Model</strong>. It's a computer program that has read so much text that it learned the patterns of human language.
            </p>
            <p>
              Think of it like this: if you read every book in every library in the world, you'd get pretty good at predicting what words come next in a sentence. That's essentially what an LLM does — but with math.
            </p>
            <p>
              At its core, an LLM is just a <span className="text-purple-400 font-semibold">giant math equation</span> with billions of numbers (called <em>parameters</em>) that have been carefully tuned to predict text.
            </p>
          </div>
        </Section>

        {/* ── SCALE ── */}
        <Section className="mb-24">
          <h2 className="mb-8 text-3xl font-bold text-white sm:text-4xl">The Scale is <span className="text-purple-400">Mind-Boggling</span></h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <ScaleCounter label="Parameters (billions)" target={175} suffix="B" />
            <ScaleCounter label="Training tokens (trillions)" target={15} suffix="T" />
            <ScaleCounter label="Training cost (millions $)" target={100} suffix="M" />
          </div>
          <p className="mt-6 text-center text-sm text-slate-500">Numbers shown are approximate for a large modern LLM</p>
        </Section>

        {/* ── PARAMETERS VISUALIZATION ── */}
        <Section className="mb-24">
          <h2 className="mb-3 text-3xl font-bold text-white sm:text-4xl">What Are <span className="text-blue-400">Parameters</span>?</h2>
          <p className="mb-8 text-slate-400">Parameters are tiny numbers inside the model. Together, they encode everything the model has learned. Watch them light up:</p>
          <ParameterGrid />
          <p className="mt-6 text-center text-slate-400 text-sm">
            This grid shows 400 squares. Now imagine <span className="font-bold text-blue-400">175 billion</span> of them. That's roughly 400 million of these grids.
          </p>
        </Section>

        {/* ── HOW THEY WERE CREATED ── */}
        <Section className="mb-24">
          <h2 className="mb-8 text-3xl font-bold text-white sm:text-4xl">How Were LLMs <span className="text-emerald-400">Created</span>?</h2>
          <div className="space-y-6 text-slate-300 text-lg leading-relaxed">
            <p>
              In 2017, researchers at Google published a paper called <em className="text-yellow-300">"Attention Is All You Need"</em> that introduced the <strong className="text-white">Transformer</strong> architecture — the breakthrough design that makes modern LLMs possible.
            </p>
            <p>
              The key idea? <span className="text-emerald-400 font-semibold">Attention</span> — a way for the model to look at <em>all</em> the words in a sentence at once and figure out which words are most related to each other.
            </p>
          </div>
        </Section>

        {/* ── ATTENTION DEMO ── */}
        <Section className="mb-24">
          <h2 className="mb-8 text-3xl font-bold text-white sm:text-4xl">See <span className="text-purple-400">Attention</span> in Action</h2>
          <AttentionDemo />
          <p className="mt-6 text-center text-sm text-slate-400">
            This is how an LLM understands that "bank" means a riverbank — not a money bank — by paying attention to context words like "river" and "steep."
          </p>
        </Section>

        {/* ── NEURAL NETWORK ── */}
        <Section className="mb-24">
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">Inside the <span className="text-blue-400">Neural Network</span></h2>
          <p className="mb-6 text-slate-400">An LLM is a type of neural network — layers of connected "nodes" that process information. Data flows from left to right:</p>
          <NeuralNetworkViz />
          <p className="mt-8 text-center text-sm text-slate-400">
            A real LLM has <span className="text-blue-400 font-bold">96+ layers</span> with thousands of nodes each. This is a vastly simplified illustration.
          </p>
        </Section>

        {/* ── HOW THEY ARE TRAINED ── */}
        <Section className="mb-24">
          <h2 className="mb-8 text-3xl font-bold text-white sm:text-4xl">How Are They <span className="text-amber-400">Trained</span>?</h2>
          <p className="mb-6 text-slate-300 text-lg">Training an LLM requires an enormous amount of text data from many sources:</p>
          <TrainingDataViz />
        </Section>

        {/* ── TRAINING LOOP ── */}
        <Section className="mb-24">
          <h2 className="mb-3 text-3xl font-bold text-white sm:text-4xl">The <span className="text-amber-400">Training Loop</span></h2>
          <p className="mb-8 text-slate-400">The model learns by repeating a simple process over and over — trillions of times:</p>
          <TrainingLoopViz />
          <div className="mt-8 rounded-xl border border-amber-500/30 bg-amber-500/5 p-6">
            <p className="text-amber-200 text-sm">
              <strong>Key insight:</strong> The model doesn't memorize answers. It learns <em>patterns</em> — like grammar rules, facts, reasoning strategies, and writing styles — by seeing so many examples that it internalizes how language works.
            </p>
          </div>
        </Section>

        {/* ── HOW THEY FUNCTION ── */}
        <Section className="mb-24">
          <h2 className="mb-8 text-3xl font-bold text-white sm:text-4xl">How Do They <span className="text-pink-400">Function</span>?</h2>
          <div className="space-y-4 text-slate-300 text-lg leading-relaxed mb-10">
            <p>
              When you type a message to an LLM, here's what happens: the model reads your text, converts each word into numbers (called <span className="text-pink-400 font-semibold">tokens</span>), processes them through all its layers, and then predicts the <strong className="text-white">single most likely next word</strong>.
            </p>
            <p>
              Then it takes everything — your original text plus the word it just predicted — and repeats the process to predict the <em>next</em> word. One word at a time, over and over, until it has a complete response.
            </p>
          </div>
          <TokenPredictor />
        </Section>

        {/* ── KEY TAKEAWAYS ── */}
        <Section className="mb-24">
          <h2 className="mb-8 text-3xl font-bold text-white sm:text-4xl">Key <span className="text-emerald-400">Takeaways</span></h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { title: 'Pattern Matcher', desc: 'LLMs don\'t "think" — they recognize and reproduce patterns from their training data.' },
              { title: 'Word-by-Word', desc: 'They generate text one word at a time by predicting the most likely next word.' },
              { title: 'Massively Complex', desc: 'Billions of parameters, trained on trillions of words, costing millions of dollars.' },
              { title: 'Context Matters', desc: 'The Attention mechanism lets them understand how words relate to each other in context.' },
            ].map((item, i) => (
              <div key={i} className="rounded-xl border border-slate-700 bg-slate-900/60 p-6">
                <h3 className="mb-2 text-lg font-bold text-white">{item.title}</h3>
                <p className="text-sm text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ── FOOTER ── */}
        <Section className="pb-16 text-center">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-600 to-transparent mb-8" />
          <p className="text-slate-500 text-sm">
            Built for curious students. The real math is much more complex, but these are the core ideas!
          </p>
        </Section>
      </div>

      {/* Keyframe styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-10px) translateX(-10px); }
          75% { transform: translateY(-30px) translateX(5px); }
        }
        @keyframes popIn {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
