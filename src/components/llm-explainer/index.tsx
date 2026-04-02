import { useState, useEffect } from 'react'
import { Section, NeuralBackground } from './Section'
import { InteractiveQuiz } from './InteractiveQuiz'
import { PredictionGame } from './PredictionGame'
import { ScaleComparison, ParameterGrid, TrainingDataViz } from './ScaleVisualizer'
import { AttentionDemo } from './AttentionDemo'
import { EmergenceDemo, TrainingLoopInteractive } from './EmergenceDemo'
import { useInView } from './hooks'

// ─── Animated neural network ────────────────────────────────────────────
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
    </div>
  )
}

// ─── Main Explainer ─────────────────────────────────────────────────────
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
      <div
        className="fixed top-0 left-0 z-50 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-150"
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
          <p className="mx-auto max-w-2xl text-lg text-slate-400">
            A visual guide to one of the strangest things humans have ever built — programs that learned to use language by reading more text than any person ever could.
          </p>
          <div className="mt-8 animate-bounce text-slate-500">
            <svg className="mx-auto h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            <span className="text-xs">Scroll to explore</span>
          </div>
        </Section>

        {/* ── WHAT IS AN LLM ── */}
        <Section className="mb-24">
          <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl">What <span className="text-blue-400">is</span> an LLM?</h2>
          <div className="space-y-4 text-slate-300 text-lg leading-relaxed">
            <p>
              <strong className="text-white">LLM</strong> stands for <strong className="text-blue-400">Large Language Model</strong>. It's a computer program that has absorbed so much human writing that it developed an extraordinary ability: it can <em>use language</em> — to explain, to reason, to create, and to surprise.
            </p>
            <p>
              Here's what makes LLMs strange: nobody programmed them with rules about grammar, or facts about the world, or strategies for solving problems. Instead, they <span className="text-purple-400 font-semibold">learned all of that on their own</span> by reading an almost incomprehensible amount of text.
            </p>
            <p>
              At the technical level, an LLM is a massive mathematical structure — billions of carefully tuned numbers called <em className="text-blue-300">parameters</em>. But what emerges from those numbers is something no one fully understands.
            </p>
          </div>
        </Section>

        {/* ── QUIZ 1 ── */}
        <Section className="mb-24">
          <InteractiveQuiz
            question="What does 'Large' refer to in Large Language Model?"
            options={[
              'The physical size of the computer it runs on',
              'The enormous number of parameters (numbers) inside it',
              'The length of its responses',
              'How loud it talks',
            ]}
            correctIndex={1}
            explanation="'Large' refers to the billions of parameters — tunable numbers — that make up the model. These parameters are what encode everything the model has learned. The largest models have over a trillion of them."
          />
        </Section>

        {/* ── SCALE ── */}
        <Section className="mb-24">
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
            A Scale That's Hard to <span className="text-purple-400">Imagine</span>
          </h2>
          <p className="mb-8 text-slate-400">
            Before we go further, let's try to grasp the sheer size of what we're talking about. These numbers are not typos:
          </p>
          <ScaleComparison />
        </Section>

        {/* ── PARAMETERS ── */}
        <Section className="mb-24">
          <h2 className="mb-3 text-3xl font-bold text-white sm:text-4xl">What Are <span className="text-blue-400">Parameters</span>?</h2>
          <p className="mb-8 text-slate-400">
            Each parameter is a single number — like 0.0037 or -1.452. On its own, one parameter means nothing. But together, billions of them encode everything the model knows: language, facts, logic, style, humor, poetry. Click "Zoom out" to feel the scale:
          </p>
          <ParameterGrid />
        </Section>

        {/* ── HOW CREATED ── */}
        <Section className="mb-24">
          <h2 className="mb-8 text-3xl font-bold text-white sm:text-4xl">How Were LLMs <span className="text-emerald-400">Created</span>?</h2>
          <div className="space-y-6 text-slate-300 text-lg leading-relaxed">
            <p>
              In 2017, researchers at Google published a paper called <em className="text-yellow-300">"Attention Is All You Need"</em> that introduced the <strong className="text-white">Transformer</strong> — a new kind of neural network architecture that changed everything.
            </p>
            <p>
              The breakthrough idea was <span className="text-emerald-400 font-semibold">Attention</span>: a mechanism that lets the model look at every word in a passage simultaneously and figure out which words are connected to which. Before this, AI processed language word by word, like reading through a straw. Transformers could see the whole page at once.
            </p>
            <p>
              But here's the part nobody expected: when you made this architecture <em>really big</em> and fed it <em>truly enormous</em> amounts of text, it started doing things its creators never designed it to do.
            </p>
          </div>
        </Section>

        {/* ── ATTENTION DEMO ── */}
        <Section className="mb-24">
          <h2 className="mb-3 text-3xl font-bold text-white sm:text-4xl">See <span className="text-purple-400">Attention</span> in Action</h2>
          <p className="mb-6 text-slate-400">The same word can mean completely different things depending on context. Explore how the model figures this out:</p>
          <AttentionDemo />
        </Section>

        {/* ── NEURAL NETWORK ── */}
        <Section className="mb-24">
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">Inside the <span className="text-blue-400">Neural Network</span></h2>
          <p className="mb-6 text-slate-400">
            An LLM is a type of neural network — layers of interconnected processing nodes, loosely inspired by the brain. Information flows through these layers, being transformed at each step:
          </p>
          <NeuralNetworkViz />
          <p className="mt-8 text-center text-sm text-slate-500">
            This shows 5 layers with 36 total nodes. A real LLM has <span className="text-blue-400 font-bold">96+ layers</span> with <span className="text-blue-400 font-bold">thousands of nodes each</span>. The full picture would fill a football stadium.
          </p>
        </Section>

        {/* ── QUIZ 2 ── */}
        <Section className="mb-24">
          <InteractiveQuiz
            question="The 'Attention' mechanism lets an LLM..."
            options={[
              'Pay better attention in class',
              'Look at all words in a passage at once to find connections between them',
              'Focus on one word at a time very carefully',
              'Ignore words it doesn\'t understand',
            ]}
            correctIndex={1}
            explanation="Attention lets the model weigh all words simultaneously and discover which words are most relevant to each other. This is how it resolves ambiguity — like knowing whether 'bat' means an animal or sports equipment."
          />
        </Section>

        {/* ── TRAINING ── */}
        <Section className="mb-24">
          <h2 className="mb-8 text-3xl font-bold text-white sm:text-4xl">How Are They <span className="text-amber-400">Trained</span>?</h2>
          <p className="mb-6 text-slate-300 text-lg">
            Training requires a staggering amount of text. Tap each source to understand the scale:
          </p>
          <TrainingDataViz />
        </Section>

        {/* ── TRAINING LOOP ── */}
        <Section className="mb-24">
          <h2 className="mb-3 text-3xl font-bold text-white sm:text-4xl">The <span className="text-amber-400">Training Loop</span></h2>
          <p className="mb-8 text-slate-400">
            The basic process is deceptively simple. But something profound happens when you repeat it at an almost unimaginable scale. Tap each step to learn more:
          </p>
          <TrainingLoopInteractive />
          <div className="mt-8 rounded-xl border border-amber-500/30 bg-amber-500/5 p-6">
            <p className="text-amber-200 text-sm">
              <strong>The deep mystery:</strong> This process doesn't teach the model any explicit rules. It doesn't memorize answers. Yet somehow, from this simple loop repeated trillions of times, the model develops abilities that surprise even its creators — writing poetry, solving logic puzzles, explaining science, writing code. <em>How</em> such complex abilities emerge from such a simple process is one of the biggest open questions in AI research.
            </p>
          </div>
        </Section>

        {/* ── PREDICTION GAME ── */}
        <Section className="mb-24">
          <h2 className="mb-3 text-3xl font-bold text-white sm:text-4xl">Your Turn: <span className="text-pink-400">Think Like an LLM</span></h2>
          <p className="mb-8 text-slate-400">
            At its mechanical level, the model generates language by choosing what word comes next, over and over. Try it yourself — and pay attention to the explanations after each answer:
          </p>
          <PredictionGame />
        </Section>

        {/* ── EMERGENCE ── */}
        <Section className="mb-24">
          <h2 className="mb-3 text-3xl font-bold text-white sm:text-4xl">The <span className="text-pink-400">Strange</span> Part</h2>
          <div className="space-y-4 text-slate-300 text-lg leading-relaxed mb-8">
            <p>
              Here's what keeps AI researchers up at night: LLMs were trained to do one thing — continue text. But somewhere along the way, they developed abilities that <em className="text-white">nobody designed and nobody fully understands</em>.
            </p>
            <p>
              They can write poetry. Explain quantum physics to a five-year-old. Debug code. Reason about hypothetical scenarios. Translate between languages they were barely exposed to. Make jokes. These abilities <span className="text-pink-400 font-semibold">emerged</span> — they appeared spontaneously as the models got larger, without anyone programming them in.
            </p>
            <p className="text-slate-400">
              Explore some examples of emergent abilities:
            </p>
          </div>
          <EmergenceDemo />
        </Section>

        {/* ── QUIZ 3 ── */}
        <Section className="mb-24">
          <InteractiveQuiz
            question="Why do researchers find 'emergent abilities' surprising?"
            options={[
              'Because they were carefully programmed by engineers',
              'Because they appeared spontaneously without being explicitly designed',
              'Because they only work in English',
              'Because they require new hardware to run',
            ]}
            correctIndex={1}
            explanation="Emergent abilities are surprising precisely because no one designed them. They appear spontaneously when models reach a certain scale — as if complexity itself gives rise to new capabilities. This is one of the most debated topics in AI."
          />
        </Section>

        {/* ── WHAT THEY AREN'T ── */}
        <Section className="mb-24">
          <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl">What We <span className="text-yellow-400">Don't Know</span></h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                title: 'Do they "understand"?',
                desc: 'LLMs produce responses that demonstrate something that looks like understanding — but whether it truly is understanding, or something entirely new that we don\'t have a word for yet, is an open debate.',
              },
              {
                title: 'Why does scale work?',
                desc: 'Making models bigger reliably makes them more capable in unexpected ways. Nobody has a complete theory for why this happens.',
              },
              {
                title: 'What do they really learn?',
                desc: 'The billions of parameters encode... something. Researchers are still developing tools to peer inside and figure out what knowledge looks like in a neural network.',
              },
              {
                title: 'Where are the limits?',
                desc: 'We don\'t know what the ceiling is. Each new generation of LLMs does things the previous generation couldn\'t, and no one knows when — or if — that trend will stop.',
              },
            ].map((item, i) => (
              <div key={i} className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-6">
                <h3 className="mb-2 text-lg font-bold text-yellow-200">{item.title}</h3>
                <p className="text-sm text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ── KEY TAKEAWAYS ── */}
        <Section className="mb-24">
          <h2 className="mb-8 text-3xl font-bold text-white sm:text-4xl">Key <span className="text-emerald-400">Takeaways</span></h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { title: 'Learned, Not Programmed', desc: 'No one wrote rules for LLMs. They discovered language patterns by processing an almost incomprehensible amount of text.' },
              { title: 'Vast Complexity', desc: 'Billions to trillions of parameters, trained on trillions of words, running on thousands of chips for months. The scale is genuinely hard to grasp.' },
              { title: 'Surprising Emergence', desc: 'Abilities like reasoning, humor, and creativity appeared without being designed — they emerged from scale and data.' },
              { title: 'Deep Mysteries Remain', desc: 'How these abilities arise, what the model truly "knows," and where the limits lie are among the most important open questions in science.' },
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
            Built for curious minds. The real story is even stranger than what we've shown here — and it's still being written.
          </p>
        </Section>
      </div>

      <style>{`
        @keyframes llm-float {
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
