import { BookOpen, Sparkles, Trophy, Zap } from 'lucide-react'

interface WelcomeScreenProps {
  onTryExample: (sentence: string) => void
}

const STARTER_SENTENCES = [
  { text: 'The cat sat on the mat.', label: 'Simple', color: 'text-emerald-400' },
  { text: 'She ran quickly, but he walked slowly.', label: 'Compound', color: 'text-amber-400' },
  { text: 'Although it rained, the children played outside happily.', label: 'Complex', color: 'text-rose-400' },
]

export function WelcomeScreen({ onTryExample }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-4 py-8">
      <div className="w-full max-w-2xl mx-auto text-center">
        {/* Title */}
        <div className="mb-2">
          <h1 className="text-5xl font-bold tracking-tight">
            <span className="text-transparent bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text">
              Sentence
            </span>{' '}
            <span className="text-white">Architect</span>
          </h1>
        </div>
        <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto">
          Type any sentence and watch it come alive as an interactive diagram.
          Learn grammar by building.
        </p>

        {/* Feature cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { icon: BookOpen, label: 'Diagram Any Sentence', color: 'text-sky-400', bg: 'bg-sky-500/10' },
            { icon: Sparkles, label: 'AI-Powered Feedback', color: 'text-violet-400', bg: 'bg-violet-500/10' },
            { icon: Trophy, label: 'Earn Achievements', color: 'text-amber-400', bg: 'bg-amber-500/10' },
            { icon: Zap, label: 'Writing Challenges', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          ].map((feature) => (
            <div
              key={feature.label}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-800/40 border border-slate-700/30"
            >
              <div className={`p-2 rounded-lg ${feature.bg}`}>
                <feature.icon className={`w-5 h-5 ${feature.color}`} />
              </div>
              <span className="text-xs text-slate-400 text-center">{feature.label}</span>
            </div>
          ))}
        </div>

        {/* Starter sentences */}
        <div className="space-y-2">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-3">
            Try a starter sentence
          </p>
          {STARTER_SENTENCES.map((item) => (
            <button
              key={item.text}
              onClick={() => onTryExample(item.text)}
              className="w-full flex items-center justify-between px-5 py-3 rounded-xl bg-slate-800/40 border border-slate-700/30 hover:bg-slate-800/80 hover:border-indigo-500/30 transition-all duration-200 group"
            >
              <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                "{item.text}"
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full bg-slate-700/50 ${item.color} font-medium`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
