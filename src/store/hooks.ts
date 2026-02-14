import { useStore } from '@tanstack/react-store'
import { actions, selectors, store } from './store'

export function useAppState() {
  const isLoading = useStore(store, s => selectors.getIsLoading(s))
  const diagrams = useStore(store, s => selectors.getDiagrams(s))
  const currentDiagram = useStore(store, s => selectors.getCurrentDiagram(s))
  const achievements = useStore(store, s => selectors.getAchievements(s))
  const unlockedAchievements = useStore(store, s => selectors.getUnlockedAchievements(s))
  const streak = useStore(store, s => selectors.getStreak(s))
  const totalDiagrammed = useStore(store, s => selectors.getTotalDiagrammed(s))
  const animationPhase = useStore(store, s => selectors.getAnimationPhase(s))
  const currentChallenge = useStore(store, s => selectors.getCurrentChallenge(s))
  const showChallenges = useStore(store, s => selectors.getShowChallenges(s))
  const showHistory = useStore(store, s => selectors.getShowHistory(s))

  return {
    isLoading,
    diagrams,
    currentDiagram,
    achievements,
    unlockedAchievements,
    streak,
    totalDiagrammed,
    animationPhase,
    currentChallenge,
    showChallenges,
    showHistory,

    // Actions
    addDiagram: actions.addDiagram,
    setCurrentDiagram: actions.setCurrentDiagram,
    setLoading: actions.setLoading,
    setAnimationPhase: actions.setAnimationPhase,
    setCurrentChallenge: actions.setCurrentChallenge,
    completeChallenge: actions.completeChallenge,
    toggleChallenges: actions.toggleChallenges,
    toggleHistory: actions.toggleHistory,
    clearHistory: actions.clearHistory,
  }
}
