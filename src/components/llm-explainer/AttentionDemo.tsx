import { useState } from 'react'
import { useInView } from './hooks'

const scenarios = [
  {
    sentence: ['The', 'bank', 'by', 'the', 'river', 'was', 'steep'],
    highlights: [1, 4, 6],
    attentionMap: { 1: [4, 6], 4: [1, 6], 6: [1, 4] } as Record<number, number[]>,
    insight: 'The model figures out "bank" means a riverbank — not a financial bank — by attending to "river" and "steep."',
  },
  {
    sentence: ['I', 'saw', 'her', 'duck', 'under', 'the', 'table'],
    highlights: [3, 4, 6],
    attentionMap: { 3: [4, 6], 4: [3, 6], 6: [3, 4] } as Record<number, number[]>,
    insight: '"Duck" here is a verb (to crouch), not an animal. The model knows because of "under" and "table."',
  },
  {
    sentence: ['The', 'bat', 'flew', 'out', 'of', 'the', 'cave'],
    highlights: [1, 2, 6],
    attentionMap: { 1: [2, 6], 2: [1, 6], 6: [1, 2] } as Record<number, number[]>,
    insight: '"Bat" is an animal here, not a baseball bat. "Flew" and "cave" make that unmistakable.',
  },
]

export function AttentionDemo() {
  const { ref, inView } = useInView(0.3)
  const [scenarioIdx, setScenarioIdx] = useState(0)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  const current = scenarios[scenarioIdx]

  const getHighlight = (idx: number) => {
    if (hoveredIdx === null) return ''
    if (idx === hoveredIdx) return 'bg-yellow-500/30 border-yellow-400 scale-110'
    if (current.attentionMap[hoveredIdx]?.includes(idx)) return 'bg-blue-500/30 border-blue-400 scale-110'
    return 'opacity-40'
  }

  return (
    <div ref={ref} className={`mx-auto max-w-2xl rounded-2xl border border-slate-700 bg-slate-900/80 p-6 sm:p-8 backdrop-blur transition-all duration-700 ${inView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-widest text-purple-400">Interactive: Attention mechanism</span>
        <div className="flex gap-1">
          {scenarios.map((_, i) => (
            <button
              key={i}
              onClick={() => { setScenarioIdx(i); setHoveredIdx(null) }}
              className={`h-2 w-6 rounded-full transition-all ${i === scenarioIdx ? 'bg-purple-400' : 'bg-slate-700 hover:bg-slate-600'}`}
            />
          ))}
        </div>
      </div>
      <p className="mb-6 text-sm text-slate-400">Hover over the highlighted words to see which other words the model pays attention to:</p>

      <div className="flex flex-wrap gap-3 text-lg">
        {current.sentence.map((word, i) => (
          <span
            key={`${scenarioIdx}-${i}`}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
            className={`cursor-pointer rounded-lg border border-transparent px-3 py-1.5 font-semibold transition-all duration-300 ${
              current.highlights.includes(i) ? 'text-yellow-200 border-slate-600' : 'text-slate-300'
            } ${getHighlight(i)}`}
          >
            {word}
          </span>
        ))}
      </div>

      <div className="mt-4 min-h-[3rem]">
        {hoveredIdx !== null && current.attentionMap[hoveredIdx] ? (
          <p className="text-sm text-blue-300">
            "<span className="font-bold">{current.sentence[hoveredIdx]}</span>" pays attention to{' '}
            {current.attentionMap[hoveredIdx].map((idx, i) => (
              <span key={idx}>
                {i > 0 && ' and '}"<span className="font-bold">{current.sentence[idx]}</span>"
              </span>
            ))}
          </p>
        ) : (
          <p className="text-sm text-slate-500 italic">
            {hoveredIdx !== null
              ? `"${current.sentence[hoveredIdx]}" — try the highlighted words!`
              : 'Try the highlighted words — or switch sentences above'}
          </p>
        )}
      </div>

      <div className="mt-3 rounded-lg bg-purple-500/5 border border-purple-500/20 p-3">
        <p className="text-xs text-purple-300">{current.insight}</p>
      </div>
    </div>
  )
}
