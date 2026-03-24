import { useState, useEffect } from 'react'
import { useInView, useAnimatedCounter } from './hooks'

export function ScaleComparison() {
  const { ref, inView } = useInView(0.2)
  const [revealedStep, setRevealedStep] = useState(-1)

  const comparisons = [
    { number: '400', label: 'parameters shown in the grid below', icon: '⬜', color: 'text-slate-400' },
    { number: '86,000,000,000', label: 'neurons in your brain', icon: '🧠', color: 'text-pink-400' },
    { number: '175,000,000,000', label: 'parameters in GPT-3', icon: '🤖', color: 'text-blue-400' },
    { number: '1,800,000,000,000', label: 'parameters in the largest models', icon: '🌌', color: 'text-purple-400' },
    { number: '15,000,000,000,000', label: 'tokens of text used for training', icon: '📚', color: 'text-amber-400' },
  ]

  useEffect(() => {
    if (!inView) return
    const timers = comparisons.map((_, i) =>
      setTimeout(() => setRevealedStep(i), (i + 1) * 800)
    )
    return () => timers.forEach(clearTimeout)
  }, [inView])

  return (
    <div ref={ref} className="mx-auto max-w-2xl space-y-3">
      {comparisons.map((item, i) => (
        <div
          key={i}
          className={`flex items-center gap-4 rounded-xl border border-slate-700/50 bg-slate-900/60 p-4 transition-all duration-700 ${
            i <= revealedStep ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`}
        >
          <span className="text-2xl">{item.icon}</span>
          <div className="flex-1">
            <p className={`font-mono text-lg font-black ${item.color}`}>{item.number}</p>
            <p className="text-sm text-slate-400">{item.label}</p>
          </div>
          {i > 0 && i <= revealedStep && (
            <span className="text-xs text-slate-500 font-semibold">
              {i === 1 ? '' : `${Math.round(parseFloat(item.number.replace(/,/g, '')) / parseFloat(comparisons[i - 1].number.replace(/,/g, '')))}x more`}
            </span>
          )}
        </div>
      ))}
      {revealedStep >= comparisons.length - 1 && (
        <p className="text-center text-sm text-slate-500 pt-2 animate-pulse">
          If you printed 15 trillion tokens on paper, the stack would reach from Earth past the Moon.
        </p>
      )}
    </div>
  )
}

export function ParameterGrid() {
  const { ref, inView } = useInView(0.3)
  const gridSize = 20
  const [activeIndices, setActiveIndices] = useState<Set<number>>(new Set())
  const [zoomLevel, setZoomLevel] = useState(0)

  useEffect(() => {
    if (!inView) return
    const interval = setInterval(() => {
      setActiveIndices(prev => {
        const next = new Set(prev)
        for (let j = 0; j < 8; j++) next.add(Math.floor(Math.random() * gridSize * gridSize))
        if (next.size > 60) {
          const arr = Array.from(next)
          for (let j = 0; j < 5; j++) next.delete(arr[Math.floor(Math.random() * arr.length)])
        }
        return next
      })
    }, 150)
    return () => clearInterval(interval)
  }, [inView])

  const zoomLabels = [
    'This grid shows 400 parameters.',
    'A small LLM has 7 billion — that\'s 17.5 million of these grids.',
    'A large LLM has 175 billion — that\'s 437 million grids.',
    'The biggest models: 1.8 trillion parameters. You would need 4.5 billion of these grids.',
  ]

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
      <div className="mt-4 text-center">
        <p className="text-sm text-slate-400 min-h-[3rem] transition-all duration-500">
          {zoomLabels[zoomLevel]}
        </p>
        <button
          onClick={() => setZoomLevel(z => (z + 1) % zoomLabels.length)}
          className="mt-2 rounded-lg border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-xs font-semibold text-blue-400 hover:bg-blue-500/20 transition-all"
        >
          {zoomLevel < zoomLabels.length - 1 ? 'Zoom out further' : 'Reset zoom'}
        </button>
      </div>
    </div>
  )
}

export function TrainingDataViz() {
  const { ref, inView } = useInView(0.3)
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null)

  const sources = [
    { label: 'Books', icon: '📚', count: '~200,000', color: 'from-amber-500 to-orange-600', detail: 'More books than you could read in 10,000 lifetimes.' },
    { label: 'Websites', icon: '🌐', count: 'Billions of pages', color: 'from-blue-500 to-cyan-600', detail: 'A meaningful fraction of everything humans have ever published on the internet.' },
    { label: 'Articles', icon: '📰', count: 'Millions', color: 'from-green-500 to-emerald-600', detail: 'Scientific papers, news stories, essays — centuries of human knowledge.' },
    { label: 'Code', icon: '💻', count: 'Billions of lines', color: 'from-purple-500 to-violet-600', detail: 'Open-source code in dozens of programming languages.' },
    { label: 'Conversations', icon: '💬', count: 'Millions', color: 'from-pink-500 to-rose-600', detail: 'Forums, Q&A sites, discussions — how humans actually talk to each other.' },
  ]

  return (
    <div ref={ref} className="mx-auto max-w-3xl">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
        {sources.map((src, i) => (
          <button
            key={i}
            onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
            className={`flex flex-col items-center gap-2 rounded-xl bg-gradient-to-br ${src.color} p-4 text-center transition-all duration-700 hover:scale-105 ${
              inView ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
            } ${expandedIdx === i ? 'ring-2 ring-white/50 scale-105' : ''}`}
            style={{ transitionDelay: `${i * 120}ms` }}
          >
            <span className="text-3xl">{src.icon}</span>
            <span className="text-sm font-bold">{src.label}</span>
            <span className="text-xs opacity-80">{src.count}</span>
          </button>
        ))}
      </div>
      {expandedIdx !== null && (
        <div className="mt-4 rounded-xl border border-slate-600 bg-slate-900/80 p-4 text-center text-sm text-slate-300 transition-all duration-300">
          {sources[expandedIdx].detail}
        </div>
      )}
      {inView && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
          <span className="text-sm font-semibold text-blue-400 whitespace-nowrap">Tap a source to learn more</span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
        </div>
      )}
    </div>
  )
}
