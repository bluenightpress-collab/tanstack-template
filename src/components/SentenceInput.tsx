import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, RotateCcw } from 'lucide-react'

interface SentenceInputProps {
  onSubmit: (sentence: string) => void
  isLoading: boolean
  history: string[]
}

const EXAMPLE_SENTENCES = [
  "The quick brown fox jumped gracefully over the lazy sleeping dog.",
  "After the storm passed, brilliant rainbows arched across the darkening sky.",
  "She whispered a secret that would change everything forever.",
  "Running through the autumn leaves, the children laughed with pure joy.",
  "Did the mysterious stranger leave the ancient map on the dusty table?",
  "Listen carefully to the whispering wind!",
  "The old lighthouse, battered by countless storms, still guided ships safely home.",
  "Between the towering mountains and the sparkling sea, a hidden village thrived.",
]

export function SentenceInput({ onSubmit, isLoading, history }: SentenceInputProps) {
  const [input, setInput] = useState('')
  const [showHistory, setShowHistory] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const historyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px'
    }
  }, [input])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (historyRef.current && !historyRef.current.contains(e.target as Node)) {
        setShowHistory(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    onSubmit(input.trim())
    setInput('')
    setShowHistory(false)
  }

  const handleSurpriseMe = () => {
    const sentence = EXAMPLE_SENTENCES[Math.floor(Math.random() * EXAMPLE_SENTENCES.length)]
    setInput(sentence)
    textareaRef.current?.focus()
  }

  const handleHistorySelect = (sentence: string) => {
    setInput(sentence)
    setShowHistory(false)
    textareaRef.current?.focus()
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative rounded-2xl bg-slate-800/80 border border-slate-700/50 shadow-lg shadow-indigo-500/5 focus-within:border-indigo-500/50 focus-within:shadow-indigo-500/10 transition-all duration-300">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
            onFocus={() => history.length > 0 && setShowHistory(true)}
            placeholder="Type any sentence to diagram it..."
            className="w-full py-4 pl-5 pr-24 text-base text-white placeholder-slate-500 bg-transparent border-none resize-none focus:outline-none"
            rows={1}
            style={{ minHeight: '56px' }}
            disabled={isLoading}
          />

          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <button
              type="button"
              onClick={handleSurpriseMe}
              disabled={isLoading}
              className="p-2 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-700/50 transition-all duration-200 disabled:opacity-30"
              title="Surprise me with a sentence"
            >
              <Sparkles className="w-4 h-4" />
            </button>

            {history.length > 0 && (
              <button
                type="button"
                onClick={() => setShowHistory(!showHistory)}
                disabled={isLoading}
                className="p-2 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-700/50 transition-all duration-200 disabled:opacity-30"
                title="Recent sentences"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition-all duration-200 disabled:opacity-30 disabled:hover:bg-indigo-600"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* History dropdown */}
        {showHistory && history.length > 0 && (
          <div
            ref={historyRef}
            className="absolute left-0 right-0 top-full mt-2 bg-slate-800 border border-slate-700/50 rounded-xl shadow-xl z-50 max-h-48 overflow-y-auto"
          >
            <div className="p-2">
              <p className="text-xs text-slate-500 px-3 py-1 font-medium">Recent sentences</p>
              {history.slice(0, 8).map((sentence, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleHistorySelect(sentence)}
                  className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-700/50 rounded-lg transition-colors truncate"
                >
                  {sentence}
                </button>
              ))}
            </div>
          </div>
        )}
      </form>

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <span className="text-sm text-slate-400">Analyzing your sentence...</span>
        </div>
      )}
    </div>
  )
}
