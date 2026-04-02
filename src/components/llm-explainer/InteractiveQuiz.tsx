import { useState } from 'react'

interface QuizProps {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export function InteractiveQuiz({ question, options, correctIndex, explanation }: QuizProps) {
  const [selected, setSelected] = useState<number | null>(null)
  const answered = selected !== null
  const correct = selected === correctIndex

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-slate-700 bg-slate-900/80 p-6 sm:p-8 backdrop-blur">
      <div className="mb-1 text-xs font-bold uppercase tracking-widest text-purple-400">Check your understanding</div>
      <h3 className="mb-5 text-lg font-bold text-white">{question}</h3>
      <div className="space-y-3">
        {options.map((opt, i) => {
          let style = 'border-slate-600 bg-slate-800/60 hover:border-blue-500 hover:bg-blue-500/10 cursor-pointer'
          if (answered) {
            if (i === correctIndex) style = 'border-emerald-400 bg-emerald-500/20'
            else if (i === selected) style = 'border-red-400 bg-red-500/20'
            else style = 'border-slate-700 bg-slate-800/30 opacity-50'
          }
          return (
            <button
              key={i}
              onClick={() => !answered && setSelected(i)}
              disabled={answered}
              className={`w-full rounded-xl border p-4 text-left text-sm transition-all duration-300 ${style}`}
            >
              <span className="mr-3 inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-500 text-xs font-bold text-slate-400">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="text-slate-200">{opt}</span>
            </button>
          )
        })}
      </div>
      {answered && (
        <div className={`mt-5 rounded-xl p-4 text-sm ${correct ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-amber-500/10 border border-amber-500/30'}`}>
          <p className={`font-bold ${correct ? 'text-emerald-300' : 'text-amber-300'}`}>
            {correct ? 'Exactly right!' : 'Not quite!'}
          </p>
          <p className="mt-1 text-slate-300">{explanation}</p>
        </div>
      )}
    </div>
  )
}
