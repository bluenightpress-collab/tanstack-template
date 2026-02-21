import { useMemo } from 'react';
import {
  generateNarrative,
  calculateHealthScore,
  countBreaches,
  categories,
  type IndicatorStatus,
} from './data';

interface ImpactNarrativeProps {
  values: Record<string, number>;
}

export function ImpactNarrative({ values }: ImpactNarrativeProps) {
  const score = useMemo(() => calculateHealthScore(values), [values]);
  const narrative = useMemo(() => generateNarrative(values), [values]);
  const { breached } = useMemo(() => countBreaches(values), [values]);

  // Categorized mini-summaries
  const categorySummaries = useMemo(() => {
    return categories.map((cat) => {
      let worstStatus: IndicatorStatus = 'safe';
      const statusPriority: IndicatorStatus[] = ['safe', 'warning', 'danger', 'beyond'];

      for (const ind of cat.indicators) {
        const val = values[ind.id] ?? ind.currentValue;
        const status = ind.getStatus(val);
        if (statusPriority.indexOf(status) > statusPriority.indexOf(worstStatus)) {
          worstStatus = status;
        }
      }

      return { ...cat, worstStatus };
    });
  }, [values]);

  const borderColor =
    score >= 75
      ? 'border-emerald-500/30'
      : score >= 50
        ? 'border-amber-500/30'
        : score >= 25
          ? 'border-orange-500/30'
          : 'border-red-500/30';

  const bgGlow =
    score >= 75
      ? 'from-emerald-500/5'
      : score >= 50
        ? 'from-amber-500/5'
        : score >= 25
          ? 'from-orange-500/5'
          : 'from-red-500/5';

  return (
    <div className={`rounded-2xl border ${borderColor} bg-gradient-to-br ${bgGlow} to-transparent p-5`}>
      <h2 className="text-lg font-bold text-gray-100 mb-1 flex items-center gap-2">
        <span className="text-xl">📊</span>
        Your 2029 Scenario
      </h2>

      {/* Category overview bar */}
      <div className="flex gap-1 mb-4 mt-3">
        {categorySummaries.map((cat) => {
          const colorMap: Record<IndicatorStatus, string> = {
            safe: 'bg-emerald-500',
            warning: 'bg-amber-500',
            danger: 'bg-orange-500',
            beyond: 'bg-red-500 animate-pulse',
          };
          return (
            <div
              key={cat.id}
              className="group relative flex-1"
            >
              <div
                className={`h-2 rounded-full ${colorMap[cat.worstStatus]} transition-all duration-500`}
              />
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                <span className="text-[10px] text-gray-400">{cat.name}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Category legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 mb-4 mt-2">
        {categorySummaries.map((cat) => {
          const statusIcon =
            cat.worstStatus === 'safe'
              ? '✓'
              : cat.worstStatus === 'warning'
                ? '⚠'
                : cat.worstStatus === 'danger'
                  ? '⚡'
                  : '✕';
          const textColor =
            cat.worstStatus === 'safe'
              ? 'text-emerald-400'
              : cat.worstStatus === 'warning'
                ? 'text-amber-400'
                : cat.worstStatus === 'danger'
                  ? 'text-orange-400'
                  : 'text-red-400';
          return (
            <span key={cat.id} className={`text-xs ${textColor} flex items-center gap-1`}>
              <span>{statusIcon}</span>
              <span>{cat.name}</span>
            </span>
          );
        })}
      </div>

      {/* Narrative */}
      <div className="bg-gray-800/40 rounded-xl p-4 mb-4">
        <p className="text-sm text-gray-200 leading-relaxed">{narrative}</p>
      </div>

      {/* "What would life look like?" section */}
      <LifeImpact score={score} breached={breached} values={values} />
    </div>
  );
}

// Generates a relatable "day in the life" description
function LifeImpact({
  score,
  breached,
  values,
}: {
  score: number;
  breached: number;
  values: Record<string, number>;
}) {
  const unemployment = values.unemployment ?? 4.1;
  const inflation = values.cpi_inflation ?? 2.8;
  const collegePremium = values.college_premium ?? 65;
  const knowledgeWorkers = values.knowledge_workers ?? 0;
  const sp500 = values.sp500 ?? 0;

  const scenarios = useMemo(() => {
    const items: { icon: string; text: string }[] = [];

    // Job hunting
    if (unemployment <= 5) {
      items.push({
        icon: '🎓',
        text: 'After graduating college, you\'d likely find a job within a few months. Employers are competing for workers.',
      });
    } else if (unemployment <= 10) {
      items.push({
        icon: '📋',
        text: 'Job searching after college takes 6-12 months. Many graduates accept positions below their qualifications or move back home.',
      });
    } else if (unemployment <= 18) {
      items.push({
        icon: '😰',
        text: 'Finding work is extremely difficult. Many young people can\'t launch their careers at all. Internships become unpaid just for the experience.',
      });
    } else {
      items.push({
        icon: '🚫',
        text: 'Jobs barely exist. Many people your age face years without meaningful employment. Some never recover professionally.',
      });
    }

    // Cost of living
    if (inflation >= 0 && inflation <= 4) {
      items.push({
        icon: '🛒',
        text: 'Grocery and gas prices are predictable. Your family can budget with confidence.',
      });
    } else if (inflation <= 8) {
      items.push({
        icon: '💸',
        text: 'Prices are rising noticeably. That $5 coffee is now $6+. Your family\'s grocery bill keeps climbing. Saving money gets harder.',
      });
    } else if (inflation <= 15) {
      items.push({
        icon: '📈',
        text: 'Prices are soaring. Fast food meals cost $15-20. Parents worry about making rent. Some families skip meals or delay medical care.',
      });
    } else {
      items.push({
        icon: '🔥',
        text: 'Prices change so fast that stores update them weekly. A cart of groceries costs what a car payment used to. Cash savings become worthless.',
      });
    }

    // College decision
    if (collegePremium >= 50) {
      items.push({
        icon: '🏫',
        text: 'College remains a strong investment. Graduates earn significantly more over their lifetime, making student debt manageable.',
      });
    } else if (collegePremium >= 35) {
      items.push({
        icon: '🤔',
        text: 'The college decision is harder. Degrees still help, but the advantage is shrinking. Trade schools and bootcamps become more attractive.',
      });
    } else {
      items.push({
        icon: '❓',
        text: 'The case for a 4-year degree has collapsed. Many students question taking on debt when graduates barely out-earn non-graduates.',
      });
    }

    // Tech/knowledge career outlook
    if (knowledgeWorkers >= -10) {
      items.push({
        icon: '💻',
        text: 'Careers in tech, law, accounting, and writing are stable. Learning to code or studying pre-law still looks like a smart move.',
      });
    } else if (knowledgeWorkers >= -30) {
      items.push({
        icon: '🤖',
        text: 'AI is reshaping knowledge work. Some entry-level positions have disappeared. Students need to think about what skills AI can\'t replace.',
      });
    } else {
      items.push({
        icon: '⚠️',
        text: 'Many traditional "smart kid" careers are vanishing. AI does much of what lawyers, coders, and writers used to do. The career playbook is being rewritten.',
      });
    }

    // Retirement & wealth
    if (sp500 >= -10 && sp500 <= 50) {
      items.push({
        icon: '🏦',
        text: 'Your parents\' retirement accounts are in reasonable shape. The family feels financially secure enough to plan for the future.',
      });
    } else if (sp500 < -10 && sp500 >= -35) {
      items.push({
        icon: '📉',
        text: 'Retirement accounts have taken a hit. Your parents might delay retirement. Talk of "belt-tightening" becomes common at the dinner table.',
      });
    } else if (sp500 < -35) {
      items.push({
        icon: '💔',
        text: 'Retirement savings have been devastated. Parents who planned to retire can\'t. College savings for younger siblings may be raided. Financial stress affects the whole family.',
      });
    } else {
      items.push({
        icon: '🎰',
        text: 'The stock market is booming, but it feels like a casino. Some families are paper millionaires. Everyone wonders when the music stops.',
      });
    }

    return items;
  }, [unemployment, inflation, collegePremium, knowledgeWorkers, sp500]);

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-200 mb-3 flex items-center gap-2">
        <span>🏠</span>
        What would life feel like for a high school student?
      </h3>
      <div className="grid gap-2">
        {scenarios.map((s, i) => (
          <div
            key={i}
            className="flex gap-3 items-start bg-gray-800/30 rounded-lg p-3 transition-all duration-300"
          >
            <span className="text-lg shrink-0 mt-0.5">{s.icon}</span>
            <p className="text-xs text-gray-300 leading-relaxed">{s.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
