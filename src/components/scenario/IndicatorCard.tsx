import { useState, useRef, useEffect } from 'react';
import type { Indicator, IndicatorStatus } from './data';

const statusColors: Record<IndicatorStatus, { bg: string; border: string; text: string; bar: string; glow: string }> = {
  safe: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    bar: 'bg-emerald-500',
    glow: 'shadow-emerald-500/20',
  },
  warning: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    bar: 'bg-amber-500',
    glow: 'shadow-amber-500/20',
  },
  danger: {
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    text: 'text-orange-400',
    bar: 'bg-orange-500',
    glow: 'shadow-orange-500/20',
  },
  beyond: {
    bg: 'bg-red-500/15',
    border: 'border-red-500/40',
    text: 'text-red-400',
    bar: 'bg-red-500',
    glow: 'shadow-red-500/30',
  },
};

const statusLabels: Record<IndicatorStatus, string> = {
  safe: 'Healthy',
  warning: 'Concerning',
  danger: 'Critical',
  beyond: 'THRESHOLD BREACHED',
};

interface IndicatorCardProps {
  indicator: Indicator;
  value: number;
  onChange: (id: string, value: number) => void;
}

export function IndicatorCard({ indicator, value, onChange }: IndicatorCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevStatusRef = useRef<IndicatorStatus>(indicator.getStatus(value));
  const cardRef = useRef<HTMLDivElement>(null);

  const status = indicator.getStatus(value);
  const colors = statusColors[status];
  const impact = indicator.getImpact(value);

  // Animate on status change
  useEffect(() => {
    if (prevStatusRef.current !== status) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 600);
      prevStatusRef.current = status;
      return () => clearTimeout(timer);
    }
  }, [status]);

  // Calculate progress bar width (normalized 0-100)
  const range = indicator.sliderMax - indicator.sliderMin;
  const progressPercent = ((value - indicator.sliderMin) / range) * 100;

  // For the slider track gradient: show zones
  const sliderTrackStyle = buildSliderTrack(indicator);

  return (
    <div
      ref={cardRef}
      className={`
        relative rounded-xl border p-4 transition-all duration-500
        ${colors.bg} ${colors.border}
        ${isAnimating ? `ring-2 ring-offset-1 ring-offset-gray-900 ${colors.border} scenario-pulse` : ''}
        hover:border-opacity-60
      `}
    >
      {/* Header Row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-100 leading-tight">
            {indicator.name}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">{indicator.thresholdLabel}</p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className={`text-lg font-bold tabular-nums ${colors.text}`}>
            {indicator.formatValue(value)}
          </span>
          <span
            className={`
              text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full
              ${status === 'beyond' ? 'bg-red-500/20 text-red-300 scenario-threshold-flash' : `${colors.bg} ${colors.text}`}
            `}
          >
            {statusLabels[status]}
          </span>
        </div>
      </div>

      {/* Slider */}
      <div className="mb-3">
        <div className="relative h-2 rounded-full overflow-hidden mb-1" style={sliderTrackStyle}>
          <div
            className={`absolute top-0 left-0 h-full rounded-full transition-all duration-300 ${colors.bar}`}
            style={{ width: `${progressPercent}%`, opacity: 0.4 }}
          />
        </div>
        <input
          type="range"
          min={indicator.sliderMin}
          max={indicator.sliderMax}
          step={indicator.step}
          value={value}
          onChange={(e) => onChange(indicator.id, parseFloat(e.target.value))}
          className="scenario-slider w-full"
          aria-label={indicator.name}
        />
        <div className="flex justify-between text-[10px] text-gray-600 mt-0.5">
          <span>{indicator.formatValue(indicator.sliderMin)}</span>
          <span className="text-gray-500">Feb 2026: {indicator.formatValue(indicator.currentValue)}</span>
          <span>{indicator.formatValue(indicator.sliderMax)}</span>
        </div>
      </div>

      {/* Expand Toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-xs text-gray-400 hover:text-gray-200 transition-colors flex items-center gap-1 mb-2"
      >
        <span
          className="inline-block transition-transform duration-200"
          style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
        >
          ▶
        </span>
        {isExpanded ? 'Hide details' : 'What does this mean?'}
      </button>

      {/* Expandable Details */}
      <div
        className={`overflow-hidden transition-all duration-400 ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        {/* Explanation */}
        <div className="bg-gray-800/50 rounded-lg p-3 mb-2">
          <p className="text-xs text-gray-400 leading-relaxed">{indicator.description}</p>
        </div>

        {/* Impact */}
        <div className={`rounded-lg p-3 border ${colors.border} ${colors.bg}`}>
          <p className="text-xs font-medium text-gray-300 mb-1">
            At {indicator.formatValue(value)}:
          </p>
          <p className={`text-sm leading-relaxed ${status === 'beyond' ? 'text-red-300 font-medium' : 'text-gray-200'}`}>
            {impact}
          </p>
        </div>
      </div>

      {/* Always-visible mini impact */}
      {!isExpanded && (
        <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 mt-1">
          {impact}
        </p>
      )}
    </div>
  );
}

// Build a CSS gradient for the slider track showing safe/warning/danger zones
function buildSliderTrack(indicator: Indicator): React.CSSProperties {
  // Sample the indicator's status at various points to build the gradient
  const stops: string[] = [];
  const samples = 20;
  for (let i = 0; i <= samples; i++) {
    const pct = i / samples;
    const val = indicator.sliderMin + pct * (indicator.sliderMax - indicator.sliderMin);
    const status = indicator.getStatus(val);
    const color =
      status === 'safe'
        ? 'rgba(16,185,129,0.3)'
        : status === 'warning'
          ? 'rgba(245,158,11,0.3)'
          : status === 'danger'
            ? 'rgba(249,115,22,0.3)'
            : 'rgba(239,68,68,0.4)';
    stops.push(`${color} ${(pct * 100).toFixed(1)}%`);
  }
  return {
    background: `linear-gradient(to right, ${stops.join(', ')})`,
  };
}
