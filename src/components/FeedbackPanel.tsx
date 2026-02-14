import { useState } from 'react'
import { ChevronDown, ChevronUp, AlertTriangle, Lightbulb, MessageCircle, Star } from 'lucide-react'
import type { DiagramResult } from '../store/store'

interface FeedbackPanelProps {
  diagram: DiagramResult
}

export function FeedbackPanel({ diagram }: FeedbackPanelProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>('encouragement')

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const complexityStars = Math.min(5, Math.ceil(diagram.complexityScore / 2))

  return (
    <div className="w-full max-w-3xl mx-auto space-y-3">
      {/* Complexity score */}
      <div className="flex items-center justify-between px-5 py-3 bg-slate-800/60 rounded-xl border border-slate-700/30">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-300">Complexity</span>
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < complexityStars ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span>{diagram.parse.sentenceType}</span>
          <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            {diagram.parse.complexity}
          </span>
        </div>
      </div>

      {/* Encouragement */}
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 overflow-hidden">
        <button
          onClick={() => toggleSection('encouragement')}
          className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-emerald-500/10 transition-colors"
        >
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-emerald-300">Encouragement</span>
          </div>
          {expandedSection === 'encouragement' ? (
            <ChevronUp className="w-4 h-4 text-emerald-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-emerald-400" />
          )}
        </button>
        {expandedSection === 'encouragement' && (
          <div className="px-5 pb-4">
            <p className="text-sm text-emerald-200/80 leading-relaxed">{diagram.encouragement}</p>
          </div>
        )}
      </div>

      {/* Grammar feedback */}
      <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 overflow-hidden">
        <button
          onClick={() => toggleSection('feedback')}
          className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-sky-500/10 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-sky-400" />
            <span className="text-sm font-medium text-sky-300">Grammar Insight</span>
          </div>
          {expandedSection === 'feedback' ? (
            <ChevronUp className="w-4 h-4 text-sky-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-sky-400" />
          )}
        </button>
        {expandedSection === 'feedback' && (
          <div className="px-5 pb-4">
            <p className="text-sm text-sky-200/80 leading-relaxed">{diagram.feedback}</p>
          </div>
        )}
      </div>

      {/* Syntax issues */}
      {diagram.syntaxIssues.length > 0 && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 overflow-hidden">
          <button
            onClick={() => toggleSection('issues')}
            className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-amber-500/10 transition-colors"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium text-amber-300">
                Things to Consider ({diagram.syntaxIssues.length})
              </span>
            </div>
            {expandedSection === 'issues' ? (
              <ChevronUp className="w-4 h-4 text-amber-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-amber-400" />
            )}
          </button>
          {expandedSection === 'issues' && (
            <div className="px-5 pb-4 space-y-2">
              {diagram.syntaxIssues.map((issue, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1 text-xs">*</span>
                  <p className="text-sm text-amber-200/80">{issue}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Improvement suggestions */}
      {diagram.improvementSuggestions.length > 0 && (
        <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 overflow-hidden">
          <button
            onClick={() => toggleSection('suggestions')}
            className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-violet-500/10 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-violet-400" />
              <span className="text-sm font-medium text-violet-300">
                Level Up Your Writing
              </span>
            </div>
            {expandedSection === 'suggestions' ? (
              <ChevronUp className="w-4 h-4 text-violet-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-violet-400" />
            )}
          </button>
          {expandedSection === 'suggestions' && (
            <div className="px-5 pb-4 space-y-2">
              {diagram.improvementSuggestions.map((suggestion, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-violet-400 font-bold text-xs mt-0.5">{i + 1}.</span>
                  <p className="text-sm text-violet-200/80">{suggestion}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
