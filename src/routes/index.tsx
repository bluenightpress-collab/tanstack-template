import { createFileRoute } from '@tanstack/react-router';
import { useState, useCallback, useMemo } from 'react';
import { categories, getAllIndicators } from '../components/scenario/data';
import { IndicatorCard } from '../components/scenario/IndicatorCard';
import { ScenarioHeader } from '../components/scenario/ScenarioHeader';
import { ImpactNarrative } from '../components/scenario/ImpactNarrative';

// Preset scenarios
const presets: Record<string, Record<string, number>> = {
  current: Object.fromEntries(getAllIndicators().map((i) => [i.id, i.currentValue])),

  mild_recession: {
    unemployment: 7.5,
    lfpr: 79,
    job_category_loss: 8,
    gdp_change: -4,
    productivity: 2.0,
    sp500: -22,
    cpi_inflation: 4.5,
    profit_margin: 6,
    market_concentration: 30,
    prof_services: -8,
    knowledge_workers: -6,
    tech_wages: -8,
    college_premium: 58,
    gini: 0.51,
    top1_income: 23,
    top01_wealth: 18,
    median_mean_income: -8,
  },

  ai_disruption: {
    unemployment: 9,
    lfpr: 76,
    job_category_loss: 35,
    gdp_change: 8,
    productivity: 7,
    sp500: 85,
    cpi_inflation: 3.5,
    profit_margin: 22,
    market_concentration: 55,
    prof_services: -22,
    knowledge_workers: -32,
    tech_wages: -28,
    college_premium: 38,
    gini: 0.56,
    top1_income: 30,
    top01_wealth: 26,
    median_mean_income: -25,
  },

  severe_crisis: {
    unemployment: 22,
    lfpr: 65,
    job_category_loss: 55,
    gdp_change: -35,
    productivity: 10,
    sp500: -65,
    cpi_inflation: 20,
    profit_margin: 1,
    market_concentration: 70,
    prof_services: -40,
    knowledge_workers: -50,
    tech_wages: -65,
    college_premium: 25,
    gini: 0.65,
    top1_income: 40,
    top01_wealth: 35,
    median_mean_income: -45,
  },
};

function ScenarioPage() {
  // Initialize with current values
  const [values, setValues] = useState<Record<string, number>>(() =>
    Object.fromEntries(getAllIndicators().map((i) => [i.id, i.currentValue])),
  );

  const [expandedCategory, setExpandedCategory] = useState<string | null>('labor');

  const handleChange = useCallback((id: string, value: number) => {
    setValues((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleReset = useCallback(() => {
    setValues(Object.fromEntries(getAllIndicators().map((i) => [i.id, i.currentValue])));
  }, []);

  const handlePreset = useCallback((preset: string) => {
    const p = presets[preset];
    if (p) {
      setValues({ ...p });
    }
  }, []);

  const toggleCategory = useCallback((id: string) => {
    setExpandedCategory((prev) => (prev === id ? null : id));
  }, []);

  // Category colors for styling
  const categoryColors: Record<string, { gradient: string; border: string; badge: string }> = useMemo(
    () => ({
      blue: {
        gradient: 'from-blue-500/10 to-transparent',
        border: 'border-blue-500/20',
        badge: 'bg-blue-500/10 text-blue-400',
      },
      green: {
        gradient: 'from-emerald-500/10 to-transparent',
        border: 'border-emerald-500/20',
        badge: 'bg-emerald-500/10 text-emerald-400',
      },
      purple: {
        gradient: 'from-purple-500/10 to-transparent',
        border: 'border-purple-500/20',
        badge: 'bg-purple-500/10 text-purple-400',
      },
      amber: {
        gradient: 'from-amber-500/10 to-transparent',
        border: 'border-amber-500/20',
        badge: 'bg-amber-500/10 text-amber-400',
      },
      cyan: {
        gradient: 'from-cyan-500/10 to-transparent',
        border: 'border-cyan-500/20',
        badge: 'bg-cyan-500/10 text-cyan-400',
      },
      rose: {
        gradient: 'from-rose-500/10 to-transparent',
        border: 'border-rose-500/20',
        badge: 'bg-rose-500/10 text-rose-400',
      },
    }),
    [],
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-800/50 via-gray-900 to-gray-900 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <ScenarioHeader values={values} onReset={handleReset} onPreset={handlePreset} />

        {/* Main Content: Two-column layout on large screens */}
        <div className="mt-6 grid lg:grid-cols-[1fr_380px] gap-6">
          {/* Left: Indicator Categories */}
          <div className="space-y-4">
            {categories.map((cat) => {
              const colors = categoryColors[cat.color] || categoryColors.blue;
              const isExpanded = expandedCategory === cat.id;

              return (
                <div
                  key={cat.id}
                  className={`rounded-xl border ${colors.border} bg-gradient-to-br ${colors.gradient} overflow-hidden transition-all duration-300`}
                >
                  {/* Category Header */}
                  <button
                    onClick={() => toggleCategory(cat.id)}
                    className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/[0.02] transition-colors"
                  >
                    <span className="text-2xl">{cat.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-base font-semibold text-gray-100">{cat.name}</h2>
                      <p className="text-xs text-gray-500">{cat.description}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${colors.badge}`}>
                        {cat.indicators.length} indicators
                      </span>
                      <span
                        className="text-gray-500 transition-transform duration-200"
                        style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                      >
                        ▼
                      </span>
                    </div>
                  </button>

                  {/* Indicators */}
                  <div
                    className={`transition-all duration-400 overflow-hidden ${
                      isExpanded ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="p-4 pt-0 grid gap-3 sm:grid-cols-1 md:grid-cols-2">
                      {cat.indicators.map((ind) => (
                        <IndicatorCard
                          key={ind.id}
                          indicator={ind}
                          value={values[ind.id] ?? ind.currentValue}
                          onChange={handleChange}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Impact Narrative (sticky on desktop) */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <ImpactNarrative values={values} />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 mb-6 text-center">
          <p className="text-xs text-gray-600">
            This is an educational tool for exploring economic scenarios. Values and thresholds are based on
            conditions set for evaluation by February 2029. Baseline values approximate February 2026 levels.
          </p>
        </footer>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/')({
  component: ScenarioPage,
  head: () => ({
    meta: [
      {
        title: 'Economy 2029 — Interactive Scenario Explorer',
      },
    ],
  }),
});
