import { Store } from '@tanstack/store'

// Types for sentence diagramming
export interface DiagramWord {
  word: string
  partOfSpeech: string
  role: string // subject, predicate, directObject, indirectObject, modifier, etc.
  modifies?: string // which word this modifies
  color: string
}

export interface SentenceParse {
  sentence: string
  words: DiagramWord[]
  subject: string
  predicate: string
  directObject?: string
  indirectObject?: string
  subjectModifiers: string[]
  predicateModifiers: string[]
  objectModifiers: string[]
  prepositionalPhrases: { preposition: string; object: string; modifiers: string[] }[]
  clauses: { type: string; content: string }[]
  sentenceType: string // declarative, interrogative, imperative, exclamatory
  complexity: 'simple' | 'compound' | 'complex' | 'compound-complex'
}

export interface DiagramResult {
  id: string
  sentence: string
  parse: SentenceParse
  feedback: string
  encouragement: string
  syntaxIssues: string[]
  improvementSuggestions: string[]
  complexityScore: number // 1-10
  timestamp: number
}

export interface WritingChallenge {
  id: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  hint: string
  exampleSentence: string
  requiredElements: string[]
  completed: boolean
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt: number | null
  requirement: string
}

export interface State {
  diagrams: DiagramResult[]
  currentDiagramId: string | null
  isLoading: boolean
  sentenceHistory: string[]
  streak: number
  totalDiagrammed: number
  achievements: Achievement[]
  currentChallenge: WritingChallenge | null
  showChallenges: boolean
  showHistory: boolean
  animationPhase: 'idle' | 'parsing' | 'building' | 'complete'
}

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: 'first-diagram', title: 'First Steps', description: 'Diagram your first sentence', icon: '1', requirement: 'Diagram 1 sentence', unlockedAt: null },
  { id: 'five-diagrams', title: 'Getting the Hang of It', description: 'Diagram 5 sentences', icon: '5', requirement: 'Diagram 5 sentences', unlockedAt: null },
  { id: 'ten-diagrams', title: 'Grammar Explorer', description: 'Diagram 10 sentences', icon: '10', requirement: 'Diagram 10 sentences', unlockedAt: null },
  { id: 'complex-sentence', title: 'Complexity Master', description: 'Diagram a complex sentence', icon: 'C', requirement: 'Diagram a complex or compound-complex sentence', unlockedAt: null },
  { id: 'perfect-syntax', title: 'Syntax Star', description: 'Write a sentence with no syntax issues', icon: 'S', requirement: 'Get zero syntax issues on a sentence', unlockedAt: null },
  { id: 'high-complexity', title: 'Wordsmith', description: 'Score 8+ complexity on a sentence', icon: 'W', requirement: 'Get a complexity score of 8 or higher', unlockedAt: null },
  { id: 'streak-3', title: 'On a Roll', description: 'Diagram 3 sentences in a row', icon: '3', requirement: 'Reach a 3-sentence streak', unlockedAt: null },
  { id: 'streak-5', title: 'Unstoppable', description: 'Diagram 5 sentences in a row', icon: '!', requirement: 'Reach a 5-sentence streak', unlockedAt: null },
  { id: 'challenge-complete', title: 'Challenge Accepted', description: 'Complete a writing challenge', icon: 'T', requirement: 'Complete any writing challenge', unlockedAt: null },
  { id: 'all-types', title: 'Sentence Collector', description: 'Diagram all 4 sentence types', icon: 'A', requirement: 'Diagram declarative, interrogative, imperative, and exclamatory sentences', unlockedAt: null },
]

const initialState: State = {
  diagrams: [],
  currentDiagramId: null,
  isLoading: false,
  sentenceHistory: [],
  streak: 0,
  totalDiagrammed: 0,
  achievements: DEFAULT_ACHIEVEMENTS,
  currentChallenge: null,
  showChallenges: false,
  showHistory: false,
  animationPhase: 'idle',
}

export const store = new Store<State>(initialState)

export const actions = {
  addDiagram: (diagram: DiagramResult) => {
    store.setState(state => {
      const newTotal = state.totalDiagrammed + 1
      const newStreak = state.streak + 1
      let updatedAchievements = [...state.achievements]

      // Check achievements
      if (newTotal === 1) {
        updatedAchievements = updatedAchievements.map(a =>
          a.id === 'first-diagram' && !a.unlockedAt ? { ...a, unlockedAt: Date.now() } : a
        )
      }
      if (newTotal === 5) {
        updatedAchievements = updatedAchievements.map(a =>
          a.id === 'five-diagrams' && !a.unlockedAt ? { ...a, unlockedAt: Date.now() } : a
        )
      }
      if (newTotal === 10) {
        updatedAchievements = updatedAchievements.map(a =>
          a.id === 'ten-diagrams' && !a.unlockedAt ? { ...a, unlockedAt: Date.now() } : a
        )
      }
      if (diagram.parse.complexity === 'complex' || diagram.parse.complexity === 'compound-complex') {
        updatedAchievements = updatedAchievements.map(a =>
          a.id === 'complex-sentence' && !a.unlockedAt ? { ...a, unlockedAt: Date.now() } : a
        )
      }
      if (diagram.syntaxIssues.length === 0) {
        updatedAchievements = updatedAchievements.map(a =>
          a.id === 'perfect-syntax' && !a.unlockedAt ? { ...a, unlockedAt: Date.now() } : a
        )
      }
      if (diagram.complexityScore >= 8) {
        updatedAchievements = updatedAchievements.map(a =>
          a.id === 'high-complexity' && !a.unlockedAt ? { ...a, unlockedAt: Date.now() } : a
        )
      }
      if (newStreak >= 3) {
        updatedAchievements = updatedAchievements.map(a =>
          a.id === 'streak-3' && !a.unlockedAt ? { ...a, unlockedAt: Date.now() } : a
        )
      }
      if (newStreak >= 5) {
        updatedAchievements = updatedAchievements.map(a =>
          a.id === 'streak-5' && !a.unlockedAt ? { ...a, unlockedAt: Date.now() } : a
        )
      }

      // Check all sentence types
      const allTypes = new Set([
        ...state.diagrams.map(d => d.parse.sentenceType),
        diagram.parse.sentenceType,
      ])
      if (allTypes.has('declarative') && allTypes.has('interrogative') && allTypes.has('imperative') && allTypes.has('exclamatory')) {
        updatedAchievements = updatedAchievements.map(a =>
          a.id === 'all-types' && !a.unlockedAt ? { ...a, unlockedAt: Date.now() } : a
        )
      }

      return {
        ...state,
        diagrams: [diagram, ...state.diagrams],
        currentDiagramId: diagram.id,
        sentenceHistory: [diagram.sentence, ...state.sentenceHistory.filter(s => s !== diagram.sentence)].slice(0, 50),
        totalDiagrammed: newTotal,
        streak: newStreak,
        achievements: updatedAchievements,
      }
    })
  },

  setCurrentDiagram: (id: string | null) => {
    store.setState(state => ({ ...state, currentDiagramId: id }))
  },

  setLoading: (isLoading: boolean) => {
    store.setState(state => ({ ...state, isLoading }))
  },

  setAnimationPhase: (phase: State['animationPhase']) => {
    store.setState(state => ({ ...state, animationPhase: phase }))
  },

  setCurrentChallenge: (challenge: WritingChallenge | null) => {
    store.setState(state => ({ ...state, currentChallenge: challenge }))
  },

  completeChallenge: () => {
    store.setState(state => {
      let updatedAchievements = state.achievements.map(a =>
        a.id === 'challenge-complete' && !a.unlockedAt ? { ...a, unlockedAt: Date.now() } : a
      )
      return {
        ...state,
        currentChallenge: state.currentChallenge ? { ...state.currentChallenge, completed: true } : null,
        achievements: updatedAchievements,
      }
    })
  },

  toggleChallenges: () => {
    store.setState(state => ({ ...state, showChallenges: !state.showChallenges }))
  },

  toggleHistory: () => {
    store.setState(state => ({ ...state, showHistory: !state.showHistory }))
  },

  clearHistory: () => {
    store.setState(state => ({ ...state, diagrams: [], sentenceHistory: [], currentDiagramId: null }))
  },
}

export const selectors = {
  getCurrentDiagram: (state: State) => state.diagrams.find(d => d.id === state.currentDiagramId),
  getDiagrams: (state: State) => state.diagrams,
  getIsLoading: (state: State) => state.isLoading,
  getAchievements: (state: State) => state.achievements,
  getUnlockedAchievements: (state: State) => state.achievements.filter(a => a.unlockedAt !== null),
  getStreak: (state: State) => state.streak,
  getTotalDiagrammed: (state: State) => state.totalDiagrammed,
  getAnimationPhase: (state: State) => state.animationPhase,
  getCurrentChallenge: (state: State) => state.currentChallenge,
  getShowChallenges: (state: State) => state.showChallenges,
  getShowHistory: (state: State) => state.showHistory,
}
