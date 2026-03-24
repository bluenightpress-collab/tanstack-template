import { useState } from 'react'

interface Prompt {
  context: string
  choices: string[]
  bestIndex: number
  otherGood: number[]
  explanation: string
}

const prompts: Prompt[] = [
  {
    context: 'The dog chased the ball across the',
    choices: ['park', 'mathematics', 'the', 'refrigerator'],
    bestIndex: 0,
    otherGood: [],
    explanation: '"Park" fits naturally — your brain uses context to predict meaning, just like an LLM. But here\'s the strange part: the LLM has never been to a park. It has never seen a dog. It assembled that understanding purely from patterns in text.',
  },
  {
    context: 'She opened the book and began to',
    choices: ['read', 'evaporate', 'the', 'fly'],
    bestIndex: 0,
    otherGood: [],
    explanation: 'You probably felt "read" was obvious. An LLM would agree — not because it understands reading, but because across millions of texts, "read" follows this pattern overwhelmingly. Somehow, from pure statistics, it has learned something that looks a lot like understanding.',
  },
  {
    context: 'The capital of France is',
    choices: ['delicious', 'Paris', 'running', 'seventeen'],
    bestIndex: 1,
    otherGood: [],
    explanation: 'The LLM knows this — not because someone programmed "capital of France = Paris" as a rule, but because this pattern appeared so many times in its training data that the knowledge became embedded in its billions of parameters. Nobody designed it to know geography. It just... emerged.',
  },
  {
    context: 'After the rain stopped, the sky was filled with a beautiful',
    choices: ['rainbow', 'equation', 'keyboard', 'deficit'],
    bestIndex: 0,
    otherGood: [],
    explanation: 'An LLM picks "rainbow" for the same reason you did — it has absorbed enough human writing to understand weather, beauty, and wonder. It has never seen a rainbow. It has never felt rain. And yet its response would be indistinguishable from someone who has.',
  },
]

export function PredictionGame() {
  const [promptIdx, setPromptIdx] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [total, setTotal] = useState(0)

  const current = prompts[promptIdx]
  const answered = selected !== null
  const correct = selected === current.bestIndex || current.otherGood.includes(selected ?? -1)
  const done = total >= prompts.length && answered

  const handleSelect = (i: number) => {
    if (answered) return
    setSelected(i)
    setTotal(t => t + 1)
    if (i === current.bestIndex || current.otherGood.includes(i)) {
      setScore(s => s + 1)
    }
  }

  const handleNext = () => {
    if (promptIdx < prompts.length - 1) {
      setPromptIdx(p => p + 1)
      setSelected(null)
    }
  }

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-slate-700 bg-slate-900/80 p-6 sm:p-8 backdrop-blur">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-widest text-pink-400">Your turn: Predict the next word</span>
        <span className="text-xs text-slate-500">{promptIdx + 1} / {prompts.length}</span>
      </div>
      <div className="mb-2 h-1 rounded-full bg-slate-800 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-500"
          style={{ width: `${((promptIdx + (answered ? 1 : 0)) / prompts.length) * 100}%` }}
        />
      </div>

      {!done ? (
        <>
          <p className="my-5 text-lg text-slate-200">
            <span className="text-white font-semibold">{current.context}</span>
            <span className="ml-1 inline-block animate-pulse text-yellow-400 font-bold">___</span>
          </p>

          <div className="grid grid-cols-2 gap-3">
            {current.choices.map((choice, i) => {
              let style = 'border-slate-600 bg-slate-800/60 hover:border-pink-400 hover:bg-pink-500/10 cursor-pointer'
              if (answered) {
                if (i === current.bestIndex) style = 'border-emerald-400 bg-emerald-500/20'
                else if (i === selected) style = 'border-red-400 bg-red-500/15'
                else style = 'border-slate-700 bg-slate-800/30 opacity-50'
              }
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={answered}
                  className={`rounded-xl border px-4 py-3 text-left font-semibold transition-all duration-300 ${style}`}
                >
                  <span className="text-slate-200">{choice}</span>
                </button>
              )
            })}
          </div>

          {answered && (
            <div className={`mt-5 rounded-xl p-4 text-sm ${correct ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-amber-500/10 border border-amber-500/30'}`}>
              <p className="text-slate-300">{current.explanation}</p>
              {promptIdx < prompts.length - 1 && (
                <button
                  onClick={handleNext}
                  className="mt-3 rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white hover:brightness-110 transition-all"
                >
                  Next challenge
                </button>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="py-6 text-center">
          <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
            {score} / {total}
          </p>
          <p className="mt-3 text-slate-300">
            You just did what an LLM does — predicted words from context. But here's what's remarkable: you did it because you <em className="text-white">understand</em> the world. The LLM did it by finding patterns in text... and yet its answers look the same as yours. What does that mean?
          </p>
          <p className="mt-3 text-sm text-slate-500 italic">
            That question is one of the deepest unsolved puzzles in AI.
          </p>
        </div>
      )}
    </div>
  )
}
