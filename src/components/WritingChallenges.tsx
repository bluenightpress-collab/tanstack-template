import { Trophy, X, ChevronRight } from 'lucide-react'
import type { WritingChallenge } from '../store/store'

interface WritingChallengesProps {
  isOpen: boolean
  onClose: () => void
  onSelectChallenge: (challenge: WritingChallenge) => void
  currentChallenge: WritingChallenge | null
}

const CHALLENGES: WritingChallenge[] = [
  {
    id: 'simple-action',
    title: 'Action Hero',
    description: 'Write a simple sentence with a strong action verb.',
    difficulty: 'beginner',
    hint: 'Think about a subject doing something powerful. Use vivid verbs like "shattered," "soared," or "devoured" instead of basic ones like "went" or "did."',
    exampleSentence: 'The eagle soared above the misty mountains.',
    requiredElements: ['subject', 'strong verb'],
    completed: false,
  },
  {
    id: 'adjective-stack',
    title: 'Color Painter',
    description: 'Write a sentence with at least 3 adjectives describing the subject.',
    difficulty: 'beginner',
    hint: 'Stack up descriptive words before your noun. Try using adjectives that appeal to different senses: sight, sound, touch, smell.',
    exampleSentence: 'The tall, ancient, moss-covered oak tree stood silently.',
    requiredElements: ['subject', 'predicate', '3+ adjectives'],
    completed: false,
  },
  {
    id: 'compound-builder',
    title: 'Double Trouble',
    description: 'Write a compound sentence joining two independent clauses with a conjunction.',
    difficulty: 'intermediate',
    hint: 'Use conjunctions like "and," "but," "or," "yet," or "so" to connect two complete thoughts. Each side of the conjunction should be a sentence that can stand alone.',
    exampleSentence: 'The thunder roared across the valley, and the lightning split the darkened sky.',
    requiredElements: ['two independent clauses', 'conjunction'],
    completed: false,
  },
  {
    id: 'prep-phrase-master',
    title: 'Place & Time',
    description: 'Write a sentence with at least 2 prepositional phrases.',
    difficulty: 'intermediate',
    hint: 'Prepositional phrases start with words like "in," "on," "under," "behind," "during," "through." They add detail about where, when, or how.',
    exampleSentence: 'During the midnight hour, the fox crept through the frozen garden.',
    requiredElements: ['subject', 'predicate', '2+ prepositional phrases'],
    completed: false,
  },
  {
    id: 'complex-weaver',
    title: 'Clause Crafter',
    description: 'Write a complex sentence with a dependent clause.',
    difficulty: 'advanced',
    hint: 'Start with words like "although," "because," "when," "while," "if," or "since" to create a dependent clause. Then add your main clause.',
    exampleSentence: 'Although the path was treacherous, the explorers pressed forward with determination.',
    requiredElements: ['independent clause', 'dependent clause'],
    completed: false,
  },
  {
    id: 'question-master',
    title: 'Curious Mind',
    description: 'Write an interrogative sentence that makes the reader think.',
    difficulty: 'beginner',
    hint: 'Go beyond yes/no questions. Use "how," "why," or "what if" to create thought-provoking questions.',
    exampleSentence: 'What ancient secrets might the crumbling walls of that forgotten castle still guard?',
    requiredElements: ['interrogative structure', 'vivid language'],
    completed: false,
  },
  {
    id: 'compound-complex',
    title: 'Master Builder',
    description: 'Write a compound-complex sentence with multiple clauses.',
    difficulty: 'advanced',
    hint: 'Combine at least two independent clauses AND one dependent clause. This is the pinnacle of sentence construction!',
    exampleSentence: 'When the music finally stopped, the crowd erupted in applause, and the conductor bowed deeply to the audience.',
    requiredElements: ['2+ independent clauses', '1+ dependent clause', 'conjunction'],
    completed: false,
  },
  {
    id: 'sensory-writer',
    title: 'Sense Weaver',
    description: 'Write a sentence that appeals to at least 3 different senses.',
    difficulty: 'intermediate',
    hint: 'Include details about what can be seen, heard, smelled, tasted, or felt. Great writers make readers experience the world through their words.',
    exampleSentence: 'The warm, cinnamon-scented bread crackled softly as she broke open its golden crust.',
    requiredElements: ['3+ sensory details', 'vivid description'],
    completed: false,
  },
]

const difficultyColors = {
  beginner: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  intermediate: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  advanced: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20' },
}

export function WritingChallenges({ isOpen, onClose, onSelectChallenge, currentChallenge }: WritingChallengesProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[80vh] bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10">
              <Trophy className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Writing Challenges</h2>
              <p className="text-xs text-slate-400">Push your writing to the next level</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Challenges list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {CHALLENGES.map((challenge) => {
            const colors = difficultyColors[challenge.difficulty]
            const isActive = currentChallenge?.id === challenge.id

            return (
              <button
                key={challenge.id}
                onClick={() => onSelectChallenge(challenge)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                  isActive
                    ? 'border-indigo-500/50 bg-indigo-500/10'
                    : 'border-slate-700/30 bg-slate-800/40 hover:bg-slate-800/80 hover:border-slate-600/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-white">{challenge.title}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${colors.bg} ${colors.text} border ${colors.border}`}>
                        {challenge.difficulty}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mb-2">{challenge.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {challenge.requiredElements.map((el, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-400">
                          {el}
                        </span>
                      ))}
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 mt-1 ${isActive ? 'text-indigo-400' : 'text-slate-600'}`} />
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
