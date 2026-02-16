import { createFileRoute } from '@tanstack/react-router'
import { useState, useCallback, useRef, useEffect } from 'react'
import { Trophy, History, Trash2, ChevronRight, Info } from 'lucide-react'
import {
  SentenceDiagram,
  SentenceInput,
  FeedbackPanel,
  WritingChallenges,
  AchievementBadges,
  WelcomeScreen,
} from '../components'
import { useAppState } from '../store'
import { parseSentence } from '../utils'
import type { DiagramResult, Achievement } from '../store'

function Home() {
  const {
    isLoading,
    diagrams,
    currentDiagram,
    achievements,
    streak,
    totalDiagrammed,
    animationPhase,
    currentChallenge,
    showChallenges,
    showHistory,
    addDiagram,
    setCurrentDiagram,
    setLoading,
    setAnimationPhase,
    setCurrentChallenge,
    toggleChallenges,
    toggleHistory,
    clearHistory,
  } = useAppState()

  const [error, setError] = useState<string | null>(null)
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null)
  const [showSidebar, setShowSidebar] = useState(false)
  const diagramRef = useRef<HTMLDivElement>(null)

  // Track achievements for toast notifications
  const prevAchievementsRef = useRef(achievements.filter(a => a.unlockedAt).length)
  useEffect(() => {
    const currentUnlocked = achievements.filter(a => a.unlockedAt)
    if (currentUnlocked.length > prevAchievementsRef.current) {
      const newest = currentUnlocked.sort((a, b) => (b.unlockedAt || 0) - (a.unlockedAt || 0))[0]
      setNewAchievement(newest)
      setTimeout(() => setNewAchievement(null), 5000)
    }
    prevAchievementsRef.current = currentUnlocked.length
  }, [achievements])

  const handleSubmit = useCallback(async (sentence: string) => {
    if (!sentence.trim() || isLoading) return

    setError(null)
    setLoading(true)
    setAnimationPhase('parsing')

    try {
      const result: DiagramResult = await parseSentence({ data: { sentence: sentence.trim() } }) as DiagramResult

      if ('error' in result && !result.parse) {
        throw new Error((result as unknown as { error: string }).error)
      }

      setAnimationPhase('building')
      // Small delay to let the parsing animation finish
      await new Promise(resolve => setTimeout(resolve, 300))

      addDiagram(result)

      // Scroll to diagram
      setTimeout(() => {
        diagramRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 200)

      setTimeout(() => setAnimationPhase('complete'), 1800)
    } catch (err) {
      console.error('Error parsing sentence:', err)
      setError(err instanceof Error ? err.message : 'Failed to parse sentence. Please try again.')
      setAnimationPhase('idle')
    } finally {
      setLoading(false)
    }
  }, [isLoading, setLoading, setAnimationPhase, addDiagram])

  const handleTryExample = useCallback((sentence: string) => {
    handleSubmit(sentence)
  }, [handleSubmit])

  const sentenceHistory = diagrams.map(d => d.sentence)

  return (
    <div className="relative flex h-screen bg-slate-950">
      {/* Sidebar */}
      <div
        className={`fixed md:relative z-40 h-full w-72 bg-slate-900/95 backdrop-blur-sm border-r border-slate-800/50 transition-transform duration-300 flex flex-col ${
          showSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Sidebar header with stats */}
        <div className="p-4 border-b border-slate-800/50">
          <h2 className="text-sm font-semibold text-white mb-3">Your Progress</h2>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-lg bg-slate-800/50 text-center">
              <p className="text-lg font-bold text-indigo-400">{totalDiagrammed}</p>
              <p className="text-[10px] text-slate-500">Diagrammed</p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-800/50 text-center">
              <p className="text-lg font-bold text-amber-400">{streak}</p>
              <p className="text-[10px] text-slate-500">Streak</p>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="p-4 border-b border-slate-800/50 overflow-y-auto flex-shrink-0" style={{ maxHeight: '280px' }}>
          <AchievementBadges achievements={achievements} newlyUnlocked={newAchievement} />
        </div>

        {/* Actions */}
        <div className="p-3 space-y-1.5 flex-shrink-0">
          <button
            onClick={toggleChallenges}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-slate-800/50 hover:text-white transition-colors"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Writing Challenges</span>
            <ChevronRight className="w-3 h-3 ml-auto text-slate-600" />
          </button>
          <button
            onClick={toggleHistory}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-slate-800/50 hover:text-white transition-colors"
          >
            <History className="w-4 h-4 text-sky-400" />
            <span>Diagram History</span>
            <ChevronRight className="w-3 h-3 ml-auto text-slate-600" />
          </button>
        </div>

        {/* History list */}
        {showHistory && diagrams.length > 0 && (
          <div className="flex-1 overflow-y-auto border-t border-slate-800/50">
            <div className="p-3 space-y-1">
              <div className="flex items-center justify-between px-2 mb-2">
                <span className="text-xs text-slate-500 font-medium">History</span>
                <button
                  onClick={clearHistory}
                  className="text-xs text-slate-600 hover:text-red-400 transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  Clear
                </button>
              </div>
              {diagrams.slice(0, 20).map((d) => (
                <button
                  key={d.id}
                  onClick={() => setCurrentDiagram(d.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors truncate ${
                    currentDiagram?.id === d.id
                      ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
                >
                  {d.sentence}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className="fixed bottom-4 left-4 z-50 md:hidden p-3 rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
      >
        <Info className="w-5 h-5" />
      </button>

      {/* Backdrop for mobile sidebar */}
      {showSidebar && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex-shrink-0 flex items-center justify-between px-6 py-3 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold">
              <span className="text-transparent bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text">
                Sentence
              </span>{' '}
              <span className="text-white">Architect</span>
            </h1>
          </div>

          {/* Current challenge badge */}
          {currentChallenge && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs text-amber-300">
                Challenge: {currentChallenge.title}
              </span>
              <button
                onClick={() => setCurrentChallenge(null)}
                className="text-amber-500/50 hover:text-amber-400 ml-1"
              >
                &times;
              </button>
            </div>
          )}
        </header>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto">
          {/* Challenge hint */}
          {currentChallenge && !currentChallenge.completed && (
            <div className="max-w-3xl mx-auto px-4 mt-4">
              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
                <p className="text-xs text-amber-400 font-medium mb-1">{currentChallenge.title}</p>
                <p className="text-sm text-slate-300 mb-2">{currentChallenge.description}</p>
                <p className="text-xs text-slate-500">
                  Hint: {currentChallenge.hint}
                </p>
                <p className="text-xs text-slate-600 mt-2 italic">
                  Example: "{currentChallenge.exampleSentence}"
                </p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="max-w-3xl mx-auto px-4 mt-4">
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-300">
                {error}
              </div>
            </div>
          )}

          {/* Main content area */}
          {currentDiagram ? (
            <div ref={diagramRef} className="py-6 space-y-6">
              {/* Original sentence display */}
              <div className="max-w-3xl mx-auto px-4">
                <div className="text-center">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Your Sentence</p>
                  <p className="text-xl text-white font-light leading-relaxed">
                    "{currentDiagram.sentence}"
                  </p>
                </div>
              </div>

              {/* Diagram */}
              <div className="max-w-4xl mx-auto px-4">
                <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/30">
                  <SentenceDiagram
                    parse={currentDiagram.parse}
                    animationPhase={animationPhase}
                  />
                </div>
              </div>

              {/* Word breakdown */}
              {currentDiagram.parse.words && currentDiagram.parse.words.length > 0 && (
                <div className="max-w-3xl mx-auto px-4">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-3 text-center">
                    Word Breakdown
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {currentDiagram.parse.words.map((word, i) => (
                      <div
                        key={i}
                        className="flex flex-col items-center px-3 py-2 rounded-lg bg-slate-800/40 border border-slate-700/30"
                        style={{
                          opacity: animationPhase === 'complete' ? 1 : 0,
                          transition: `opacity 0.3s ease ${i * 0.05}s`,
                        }}
                      >
                        <span className="text-sm font-medium" style={{ color: word.color }}>
                          {word.word}
                        </span>
                        <span className="text-[10px] text-slate-500 mt-0.5">
                          {word.partOfSpeech}
                        </span>
                        <span className="text-[9px] text-slate-600">
                          {word.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Feedback */}
              <div className="px-4">
                <FeedbackPanel diagram={currentDiagram} />
              </div>
            </div>
          ) : (
            <WelcomeScreen onTryExample={handleTryExample} />
          )}
        </div>

        {/* Input area - always at bottom */}
        <div className="flex-shrink-0 py-4 border-t border-slate-800/50 bg-slate-950/80 backdrop-blur-sm">
          <SentenceInput
            onSubmit={handleSubmit}
            isLoading={isLoading}
            history={sentenceHistory}
          />
        </div>
      </div>

      {/* Writing challenges modal */}
      <WritingChallenges
        isOpen={showChallenges}
        onClose={toggleChallenges}
        onSelectChallenge={(challenge) => {
          setCurrentChallenge(challenge)
          toggleChallenges()
        }}
        currentChallenge={currentChallenge}
      />
    </div>
  )
}

export const Route = createFileRoute('/')({
  component: Home,
})
