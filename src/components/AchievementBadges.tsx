import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import type { Achievement } from '../store/store'

interface AchievementBadgesProps {
  achievements: Achievement[]
  newlyUnlocked?: Achievement | null
}

export function AchievementBadges({ achievements, newlyUnlocked }: AchievementBadgesProps) {
  const [showToast, setShowToast] = useState(false)
  const [toastAchievement, setToastAchievement] = useState<Achievement | null>(null)

  useEffect(() => {
    if (newlyUnlocked) {
      setToastAchievement(newlyUnlocked)
      setShowToast(true)
      const timer = setTimeout(() => setShowToast(false), 4000)
      return () => clearTimeout(timer)
    }
  }, [newlyUnlocked])

  const unlocked = achievements.filter(a => a.unlockedAt !== null)
  const locked = achievements.filter(a => a.unlockedAt === null)

  return (
    <>
      {/* Achievement toast notification */}
      {showToast && toastAchievement && (
        <div className="fixed top-4 right-4 z-[100] animate-slide-in-right">
          <div className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-amber-500/20 to-amber-600/10 border border-amber-500/30 rounded-xl shadow-lg shadow-amber-500/10 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-lg">
              {toastAchievement.icon}
            </div>
            <div>
              <p className="text-xs text-amber-400 font-medium">Achievement Unlocked!</p>
              <p className="text-sm text-white font-semibold">{toastAchievement.title}</p>
            </div>
            <button
              onClick={() => setShowToast(false)}
              className="ml-2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Achievement grid */}
      <div className="space-y-4">
        {/* Unlocked */}
        {unlocked.length > 0 && (
          <div>
            <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 px-1">
              Unlocked ({unlocked.length}/{achievements.length})
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {unlocked.map((achievement) => (
                <div
                  key={achievement.id}
                  className="group relative flex flex-col items-center p-2 rounded-xl bg-gradient-to-b from-amber-500/10 to-transparent border border-amber-500/20 hover:border-amber-500/40 transition-all cursor-default"
                  title={`${achievement.title}: ${achievement.description}`}
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-sm mb-1">
                    {achievement.icon}
                  </div>
                  <span className="text-[9px] text-amber-300 text-center leading-tight">
                    {achievement.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Locked */}
        {locked.length > 0 && (
          <div>
            <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 px-1">
              Locked
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {locked.map((achievement) => (
                <div
                  key={achievement.id}
                  className="group relative flex flex-col items-center p-2 rounded-xl bg-slate-800/30 border border-slate-700/20 hover:border-slate-600/40 transition-all cursor-default"
                  title={achievement.requirement}
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-700/30 flex items-center justify-center text-sm mb-1 text-slate-600">
                    ?
                  </div>
                  <span className="text-[9px] text-slate-600 text-center leading-tight">
                    {achievement.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
