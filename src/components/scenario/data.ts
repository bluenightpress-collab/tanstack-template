// Economic Scenario Tool - Indicator Definitions & Impact Logic
// All 17 indicators across 6 categories with educational descriptions for 11th graders

export type IndicatorStatus = 'safe' | 'warning' | 'danger' | 'beyond';

export interface Indicator {
  id: string;
  name: string;
  shortName: string;
  category: string;
  description: string; // Simple explanation for an 11th grader
  currentValue: number; // Approximate Feb 2026 baseline
  thresholdLabel: string; // Human-readable threshold description
  sliderMin: number;
  sliderMax: number;
  step: number;
  unit: string;
  higherIsBetter?: boolean; // Some indicators are inverted
  formatValue: (v: number) => string;
  getStatus: (v: number) => IndicatorStatus;
  getImpact: (v: number) => string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string; // Tailwind color class
  description: string;
  indicators: Indicator[];
}

// Helper: linear interpolation for status thresholds
function statusFromRange(
  value: number,
  safeMin: number,
  safeMax: number,
  warnMin: number,
  warnMax: number,
): IndicatorStatus {
  if (value >= safeMin && value <= safeMax) return 'safe';
  if (value >= warnMin && value <= warnMax) return 'warning';
  return 'danger';
}

export const categories: Category[] = [
  // ═══════════════════════════════════════════════════════
  // 1. LABOR MARKET
  // ═══════════════════════════════════════════════════════
  {
    id: 'labor',
    name: 'Labor Market',
    icon: '👷',
    color: 'blue',
    description: 'How easy is it for people to find work and earn a living?',
    indicators: [
      {
        id: 'unemployment',
        name: 'Unemployment Rate',
        shortName: 'Unemployment',
        category: 'labor',
        description:
          'The percentage of people who want a job but can\'t find one. When this number goes up, more families struggle to pay bills. The U.S. has historically averaged around 4-6%.',
        currentValue: 4.1,
        thresholdLabel: 'Threshold: ≤ 18%',
        sliderMin: 2,
        sliderMax: 30,
        step: 0.5,
        unit: '%',
        formatValue: (v) => `${v.toFixed(1)}%`,
        getStatus: (v) => {
          if (v <= 6) return 'safe';
          if (v <= 10) return 'warning';
          if (v <= 18) return 'danger';
          return 'beyond';
        },
        getImpact: (v) => {
          if (v <= 4.5)
            return 'Near full employment. Most people who want jobs can find them. Businesses are competing for workers, which usually means better wages and benefits.';
          if (v <= 6)
            return 'Healthy job market. There\'s some normal job searching friction, but opportunities are generally available. This is what economists consider a good range.';
          if (v <= 8)
            return 'The job market is weakening. Your older siblings or cousins might have a harder time finding their first job. Some businesses are cutting back.';
          if (v <= 10)
            return 'Recession-level unemployment, similar to 2009. About 1 in 10 workers can\'t find a job. Many families are cutting back on spending. Some of your classmates\' parents may have lost their jobs.';
          if (v <= 14)
            return 'Severe economic crisis. Think worse than the 2008 financial crisis. Food banks see huge lines. Many businesses close permanently. College graduates struggle to find any work.';
          if (v <= 18)
            return 'Catastrophic unemployment approaching the threshold. Entire industries are collapsing. Homelessness rises sharply. Government emergency programs can\'t keep up with demand.';
          return 'BEYOND THE THRESHOLD. This exceeds Great Depression territory (25% peak). Society is in economic freefall. Widespread poverty, social unrest, and a generation of workers permanently scarred.';
        },
      },
      {
        id: 'lfpr',
        name: 'Labor Force Participation Rate (Ages 25-54)',
        shortName: 'Prime-Age LFPR',
        category: 'labor',
        description:
          'Of all adults in their prime working years (25-54), what percentage are either working or actively looking for work? When this drops, it means people have given up looking entirely.',
        currentValue: 83.5,
        thresholdLabel: 'Threshold: ≥ 68%',
        sliderMin: 55,
        sliderMax: 90,
        step: 0.5,
        unit: '%',
        higherIsBetter: true,
        formatValue: (v) => `${v.toFixed(1)}%`,
        getStatus: (v) => {
          if (v >= 80) return 'safe';
          if (v >= 74) return 'warning';
          if (v >= 68) return 'danger';
          return 'beyond';
        },
        getImpact: (v) => {
          if (v >= 82)
            return 'Healthy participation. The vast majority of working-age adults are engaged in the economy. This means people feel confident about job prospects.';
          if (v >= 78)
            return 'Slightly below normal. Some workers are dropping out — maybe going back to school, caring for family, or discouraged by limited opportunities in their field.';
          if (v >= 74)
            return 'Worrying decline. Millions of prime-age adults have left the workforce. This could signal a mismatch between available jobs and worker skills, or that wages aren\'t worth the effort.';
          if (v >= 68)
            return 'Major crisis in workforce engagement. Over a quarter of prime-age adults aren\'t working or looking. Communities are hollowing out. Social safety nets are strained.';
          return 'BEYOND THE THRESHOLD. An unprecedented share of working-age Americans have abandoned the labor force entirely. The economy cannot function normally. Tax revenue collapses as fewer people earn income.';
        },
      },
      {
        id: 'job_category_loss',
        name: 'Largest Job Category Loss',
        shortName: 'Job Category Loss',
        category: 'labor',
        description:
          'The biggest percentage drop in any single type of job (like "retail workers" or "truck drivers"). If one entire job category loses 50%+, it means that career path is being wiped out.',
        currentValue: 0,
        thresholdLabel: 'Threshold: < 50% loss in any category',
        sliderMin: 0,
        sliderMax: 75,
        step: 1,
        unit: '% lost',
        formatValue: (v) => `${v}% lost`,
        getStatus: (v) => {
          if (v <= 10) return 'safe';
          if (v <= 30) return 'warning';
          if (v < 50) return 'danger';
          return 'beyond';
        },
        getImpact: (v) => {
          if (v <= 5)
            return 'Normal job market shifts. Small changes happen all the time as the economy evolves. Workers in declining roles can usually transition to similar jobs.';
          if (v <= 15)
            return 'Noticeable but manageable displacement. Think of how bank tellers declined with ATMs — disruptive but society adapted over time with retraining.';
          if (v <= 30)
            return 'A major occupation is shrinking fast. Imagine if 1 in 3 people in an entire career field lost their jobs in just 3 years. Entire communities built around that industry would suffer. Retraining programs would be overwhelmed.';
          if (v < 50)
            return 'An occupation is in freefall. This is like what happened to coal miners, but faster and affecting more people. Workers in this field face years of hardship. The social fabric of regions dependent on this work begins to tear.';
          return 'BEYOND THE THRESHOLD. An entire occupation has been cut in half in just 3 years. This has almost no historical precedent at this speed. Millions of specialized workers suddenly have skills nobody needs. The human cost is enormous.';
        },
      },
    ],
  },

  // ═══════════════════════════════════════════════════════
  // 2. ECONOMIC GROWTH & PRODUCTIVITY
  // ═══════════════════════════════════════════════════════
  {
    id: 'growth',
    name: 'Economic Growth & Productivity',
    icon: '📈',
    color: 'green',
    description: 'Is the economy growing at a healthy pace, or spiraling?',
    indicators: [
      {
        id: 'gdp_change',
        name: 'GDP Change from Feb 2026',
        shortName: 'GDP Change',
        category: 'growth',
        description:
          'GDP (Gross Domestic Product) measures everything the country produces and sells. This shows how much it\'s grown or shrunk since February 2026, adjusted for inflation. Normal growth is about 2-3% per year.',
        currentValue: 0,
        thresholdLabel: 'Threshold: -30% to +35%',
        sliderMin: -50,
        sliderMax: 50,
        step: 1,
        unit: '%',
        formatValue: (v) => `${v > 0 ? '+' : ''}${v}%`,
        getStatus: (v) => {
          if (v >= -5 && v <= 12) return 'safe';
          if (v >= -15 && v <= 25) return 'warning';
          if (v >= -30 && v <= 35) return 'danger';
          return 'beyond';
        },
        getImpact: (v) => {
          if (v >= 4 && v <= 12)
            return 'Healthy economic growth. The economy is expanding at a sustainable pace. New businesses are opening, wages are rising modestly, and the standard of living is improving.';
          if (v >= 0 && v < 4)
            return 'Sluggish growth. The economy is barely expanding. While not a recession, people feel stuck. Job growth is slow, and raises don\'t keep up with prices.';
          if (v >= -5 && v < 0)
            return 'The economy has shrunk — this is a recession. Businesses are closing, layoffs are rising, and the mood is pessimistic. Your family might delay big purchases like a car or house.';
          if (v >= -15 && v < -5)
            return 'A deep recession, comparable to 2008-2009. Trillions of dollars in economic activity have vanished. The government scrambles to respond with emergency spending.';
          if (v >= -30 && v < -15)
            return 'Economic catastrophe approaching Great Depression severity. Entire sectors of the economy are collapsing. This level of contraction reshapes society for a generation.';
          if (v < -30)
            return 'BEYOND THE THRESHOLD. The economy has lost more than 30% of its output. This exceeds the Great Depression. Civilization-level economic disruption. International trade collapses.';
          if (v > 12 && v <= 25)
            return 'Unusually fast growth. While this sounds great, it often signals an unsustainable boom — like a bubble that could pop. Inflation may surge as demand outpaces supply.';
          if (v > 25 && v <= 35)
            return 'Extreme growth that\'s almost certainly unsustainable. This pace suggests a massive bubble or radical economic transformation. Either way, volatility and disruption follow.';
          return 'BEYOND THE THRESHOLD. Growth this extreme in 3 years is unprecedented for a developed economy. It likely signals hyperinflation, an asset bubble, or a measurement error. A crash is almost certain.';
        },
      },
      {
        id: 'productivity',
        name: 'Annual Productivity Growth',
        shortName: 'Productivity Growth',
        category: 'growth',
        description:
          'How much more output each worker produces per hour compared to last year. Higher productivity usually means technology is helping workers do more — but if it rises too fast, it might mean machines are replacing workers faster than the economy can adjust.',
        currentValue: 1.5,
        thresholdLabel: 'Threshold: < 8%/year (< 20% over 3 years)',
        sliderMin: 0,
        sliderMax: 15,
        step: 0.5,
        unit: '%/year',
        formatValue: (v) => `${v.toFixed(1)}%/year`,
        getStatus: (v) => {
          if (v <= 3) return 'safe';
          if (v <= 6) return 'warning';
          if (v < 8) return 'danger';
          return 'beyond';
        },
        getImpact: (v) => {
          if (v <= 2)
            return 'Normal productivity growth. Technology helps workers do a bit more each year. Wages tend to keep pace, and the economy adjusts smoothly. This has been the U.S. average for decades.';
          if (v <= 4)
            return 'Solid productivity gains. Workers are meaningfully more productive, likely due to new tools and technology. If wages keep up, this means rising living standards for everyone.';
          if (v <= 6)
            return 'Rapid productivity growth. Some workers are being displaced faster than they can retrain. While the economy is producing more, the benefits may not be evenly shared. Think of how factories automated in the 1980s.';
          if (v < 8)
            return 'Dangerously fast productivity growth. This pace suggests AI or automation is replacing human labor at a rate society hasn\'t seen before. Some industries may be transforming overnight while support systems lag behind.';
          return 'BEYOND THE THRESHOLD. Productivity growth this extreme means machines are replacing human workers at an unprecedented rate. Even if the economy produces more overall, millions of workers may find their skills obsolete almost overnight. Society\'s safety nets aren\'t designed for change this fast.';
        },
      },
    ],
  },

  // ═══════════════════════════════════════════════════════
  // 3. PRICES & MARKETS
  // ═══════════════════════════════════════════════════════
  {
    id: 'prices',
    name: 'Prices & Markets',
    icon: '💹',
    color: 'purple',
    description: 'What\'s happening to the stock market and the cost of everyday goods?',
    indicators: [
      {
        id: 'sp500',
        name: 'S&P 500 Change from Feb 2026',
        shortName: 'S&P 500',
        category: 'prices',
        description:
          'The S&P 500 tracks the 500 biggest U.S. companies\' stock prices. It\'s like a scoreboard for how investors feel about the economy. Changes here affect retirement accounts, college funds, and overall economic confidence.',
        currentValue: 0,
        thresholdLabel: 'Threshold: -60% to +225%',
        sliderMin: -80,
        sliderMax: 300,
        step: 5,
        unit: '%',
        formatValue: (v) => `${v > 0 ? '+' : ''}${v}%`,
        getStatus: (v) => {
          if (v >= -15 && v <= 40) return 'safe';
          if (v >= -35 && v <= 120) return 'warning';
          if (v >= -60 && v <= 225) return 'danger';
          return 'beyond';
        },
        getImpact: (v) => {
          if (v >= -5 && v <= 30)
            return 'Normal stock market range. Your parents\' 401(k) retirement accounts are doing fine. Investor confidence is stable.';
          if (v >= -15 && v < -5)
            return 'A market correction. Investors are nervous, but this happens regularly. Long-term investors are told to stay calm. News headlines get dramatic but it\'s usually temporary.';
          if (v >= -35 && v < -15)
            return 'A bear market. Retirement accounts have taken a big hit. People close to retiring may need to delay. Companies cut back on hiring and expansion. Economic confidence is shaken.';
          if (v >= -60 && v < -35)
            return 'A market crash comparable to 2008 or worse. Trillions of dollars in wealth have been destroyed. Retirement dreams evaporate for many. Banks and financial institutions may be at risk.';
          if (v < -60)
            return 'BEYOND THE THRESHOLD. A collapse worse than the Great Depression\'s stock market crash. The financial system itself is in danger. Banks fail, credit freezes, and the economy grinds to a halt.';
          if (v > 30 && v <= 80)
            return 'Strong bull market. Everyone feels wealthy on paper. But rapid growth like this can create a bubble where prices are disconnected from reality.';
          if (v > 80 && v <= 150)
            return 'Explosive growth that screams "bubble." Remember the dot-com boom? This feels like that. Fortunes are being made, but a crash becomes increasingly likely.';
          if (v > 150 && v <= 225)
            return 'Extreme bubble territory. Stock prices are so disconnected from reality that a devastating crash is almost inevitable. The last time growth was this extreme, the aftermath lasted years.';
          return 'BEYOND THE THRESHOLD. Growth this extreme in 3 years is unprecedented and signals a mania. When this bubble pops — and it will — the crash could be the worst in history.';
        },
      },
      {
        id: 'cpi_inflation',
        name: 'CPI Inflation (3-Year Average)',
        shortName: 'Inflation',
        category: 'prices',
        description:
          'How fast prices for everyday stuff (food, gas, rent) are rising each year, averaged over 3 years. The Federal Reserve targets about 2%. When inflation is high, your money buys less. When it\'s negative (deflation), that can be even worse.',
        currentValue: 2.8,
        thresholdLabel: 'Threshold: -2% to +18% annually',
        sliderMin: -5,
        sliderMax: 25,
        step: 0.5,
        unit: '%/year',
        formatValue: (v) => `${v > 0 ? '+' : ''}${v.toFixed(1)}%/year`,
        getStatus: (v) => {
          if (v >= 1 && v <= 4) return 'safe';
          if ((v >= -1 && v < 1) || (v > 4 && v <= 8)) return 'warning';
          if (v >= -2 && v <= 18) return 'danger';
          return 'beyond';
        },
        getImpact: (v) => {
          if (v >= 1.5 && v <= 3)
            return 'Ideal inflation range. Prices rise a tiny bit each year, which is actually healthy — it encourages people to spend and invest rather than hoard cash. Your allowance still buys roughly the same stuff.';
          if (v > 3 && v <= 5)
            return 'Inflation is running warm. You\'ll notice prices creeping up at the grocery store and gas station. Wages usually lag behind, so families feel a squeeze. This is what the U.S. experienced in 2022-2023.';
          if (v > 5 && v <= 10)
            return 'High inflation. Your dollar is losing value noticeably. A $5 lunch this year costs $5.50 next year. Families on fixed incomes (retirees, etc.) are hurt the most. The Fed will aggressively raise interest rates, making mortgages and car loans expensive.';
          if (v > 10 && v <= 18)
            return 'Very high inflation approaching crisis levels. This is like the late 1970s when prices spiraled out of control. People rush to buy things before prices go up more, which ironically pushes prices even higher. Savings lose value rapidly.';
          if (v > 18)
            return 'BEYOND THE THRESHOLD. This borders on hyperinflation. Your money is losing value so fast that prices change weekly. Think of historical examples like 1920s Germany or modern Venezuela. The economy becomes chaotic.';
          if (v >= 0 && v < 1.5)
            return 'Very low inflation, almost flat. While stable prices sound nice, this actually signals weak demand — people aren\'t spending enough. Businesses struggle to grow. The economy risks slipping into deflation.';
          if (v >= -2 && v < 0)
            return 'Deflation — prices are falling. This sounds great but is actually dangerous. People delay purchases ("why buy now if it\'s cheaper tomorrow?"), businesses cut prices and wages, and the economy spirals downward. Japan experienced this for decades.';
          return 'BEYOND THE THRESHOLD. Severe deflation. The economy is in a deflationary spiral where falling prices cause less spending, which causes more job losses, which causes less spending. Breaking out of this trap is extremely difficult.';
        },
      },
    ],
  },

  // ═══════════════════════════════════════════════════════
  // 4. CORPORATE & STRUCTURAL
  // ═══════════════════════════════════════════════════════
  {
    id: 'corporate',
    name: 'Corporate & Structural',
    icon: '🏢',
    color: 'amber',
    description: 'How healthy and balanced is the business landscape?',
    indicators: [
      {
        id: 'profit_margin',
        name: 'Fortune 500 Median Profit Margin',
        shortName: 'Profit Margins',
        category: 'corporate',
        description:
          'For every dollar the biggest companies earn in revenue, how many cents do they keep as profit? Too low means businesses are failing; too high might mean they\'re squeezing workers or consumers.',
        currentValue: 8.5,
        thresholdLabel: 'Threshold: 2% to 35%',
        sliderMin: 0,
        sliderMax: 50,
        step: 0.5,
        unit: '%',
        formatValue: (v) => `${v.toFixed(1)}%`,
        getStatus: (v) => {
          if (v >= 5 && v <= 15) return 'safe';
          if (v >= 3 && v <= 25) return 'warning';
          if (v >= 2 && v <= 35) return 'danger';
          return 'beyond';
        },
        getImpact: (v) => {
          if (v >= 5 && v <= 12)
            return 'Normal profit margins. Companies are earning enough to invest in growth, pay workers fairly, and return value to shareholders. The business ecosystem is balanced.';
          if (v > 12 && v <= 20)
            return 'Elevated profit margins. Companies are very profitable, possibly due to new technology reducing costs, or due to less competition. Workers and consumers may not be seeing the benefits of economic growth.';
          if (v > 20 && v <= 35)
            return 'Extremely high margins suggest monopoly-like power. Companies may be charging more while paying workers less. This level of corporate profitability usually comes at the expense of everyone else in the economy.';
          if (v > 35)
            return 'BEYOND THE THRESHOLD. Profit margins this extreme haven\'t been seen in modern capitalism. Either businesses have near-total pricing power (bad for consumers) or have eliminated most labor costs (bad for workers). This signals a deeply unbalanced economy.';
          if (v >= 2 && v < 5)
            return 'Thin margins. Companies are struggling to stay profitable. Expect layoffs, reduced investment, and possibly a wave of bankruptcies among weaker firms. Your local stores might start closing.';
          if (v < 2)
            return 'BEYOND THE THRESHOLD. Most major companies are barely breaking even or losing money. Mass bankruptcies, layoffs, and economic collapse follow. Think of the darkest days of the Great Recession, but worse.';
          return '';
        },
      },
      {
        id: 'market_concentration',
        name: 'Top 5 Companies\' S&P 500 Share',
        shortName: 'Market Concentration',
        category: 'corporate',
        description:
          'What percentage of the entire stock market\'s value is controlled by just 5 companies? When too few companies dominate, the economy becomes fragile — if they stumble, everything falls.',
        currentValue: 25,
        thresholdLabel: 'Threshold: < 65%',
        sliderMin: 10,
        sliderMax: 80,
        step: 1,
        unit: '%',
        formatValue: (v) => `${v}%`,
        getStatus: (v) => {
          if (v <= 30) return 'safe';
          if (v <= 50) return 'warning';
          if (v < 65) return 'danger';
          return 'beyond';
        },
        getImpact: (v) => {
          if (v <= 25)
            return 'Healthy market diversity. Many companies compete and drive innovation. The economy isn\'t overly dependent on a handful of firms. This means more choices for consumers and more opportunities for workers.';
          if (v <= 35)
            return 'Some concentration, similar to today\'s market. Big tech firms dominate, but thousands of other companies still thrive. Keep an eye on it, though — this trend has been growing.';
          if (v <= 50)
            return 'High concentration. The economy increasingly revolves around a handful of mega-corporations. Small businesses struggle to compete. Innovation may slow because startups can\'t challenge the giants.';
          if (v < 65)
            return 'Extreme concentration. Five companies control most of the market\'s value. They likely dominate multiple industries, set prices, and influence government policy. Competition is dying.';
          return 'BEYOND THE THRESHOLD. Five companies control more than 65% of market value. This is oligarchy-level concentration. These companies are essentially "too big to fail" — if even one struggles, it could tank the entire economy. Small business America is fading.';
        },
      },
    ],
  },

  // ═══════════════════════════════════════════════════════
  // 5. WHITE COLLAR & KNOWLEDGE WORKERS
  // ═══════════════════════════════════════════════════════
  {
    id: 'whitecollar',
    name: 'White Collar & Knowledge Workers',
    icon: '💼',
    color: 'cyan',
    description: 'What\'s happening to professional office and knowledge-based careers?',
    indicators: [
      {
        id: 'prof_services',
        name: 'Professional & Business Services Employment Change',
        shortName: 'Professional Services',
        category: 'whitecollar',
        description:
          'The change in total jobs in professional services — think consulting firms, law offices, accounting, engineering, and tech companies. These are the "office jobs" many college graduates aspire to.',
        currentValue: 0,
        thresholdLabel: 'Threshold: no more than 35% decline',
        sliderMin: -50,
        sliderMax: 15,
        step: 1,
        unit: '% change',
        formatValue: (v) => `${v > 0 ? '+' : ''}${v}%`,
        getStatus: (v) => {
          if (v >= -10) return 'safe';
          if (v >= -20) return 'warning';
          if (v > -35) return 'danger';
          return 'beyond';
        },
        getImpact: (v) => {
          if (v >= -5 && v <= 10)
            return 'Stable professional job market. If you\'re planning to go to college for a professional career, the path still looks clear. These jobs are growing or holding steady.';
          if (v >= -15 && v < -5)
            return 'Professional services are shrinking noticeably. Some entry-level office jobs are disappearing — possibly to AI or offshoring. Recent college graduates may need to be more flexible about their first job.';
          if (v >= -25 && v < -15)
            return 'A major contraction in white-collar work. This is like a recession that specifically targets college-educated professionals. Law firms, consulting companies, and corporate offices are downsizing significantly.';
          if (v > -35 && v < -25)
            return 'Professional services in crisis. One in four professional jobs has vanished. The traditional path of "get a degree, get an office job" is breaking down. Many professionals are taking jobs below their skill level.';
          if (v <= -35)
            return 'BEYOND THE THRESHOLD. More than a third of professional service jobs are gone. The entire economic model that said "go to college, get a good job" has collapsed. AI and automation have fundamentally reshaped what "work" means for educated workers.';
          return 'Strong growth in professional services. More opportunities for knowledge workers than ever. Great news if you\'re college-bound.';
        },
      },
      {
        id: 'knowledge_workers',
        name: 'Knowledge Worker Employment Change',
        shortName: 'Knowledge Workers',
        category: 'whitecollar',
        description:
          'Combined job changes for software developers, accountants, lawyers, consultants, and writers. These are careers that require years of specialized education and training.',
        currentValue: 0,
        thresholdLabel: 'Threshold: no more than 45% decline',
        sliderMin: -60,
        sliderMax: 15,
        step: 1,
        unit: '% change',
        formatValue: (v) => `${v > 0 ? '+' : ''}${v}%`,
        getStatus: (v) => {
          if (v >= -10) return 'safe';
          if (v >= -25) return 'warning';
          if (v > -45) return 'danger';
          return 'beyond';
        },
        getImpact: (v) => {
          if (v >= -5 && v <= 10)
            return 'Knowledge careers are stable. Software developers, lawyers, accountants, and writers are still in demand. Studying these fields in college remains a solid bet.';
          if (v >= -15 && v < -5)
            return 'Some knowledge professions are shrinking. AI tools might be automating parts of these jobs — writing first drafts, basic coding, routine legal research. Workers need to adapt and move "up the value chain."';
          if (v >= -30 && v < -15)
            return 'Serious disruption to knowledge work. AI is doing much of what junior lawyers, entry-level coders, and staff writers used to do. Students need to seriously rethink career plans. The value of certain degrees is in question.';
          if (v > -45 && v < -30)
            return 'Knowledge work is in crisis. Nearly a third of these jobs are gone. Prestigious careers that once guaranteed a comfortable life — lawyer, developer, accountant — no longer offer that security. Society is reckoning with what "skilled work" means.';
          if (v <= -45)
            return 'BEYOND THE THRESHOLD. Almost half of knowledge workers have lost their jobs. This is a fundamental restructuring of the economy. Decades of career advice are obsolete. The very idea of "going to college to get a good job" needs to be completely reimagined.';
          return 'Strong growth in knowledge careers. Great news for students planning to enter these fields.';
        },
      },
      {
        id: 'tech_wages',
        name: 'Computer & Math Occupation Wages (Real Change)',
        shortName: 'Tech Wages',
        category: 'whitecollar',
        description:
          'How much have wages for tech and math workers changed, adjusted for inflation? These jobs (programmers, data analysts, etc.) have been among the highest-paid. A big drop means even "safe" careers aren\'t safe.',
        currentValue: 0,
        thresholdLabel: 'Threshold: no more than 60% decline (real)',
        sliderMin: -75,
        sliderMax: 20,
        step: 1,
        unit: '% change',
        formatValue: (v) => `${v > 0 ? '+' : ''}${v}%`,
        getStatus: (v) => {
          if (v >= -10) return 'safe';
          if (v >= -30) return 'warning';
          if (v > -60) return 'danger';
          return 'beyond';
        },
        getImpact: (v) => {
          if (v >= -5 && v <= 15)
            return 'Tech wages holding steady or growing. Computer science and math remain lucrative career paths. The investment in a STEM education still pays off handsomely.';
          if (v >= -15 && v < -5)
            return 'Tech wages declining. Supply of tech workers may be outpacing demand, or AI is reducing the value of some technical skills. Still decent-paying jobs, but the "gold rush" era of tech salaries is cooling.';
          if (v >= -30 && v < -15)
            return 'Significant wage erosion in tech. A software developer might earn 20-30% less in real terms. This changes the college calculus — is a CS degree worth the student debt if salaries are falling? Tech is becoming a normal job, not a ticket to wealth.';
          if (v > -60 && v < -30)
            return 'Tech wages in freefall. The once-highest-paid professional field is seeing massive pay cuts. AI can do much of what these workers did, flooding the market with cheap alternatives. The Silicon Valley dream is dying.';
          if (v <= -60)
            return 'BEYOND THE THRESHOLD. Tech wages have collapsed by more than 60%. A career in computing pays less than many trades. The entire higher education system, which pushed STEM for decades, is being upended.';
          return 'Strong wage growth in tech. Excellent news for anyone pursuing computer science or mathematics.';
        },
      },
      {
        id: 'college_premium',
        name: 'College Wage Premium',
        shortName: 'College Premium',
        category: 'whitecollar',
        description:
          'How much more do people with a bachelor\'s degree earn compared to those with only a high school diploma? Currently about 65%. This is the biggest reason people go to college — the earnings gap.',
        currentValue: 65,
        thresholdLabel: 'Threshold: > 30%',
        sliderMin: 0,
        sliderMax: 100,
        step: 1,
        unit: '%',
        higherIsBetter: true,
        formatValue: (v) => `${v}%`,
        getStatus: (v) => {
          if (v >= 55) return 'safe';
          if (v >= 40) return 'warning';
          if (v > 30) return 'danger';
          return 'beyond';
        },
        getImpact: (v) => {
          if (v >= 55)
            return 'College still pays off significantly. Degree holders earn well over 50% more than non-degree holders. The traditional advice of "go to college for a better life" still holds true. Student debt, while painful, is usually a good investment.';
          if (v >= 45)
            return 'The college advantage is shrinking. A degree still helps, but the gap is narrowing. Students should be more strategic about their major and school choice. Trade schools and certifications become more competitive alternatives.';
          if (v > 30 && v < 45)
            return 'The college premium is eroding significantly. For some majors, the debt may not be worth it anymore. This fundamentally changes how young people should think about education. Vocational training and apprenticeships gain appeal.';
          if (v <= 30)
            return 'BEYOND THE THRESHOLD. A college degree barely pays more than a high school diploma. The entire foundation of American higher education is shaken. Why take on $100K+ in debt for a marginal salary boost? Enrollment will plummet, and universities will face an existential crisis.';
          return 'Very high college premium. A college degree is extremely valuable compared to alternatives. But this may also signal that non-degree workers are being left behind.';
        },
      },
    ],
  },

  // ═══════════════════════════════════════════════════════
  // 6. INEQUALITY
  // ═══════════════════════════════════════════════════════
  {
    id: 'inequality',
    name: 'Inequality',
    icon: '⚖️',
    color: 'rose',
    description: 'How evenly is the economic pie being shared?',
    indicators: [
      {
        id: 'gini',
        name: 'Gini Coefficient',
        shortName: 'Gini Index',
        category: 'inequality',
        description:
          'A score from 0 to 1 measuring income inequality. 0 = perfectly equal (everyone earns the same), 1 = perfectly unequal (one person has all the money). The U.S. is currently around 0.49 — one of the highest among developed nations.',
        currentValue: 0.49,
        thresholdLabel: 'Threshold: < 0.60',
        sliderMin: 0.25,
        sliderMax: 0.75,
        step: 0.01,
        unit: '',
        formatValue: (v) => v.toFixed(2),
        getStatus: (v) => {
          if (v <= 0.45) return 'safe';
          if (v <= 0.52) return 'warning';
          if (v < 0.60) return 'danger';
          return 'beyond';
        },
        getImpact: (v) => {
          if (v <= 0.35)
            return 'Very equal society, similar to Scandinavian countries. Most people have a similar standard of living. Strong middle class, good social mobility. A kid from any background has a real shot at success.';
          if (v <= 0.45)
            return 'Moderate inequality, typical of most developed countries. There\'s a clear wealth gap, but a solid middle class exists. Social mobility is possible. Public services are generally well-funded.';
          if (v <= 0.50)
            return 'This is roughly where the U.S. is today — high inequality for a developed country. The rich are pulling away from everyone else. The middle class feels squeezed. Where you\'re born increasingly determines where you end up.';
          if (v < 0.55)
            return 'Inequality approaching levels typically seen in developing nations. The gap between rich neighborhoods and poor ones is stark and visible. Social tensions rise. Political polarization intensifies as people disagree on solutions.';
          if (v < 0.60)
            return 'Extreme inequality comparable to Brazil or South Africa. Gated communities and poverty exist side by side. Social mobility is nearly frozen. The "American Dream" feels like a myth for most people.';
          return 'BEYOND THE THRESHOLD. Inequality at this level threatens social stability. Historical parallels include pre-revolution France or the Gilded Age at its worst. Democracy itself is strained as economic power concentrates in fewer hands.';
        },
      },
      {
        id: 'top1_income',
        name: 'Top 1% Income Share',
        shortName: 'Top 1% Income',
        category: 'inequality',
        description:
          'What fraction of all income goes to the richest 1% of Americans? Currently about 20%. When this gets too high, it means economic growth mostly benefits the already wealthy.',
        currentValue: 20,
        thresholdLabel: 'Threshold: < 35%',
        sliderMin: 5,
        sliderMax: 50,
        step: 1,
        unit: '%',
        formatValue: (v) => `${v}%`,
        getStatus: (v) => {
          if (v <= 20) return 'safe';
          if (v <= 28) return 'warning';
          if (v < 35) return 'danger';
          return 'beyond';
        },
        getImpact: (v) => {
          if (v <= 15)
            return 'Income is broadly shared. The top 1% earns well, but the middle class captures most of the economy\'s gains. Similar to the post-WWII boom era when prosperity was widely felt.';
          if (v <= 22)
            return 'Today\'s reality. The top 1% takes a big slice, but the economy still works for most people — if imperfectly. Debate about tax policy and wealth redistribution is constant.';
          if (v <= 28)
            return 'Income is concentrating rapidly. The top 1% now captures over a quarter of all income. Workers\' wages stagnate while corporate profits and investment returns soar. Political pressure for reform builds.';
          if (v < 35)
            return 'Approaching "Gilded Age" levels of income concentration. A new class of ultra-wealthy Americans influences politics, media, and policy. The average worker sees little benefit from economic growth.';
          return 'BEYOND THE THRESHOLD. More than a third of all income goes to the top 1%. This level of concentration hasn\'t been seen in modern American history. Democracy and capitalism are in tension — the ultra-wealthy can effectively buy political outcomes.';
        },
      },
      {
        id: 'top01_wealth',
        name: 'Top 0.1% Wealth Share',
        shortName: 'Top 0.1% Wealth',
        category: 'inequality',
        description:
          'What percentage of all wealth (homes, stocks, savings, etc.) is owned by the richest 0.1% — that\'s about 330,000 people out of 330 million. Wealth is even more concentrated than income.',
        currentValue: 15,
        thresholdLabel: 'Threshold: < 30%',
        sliderMin: 5,
        sliderMax: 45,
        step: 1,
        unit: '%',
        formatValue: (v) => `${v}%`,
        getStatus: (v) => {
          if (v <= 18) return 'safe';
          if (v <= 24) return 'warning';
          if (v < 30) return 'danger';
          return 'beyond';
        },
        getImpact: (v) => {
          if (v <= 12)
            return 'Wealth is relatively well distributed. More people own homes, have retirement savings, and feel financially secure. Economic shocks are absorbed more easily because wealth is spread out.';
          if (v <= 18)
            return 'Current levels — the richest 0.1% owns about as much as the bottom 80% combined. Billionaires make headlines, but most people still have some wealth (a home, a car, some savings).';
          if (v <= 24)
            return 'Wealth concentration is accelerating. A few thousand families control a growing share of everything. Housing becomes unaffordable in many areas as wealthy investors buy up property. The wealth gap becomes a generational trap.';
          if (v < 30)
            return 'Near-feudal levels of wealth concentration. A tiny group of Americans controls nearly a third of all wealth. They own the companies, the real estate, the media. Economic power and political power are merging.';
          return 'BEYOND THE THRESHOLD. The top 0.1% — about 330,000 people — control 30%+ of all American wealth. This mirrors the worst historical examples of wealth concentration. Social mobility is essentially dead.';
        },
      },
      {
        id: 'median_mean_income',
        name: 'Median vs. Mean Household Income',
        shortName: 'Median/Mean Income',
        category: 'inequality',
        description:
          'Compares the "typical" household income (median — the middle point) to the average (mean — which is skewed by ultra-rich outliers). When the median falls far below the mean, it means most families are doing worse than the "average" suggests.',
        currentValue: 0,
        thresholdLabel: 'Threshold: median has not fallen more than 40% relative to mean',
        sliderMin: -55,
        sliderMax: 10,
        step: 1,
        unit: '% change',
        formatValue: (v) => `${v > 0 ? '+' : ''}${v}%`,
        getStatus: (v) => {
          if (v >= -10) return 'safe';
          if (v >= -25) return 'warning';
          if (v > -40) return 'danger';
          return 'beyond';
        },
        getImpact: (v) => {
          if (v >= -5 && v <= 5)
            return 'The median and mean are tracking closely. This means the "typical" family is experiencing roughly what the averages suggest. Economic gains and losses are broadly shared.';
          if (v >= -15 && v < -5)
            return 'The median is falling behind the mean. The "average" income statistic is increasingly misleading because a small number of very high earners pull it up. Most families aren\'t doing as well as the headline numbers suggest.';
          if (v >= -25 && v < -15)
            return 'A significant gap is opening. Politicians might cite "average income growth," but the typical family isn\'t feeling it. The rich are getting richer while the middle class treads water. This breeds resentment and distrust.';
          if (v > -40 && v < -25)
            return 'The median has plummeted relative to the mean. The "average" American is a statistical fiction — most people are doing much worse while a small elite pushes the average up. Society is splitting into two very different economic realities.';
          if (v <= -40)
            return 'BEYOND THE THRESHOLD. The typical household has fallen more than 40% relative to the average. We essentially have two economies: one for the wealthy elite, and one for everyone else. The numbers on the news bear no resemblance to most people\'s lived experience.';
          return 'Median is gaining on the mean. Middle-class families are seeing disproportionate gains. This is rare and very positive.';
        },
      },
    ],
  },
];

// Get all indicators as a flat array
export function getAllIndicators(): Indicator[] {
  return categories.flatMap((c) => c.indicators);
}

// Count threshold breaches
export function countBreaches(values: Record<string, number>): {
  breached: number;
  total: number;
  breachedIds: string[];
} {
  const indicators = getAllIndicators();
  const breachedIds: string[] = [];
  for (const ind of indicators) {
    const val = values[ind.id] ?? ind.currentValue;
    if (ind.getStatus(val) === 'beyond') {
      breachedIds.push(ind.id);
    }
  }
  return { breached: breachedIds.length, total: indicators.length, breachedIds };
}

// Calculate an overall "health score" from 0 (economy in ruins) to 100 (thriving)
export function calculateHealthScore(values: Record<string, number>): number {
  const indicators = getAllIndicators();
  let totalScore = 0;
  for (const ind of indicators) {
    const val = values[ind.id] ?? ind.currentValue;
    const status = ind.getStatus(val);
    switch (status) {
      case 'safe':
        totalScore += 100;
        break;
      case 'warning':
        totalScore += 65;
        break;
      case 'danger':
        totalScore += 30;
        break;
      case 'beyond':
        totalScore += 0;
        break;
    }
  }
  return Math.round(totalScore / indicators.length);
}

// Generate an overall narrative summary based on the scenario
export function generateNarrative(values: Record<string, number>): string {
  const score = calculateHealthScore(values);
  const { breached, breachedIds } = countBreaches(values);
  const indicators = getAllIndicators();

  // Count by status
  let safeCount = 0;
  let warningCount = 0;
  let dangerCount = 0;

  for (const ind of indicators) {
    const val = values[ind.id] ?? ind.currentValue;
    const status = ind.getStatus(val);
    if (status === 'safe') safeCount++;
    else if (status === 'warning') warningCount++;
    else if (status === 'danger') dangerCount++;
  }

  if (score >= 85) {
    return 'The economy is in strong shape. Most indicators are in healthy ranges, and the conditions set for 2029 are easily met. This scenario represents a stable, growing economy where most people can find work, earn decent wages, and plan for the future with confidence.';
  }
  if (score >= 65) {
    return `The economy is showing signs of strain. While ${safeCount} indicators remain healthy, ${warningCount + dangerCount} are in concerning territory. This resembles a period of transition — not a crisis yet, but one where certain groups (especially in ${warningCount > 2 ? 'multiple sectors' : 'specific sectors'}) are feeling real pressure. Policy decisions made now will determine whether things stabilize or deteriorate.`;
  }
  if (score >= 40) {
    return `The economy is in serious trouble. Only ${safeCount} indicators are in safe ranges, while ${dangerCount} are in danger zones${breached > 0 ? ` and ${breached} have crossed their thresholds entirely` : ''}. This is a scenario of widespread economic hardship — comparable to or worse than the 2008 financial crisis. Millions of Americans are struggling, and the social fabric is straining under the pressure.`;
  }
  if (breached === 0) {
    return `The economy is in crisis, though technically no single threshold has been fully breached. Nearly every indicator is flashing warning or danger. This is a scenario where the economy is failing on multiple fronts simultaneously — a "death by a thousand cuts" where no single problem is catastrophic, but together they paint a grim picture.`;
  }
  const breachedNames = breachedIds
    .map((id) => indicators.find((i) => i.id === id)?.shortName)
    .filter(Boolean)
    .slice(0, 4);
  return `The economy has crossed ${breached} threshold${breached > 1 ? 's' : ''}, including ${breachedNames.join(', ')}${breached > 4 ? ', and more' : ''}. This is an unprecedented economic catastrophe. The conditions set for 2029 have been violated, meaning the economy has deteriorated beyond what was considered the boundary of a functioning society. We are in uncharted territory where historical comparisons fail.`;
}
