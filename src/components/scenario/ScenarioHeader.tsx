import { useMemo } from 'react';
import { calculateHealthScore, countBreaches, getAllIndicators, type IndicatorStatus } from './data';

interface ScenarioHeaderProps {
  values: Record<string, number>;
  onReset: () => void;
  onPreset: (preset: string) => void;
}

export function ScenarioHeader({ values, onReset, onPreset }: ScenarioHeaderProps) {
  const score = useMemo(() => calculateHealthScore(values), [values]);
  const { breached, total } = useMemo(() => countBreaches(values), [values]);
  const indicators = useMemo(() => getAllIndicators(), []);

  // Count statuses
  const statusCounts = useMemo(() => {
    const counts = { safe: 0, warning: 0, danger: 0, beyond: 0 };
    for (const ind of indicators) {
      const val = values[ind.id] ?? ind.currentValue;
      const status: IndicatorStatus = ind.getStatus(val);
      counts[status]++;
    }
    return counts;
  }, [values, indicators]);

  // Score color
  const scoreColor =
    score >= 75 ? 'text-emerald-400' : score >= 50 ? 'text-amber-400' : score >= 25 ? 'text-orange-400' : 'text-red-400';

  const scoreGlow =
    score >= 75
      ? 'drop-shadow-[0_0_12px_rgba(16,185,129,0.4)]'
      : score >= 50
        ? 'drop-shadow-[0_0_12px_rgba(245,158,11,0.4)]'
        : score >= 25
          ? 'drop-shadow-[0_0_12px_rgba(249,115,22,0.4)]'
          : 'drop-shadow-[0_0_12px_rgba(239,68,68,0.5)]';

  // Arc gauge parameters
  const gaugeRadius = 58;
  const gaugeStroke = 8;
  const gaugeCircumference = Math.PI * gaugeRadius; // Semi-circle
  const gaugeFill = (score / 100) * gaugeCircumference;

  const gaugeStrokeColor =
    score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : score >= 25 ? '#f97316' : '#ef4444';

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gray-800/50 border border-gray-700/50 p-6">
      {/* Background gradient orb */}
      <div
        className="absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-20 blur-3xl transition-colors duration-1000"
        style={{ backgroundColor: gaugeStrokeColor }}
      />

      <div className="relative flex flex-col lg:flex-row items-center gap-6">
        {/* Gauge */}
        <div className="relative flex flex-col items-center">
          <svg width="140" height="85" viewBox="0 0 140 85" className={scoreGlow}>
            {/* Background arc */}
            <path
              d="M 12 80 A 58 58 0 0 1 128 80"
              fill="none"
              stroke="rgba(75,85,99,0.3)"
              strokeWidth={gaugeStroke}
              strokeLinecap="round"
            />
            {/* Filled arc */}
            <path
              d="M 12 80 A 58 58 0 0 1 128 80"
              fill="none"
              stroke={gaugeStrokeColor}
              strokeWidth={gaugeStroke}
              strokeLinecap="round"
              strokeDasharray={`${gaugeFill} ${gaugeCircumference}`}
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute bottom-0 flex flex-col items-center">
            <span className={`text-3xl font-black tabular-nums ${scoreColor} transition-colors duration-500`}>
              {score}
            </span>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest">Health Score</span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-xl font-bold text-gray-100 mb-1">
            Economy 2029 Scenario Explorer
          </h1>
          <p className="text-sm text-gray-400 mb-3 max-w-xl">
            Adjust the sliders below to see how different economic conditions would affect everyday life by 2029.
            Each indicator has a threshold — cross it, and we're in uncharted territory.
          </p>

          {/* Status pills */}
          <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
            {statusCounts.safe > 0 && (
              <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {statusCounts.safe} Healthy
              </span>
            )}
            {statusCounts.warning > 0 && (
              <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                {statusCounts.warning} Concerning
              </span>
            )}
            {statusCounts.danger > 0 && (
              <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                {statusCounts.danger} Critical
              </span>
            )}
            {statusCounts.beyond > 0 && (
              <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-red-500/15 text-red-400 border border-red-500/30 scenario-threshold-flash">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                {statusCounts.beyond} Breached
              </span>
            )}
          </div>
        </div>

        {/* Presets & Reset */}
        <div className="flex flex-col gap-2 shrink-0">
          <span className="text-[10px] text-gray-500 uppercase tracking-wider text-center">Presets</span>
          <button
            onClick={() => onPreset('current')}
            className="text-xs px-3 py-1.5 rounded-lg bg-gray-700/50 text-gray-300 hover:bg-gray-700 hover:text-gray-100 transition-colors border border-gray-600/30"
          >
            Today's Economy
          </button>
          <button
            onClick={() => onPreset('mild_recession')}
            className="text-xs px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors border border-amber-500/20"
          >
            Mild Recession
          </button>
          <button
            onClick={() => onPreset('ai_disruption')}
            className="text-xs px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-colors border border-purple-500/20"
          >
            AI Disruption
          </button>
          <button
            onClick={() => onPreset('severe_crisis')}
            className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors border border-red-500/20"
          >
            Severe Crisis
          </button>
          <button
            onClick={onReset}
            className="text-xs px-3 py-1.5 rounded-lg bg-gray-700/30 text-gray-500 hover:text-gray-300 hover:bg-gray-700/50 transition-colors border border-gray-700/30 mt-1"
          >
            ↺ Reset All
          </button>
        </div>
      </div>
    </div>
  );
}
