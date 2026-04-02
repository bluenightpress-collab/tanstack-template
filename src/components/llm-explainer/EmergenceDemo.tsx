import { useState } from 'react'
import { useInView } from './hooks'

const emergentExamples = [
  {
    title: 'Analogy',
    prompt: 'Explain photosynthesis as if plants were running a restaurant.',
    response: 'Plants run a solar-powered kitchen where sunlight is the stove, CO₂ is the raw ingredient delivered through tiny door-shaped pores, and water is piped up from underground. The chef (chlorophyll) cooks it all into glucose — the house specialty — and serves oxygen as a complimentary appetizer to every animal on Earth.',
    wonder: 'Nobody taught the LLM to make analogies. It learned this ability spontaneously.',
  },
  {
    title: 'Humor',
    prompt: 'Write a joke about quantum physics.',
    response: 'A photon checks into a hotel. The bellhop asks, "Can I carry your luggage?" The photon replies, "No thanks, I\'m traveling light."',
    wonder: 'Humor requires understanding double meanings, timing, and surprise. The model was never taught what\'s "funny."',
  },
  {
    title: 'Reasoning',
    prompt: 'If all bloops are razzles, and all razzles are lazzles, are all bloops lazzles?',
    response: 'Yes. If all bloops are razzles, and all razzles are lazzles, then all bloops must also be lazzles. This follows the transitive property.',
    wonder: 'The model can reason about made-up words it has never seen before. It learned the structure of logic itself.',
  },
  {
    title: 'Code',
    prompt: 'Write a function to reverse a linked list.',
    response: 'function reverse(head) {\n  let prev = null, curr = head;\n  while (curr) {\n    let next = curr.next;\n    curr.next = prev;\n    prev = curr;\n    curr = next;\n  }\n  return prev;\n}',
    wonder: 'The model writes working code in languages it was never explicitly taught to program in. It absorbed the logic of computation from examples.',
  },
]

export function EmergenceDemo() {
  const { ref, inView } = useInView(0.2)
  const [activeIdx, setActiveIdx] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)

  const handleReveal = (i: number) => {
    setActiveIdx(i)
    setRevealed(false)
    setTimeout(() => setRevealed(true), 100)
  }

  return (
    <div ref={ref} className={`mx-auto max-w-3xl transition-all duration-700 ${inView ? 'opacity-100' : 'opacity-0'}`}>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {emergentExamples.map((ex, i) => (
          <button
            key={i}
            onClick={() => handleReveal(i)}
            className={`rounded-xl border p-4 text-center transition-all duration-300 hover:scale-105 ${
              activeIdx === i
                ? 'border-pink-400 bg-pink-500/15 scale-105'
                : 'border-slate-700 bg-slate-900/60 hover:border-pink-400/50'
            }`}
          >
            <p className="text-sm font-bold text-white">{ex.title}</p>
            <p className="mt-1 text-xs text-slate-400">Tap to explore</p>
          </button>
        ))}
      </div>

      {activeIdx !== null && (
        <div className={`mt-5 rounded-2xl border border-slate-700 bg-slate-900/80 overflow-hidden transition-all duration-500 ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="border-b border-slate-700 bg-slate-800/50 px-5 py-3">
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Prompt</p>
            <p className="text-sm text-slate-200 mt-1">{emergentExamples[activeIdx].prompt}</p>
          </div>
          <div className="px-5 py-4">
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">LLM response</p>
            <p className="text-sm text-slate-300 whitespace-pre-wrap font-mono bg-slate-800/50 rounded-lg p-3">
              {emergentExamples[activeIdx].response}
            </p>
          </div>
          <div className="border-t border-pink-500/20 bg-pink-500/5 px-5 py-3">
            <p className="text-xs text-pink-300">
              <span className="font-bold">What's strange:</span> {emergentExamples[activeIdx].wonder}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export function TrainingLoopInteractive() {
  const { ref, inView } = useInView(0.3)
  const [activeStep, setActiveStep] = useState<number | null>(null)

  const steps = [
    {
      label: 'Read text',
      icon: '📖',
      desc: 'Take a chunk of training data.',
      detail: 'The model sees a passage — maybe a paragraph from a novel, a Wikipedia article, or a forum post. It sees everything except the next word.',
    },
    {
      label: 'Make a guess',
      icon: '🔮',
      desc: 'The model predicts what comes next.',
      detail: 'Using its current parameters (billions of numbers), it calculates a probability for every possible next word. Early on, these guesses are almost random.',
    },
    {
      label: 'Check the answer',
      icon: '✅',
      desc: 'Compare the guess to reality.',
      detail: 'The real next word is revealed. The model measures how wrong it was — this measurement is called "loss." The goal of all training is to shrink this number.',
    },
    {
      label: 'Adjust the numbers',
      icon: '🔧',
      desc: 'Tiny tweaks to billions of parameters.',
      detail: 'Each parameter is nudged by an incredibly tiny amount — often by less than 0.0001. But across billions of parameters, these tiny changes add up to real learning.',
    },
    {
      label: 'Repeat... a lot',
      icon: '🔄',
      desc: 'Trillions of times.',
      detail: 'This loop runs for weeks or months on thousands of specialized computer chips (GPUs), consuming enough electricity to power a small town. The total cost: tens to hundreds of millions of dollars.',
    },
  ]

  return (
    <div ref={ref} className="mx-auto max-w-2xl">
      <div className="relative space-y-3">
        {steps.map((step, i) => (
          <button
            key={i}
            onClick={() => setActiveStep(activeStep === i ? null : i)}
            className={`w-full text-left rounded-xl border p-4 transition-all duration-500 ${
              inView ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
            } ${
              activeStep === i
                ? 'border-amber-400/50 bg-amber-500/10'
                : 'border-slate-700/50 bg-slate-900/50 hover:border-amber-400/30'
            }`}
            style={{ transitionDelay: `${i * 150}ms` }}
          >
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600/20 text-xl">
                {step.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-white">{step.label}</h4>
                <p className="text-sm text-slate-400">{step.desc}</p>
                {activeStep === i && (
                  <p className="mt-2 text-sm text-amber-200/80 leading-relaxed">{step.detail}</p>
                )}
              </div>
              <svg
                className={`mt-1 h-4 w-4 text-slate-500 transition-transform duration-300 ${activeStep === i ? 'rotate-90' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
