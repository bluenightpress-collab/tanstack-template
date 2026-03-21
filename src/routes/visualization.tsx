import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, useRef, useCallback } from 'react'

export const Route = createFileRoute('/visualization')({
  head: () => ({
    meta: [
      { title: 'The Cost of War — What $24 Billion Buys' },
      {
        name: 'description',
        content:
          'An interactive visualization comparing US military spending on Iran with humanitarian aid cuts.',
      },
    ],
  }),
  component: Visualization,
})

/* ─── data ─── */

const COMPARISONS = [
  {
    id: 'ticker',
    category: 'THE PRICE TAG',
    headline: 'The war costs $11,000 every second.',
    subhead:
      'Since Feb 28, the Pentagon has spent $24 billion bombing Iran — $41 million an hour.',
    left: {
      label: 'Spent on war per second',
      value: 11000,
      unit: '',
      color: 'red',
    },
    right: {
      label: 'Children fed for a year in Kenya at that rate',
      value: 91,
      unit: ' children',
      color: 'green',
      note: 'At $120/year per child through aid organizations',
    },
  },
  {
    id: 'school',
    category: 'THE SCHOOL',
    headline: 'One missile killed 175 children at a girls\u2019 school.',
    subhead:
      'A single Tomahawk cruise missile — cost: $3.5 million — struck Shajareh Tayyebeh Elementary in Minab, Iran on February 28. Most victims were girls aged 7\u201312.',
    left: {
      label: 'Cost of one Tomahawk missile',
      value: 3500000,
      unit: '',
      color: 'red',
    },
    right: {
      label: 'Children that money could feed for a full year in Kenya',
      value: 29166,
      unit: ' children',
      color: 'green',
      note: 'At $120/year per child — over 166× the number killed',
    },
  },
  {
    id: 'vaccines',
    category: 'THE CHILDREN',
    headline:
      '136 children\u2019s vaccine grants were cancelled to save $1.87 billion.',
    subhead:
      'The same amount of money was spent on roughly 850 Tomahawk missiles.',
    left: {
      label: 'Cost of 850 Tomahawk missiles',
      value: 1870000000,
      unit: '',
      color: 'red',
    },
    right: {
      label: 'Cancelled children\u2019s vaccination grants',
      value: 136,
      unit: ' grants',
      color: 'amber',
      note: 'Protecting millions of children from preventable disease',
    },
  },
  {
    id: 'snap',
    category: 'THE HUNGER',
    headline: '$186 billion cut from food stamps. The largest cut in history.',
    subhead:
      '22.3 million families will lose some or all SNAP benefits. 16 million children affected. Meanwhile, the Pentagon wants $200 billion more for Iran.',
    left: {
      label: 'Pentagon\u2019s new request for Iran war',
      value: 200000000000,
      unit: '',
      color: 'red',
    },
    right: {
      label: 'SNAP cuts through 2034',
      value: 186000000000,
      unit: '',
      color: 'amber',
      note: '22.3 million families lose benefits — to "save money"',
    },
  },
  {
    id: 'medicaid',
    category: 'THE HEALTH',
    headline:
      '$793 billion slashed from Medicaid. 10 million will lose insurance.',
    subhead:
      'The cost of the Iran war so far ($24B) could fund Medicaid for millions. Instead, both are being defunded while bombs fall.',
    left: {
      label: 'Iran war spending so far',
      value: 24000000000,
      unit: '',
      color: 'red',
    },
    right: {
      label: 'Could provide a year of school meals for',
      value: 28985507,
      unit: ' children',
      color: 'green',
      note: 'Every child currently receiving school lunch in the US (29M)',
    },
  },
  {
    id: 'kenya',
    category: 'THE STARVATION',
    headline:
      '54 children died of starvation in Kenya after USAID was gutted.',
    subhead:
      '500 tons of food aid was burned because DOGE cuts caused distribution delays. Clinics ran out of therapeutic food for months.',
    left: {
      label: 'Food aid burned due to DOGE delays',
      value: 500,
      unit: ' tons',
      color: 'red',
    },
    right: {
      label: 'Children who died of starvation in Kenya in 2025',
      value: 54,
      unit: ' children',
      color: 'amber',
      note: 'While 87,200 more children under 5 need treatment for malnutrition in Turkana alone',
    },
  },
  {
    id: 'teachers',
    category: 'THE FUTURE',
    headline: '$24 billion could pay 166,000 teachers for a year.',
    subhead:
      'That\u2019s the entire teaching workforce of Florida. Instead, it bought three weeks of bombing.',
    left: {
      label: 'Weeks of bombing Iran',
      value: 3,
      unit: ' weeks',
      color: 'red',
    },
    right: {
      label: 'Teachers\u2019 annual salaries that money could fund',
      value: 166000,
      unit: ' teachers',
      color: 'green',
      note: 'Equivalent to every teacher in the state of Florida',
    },
  },
  {
    id: 'wic',
    category: 'THE MOTHERS',
    headline:
      'WIC fruit & vegetable benefits slashed from $47 to $13 per month.',
    subhead:
      'Pregnant women and young children get less fresh food. The WIC program was cut $300 million. One day of bombing Iran costs $500 million.',
    left: {
      label: 'Cost of one day of bombing Iran',
      value: 500000000,
      unit: '',
      color: 'red',
    },
    right: {
      label: 'Entire annual WIC cut that harms millions of mothers & children',
      value: 300000000,
      unit: '',
      color: 'amber',
      note: 'Less than a single day of war spending',
    },
  },
]

/* ─── helpers ─── */

function formatNumber(n: number): string {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`
  return `$${n.toLocaleString()}`
}

function formatPlain(n: number): string {
  return n.toLocaleString()
}

/* ─── animated counter ─── */

function AnimatedCounter({
  end,
  duration = 2000,
  isMoney,
  suffix = '',
  started,
}: {
  end: number
  duration?: number
  isMoney: boolean
  suffix?: string
  started: boolean
}) {
  const [current, setCurrent] = useState(0)
  const rafRef = useRef<number>()

  useEffect(() => {
    if (!started) {
      setCurrent(0)
      return
    }
    const startTime = performance.now()
    const animate = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCurrent(Math.round(end * eased))
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      }
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [end, duration, started])

  const display = isMoney ? formatNumber(current) : formatPlain(current)
  return (
    <span>
      {display}
      {suffix}
    </span>
  )
}

/* ─── live war cost ticker ─── */

function WarCostTicker() {
  // War started Feb 28 2026. Approx $24B spent as of ~March 21.
  // ~$11,000/second
  const WAR_START = new Date('2026-02-28T00:00:00Z').getTime()
  const COST_PER_MS = 11000 / 1000 // $11 per millisecond
  const [cost, setCost] = useState(0)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const tick = () => {
      const now = Date.now()
      const ms = now - WAR_START
      setCost(ms * COST_PER_MS)
      setElapsed(ms)
    }
    tick()
    const id = setInterval(tick, 50)
    return () => clearInterval(id)
  }, [])

  const days = Math.floor(elapsed / 86400000)
  const hours = Math.floor((elapsed % 86400000) / 3600000)
  const minutes = Math.floor((elapsed % 3600000) / 60000)
  const seconds = Math.floor((elapsed % 60000) / 1000)

  const childrenFeedable = Math.floor(cost / 120)
  const teachersFundable = Math.floor(cost / 145000)
  const schoolLunches = Math.floor(cost / 3.09)

  return (
    <div className="relative overflow-hidden rounded-2xl border border-red-900/50 bg-gradient-to-br from-red-950/80 to-slate-950 p-6 md:p-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(220,38,38,0.15),transparent_70%)]" />
      <div className="relative">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-red-400">
          Live counter — estimated cost since Feb 28, 2026
        </p>
        <p className="mb-1 font-mono text-4xl font-black tracking-tight text-red-400 md:text-6xl">
          ${cost >= 1e12 ? (cost / 1e12).toFixed(3) + 'T' : cost >= 1e9 ? (cost / 1e9).toFixed(3) + 'B' : (cost / 1e6).toFixed(2) + 'M'}
        </p>
        <p className="mb-6 font-mono text-sm text-red-300/70">
          {days}d {hours}h {minutes}m {seconds}s elapsed
        </p>

        <div className="grid gap-4 md:grid-cols-3">
          <Stat
            value={childrenFeedable.toLocaleString()}
            label="children could be fed for a year in Kenya"
            color="emerald"
          />
          <Stat
            value={teachersFundable.toLocaleString()}
            label="teacher salaries for a year"
            color="blue"
          />
          <Stat
            value={schoolLunches.toLocaleString()}
            label="school lunches in the US"
            color="amber"
          />
        </div>
      </div>
    </div>
  )
}

function Stat({
  value,
  label,
  color,
}: {
  value: string
  label: string
  color: string
}) {
  const colors: Record<string, string> = {
    emerald: 'text-emerald-400',
    blue: 'text-blue-400',
    amber: 'text-amber-400',
  }
  return (
    <div className="rounded-lg border border-white/5 bg-white/5 p-4">
      <p className={`font-mono text-2xl font-bold ${colors[color]}`}>{value}</p>
      <p className="mt-1 text-xs text-slate-400">{label}</p>
    </div>
  )
}

/* ─── comparison card ─── */

function ComparisonCard({ data, index }: { data: (typeof COMPARISONS)[0]; index: number }) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
        }
      },
      { threshold: 0.2 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const leftIsMoney = data.left.unit === ''
  const rightIsMoney = data.right.unit === ''

  const bgGradients: Record<string, string> = {
    red: 'from-red-950/40 to-slate-950',
    amber: 'from-amber-950/30 to-slate-950',
    green: 'from-emerald-950/30 to-slate-950',
  }

  const borderColors: Record<string, string> = {
    red: 'border-red-900/40',
    amber: 'border-amber-900/40',
    green: 'border-emerald-900/40',
  }

  const categoryColors: Record<string, string> = {
    red: 'text-red-500',
    amber: 'text-amber-500',
    green: 'text-emerald-500',
  }

  const valueColors: Record<string, string> = {
    red: 'text-red-400',
    amber: 'text-amber-400',
    green: 'text-emerald-400',
  }

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
    >
      <div className={`overflow-hidden rounded-2xl border ${borderColors[data.left.color]} bg-gradient-to-br ${bgGradients[data.left.color]}`}>
        <div className="p-6 md:p-10">
          <p
            className={`mb-3 text-xs font-bold uppercase tracking-[0.25em] ${categoryColors[data.left.color]}`}
          >
            {data.category}
          </p>
          <h3 className="mb-3 text-2xl font-black leading-tight text-white md:text-3xl">
            {data.headline}
          </h3>
          <p className="mb-8 max-w-2xl text-sm leading-relaxed text-slate-400 md:text-base">
            {data.subhead}
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            {/* LEFT — war / destruction */}
            <div className="rounded-xl border border-red-900/30 bg-red-950/30 p-5">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-red-400/70">
                {data.left.label}
              </p>
              <p className="font-mono text-3xl font-black text-red-400 md:text-4xl">
                <AnimatedCounter
                  end={data.left.value}
                  isMoney={leftIsMoney}
                  suffix={data.left.unit}
                  started={visible}
                  duration={2500}
                />
              </p>
            </div>

            {/* RIGHT — what it could have been */}
            <div
              className={`rounded-xl border p-5 ${
                data.right.color === 'green'
                  ? 'border-emerald-900/30 bg-emerald-950/30'
                  : 'border-amber-900/30 bg-amber-950/30'
              }`}
            >
              <p
                className={`mb-1 text-xs font-semibold uppercase tracking-wider ${
                  data.right.color === 'green'
                    ? 'text-emerald-400/70'
                    : 'text-amber-400/70'
                }`}
              >
                {data.right.label}
              </p>
              <p
                className={`font-mono text-3xl font-black md:text-4xl ${valueColors[data.right.color]}`}
              >
                <AnimatedCounter
                  end={data.right.value}
                  isMoney={rightIsMoney}
                  suffix={data.right.unit}
                  started={visible}
                  duration={2500}
                />
              </p>
              {data.right.note && (
                <p className="mt-2 text-xs text-slate-500">{data.right.note}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── human cost visualizer — dots representing children ─── */

function DotGrid({
  count,
  label,
  color,
  started,
}: {
  count: number
  label: string
  color: string
  started: boolean
}) {
  const displayCount = Math.min(count, 175)
  const [revealed, setRevealed] = useState(0)

  useEffect(() => {
    if (!started) return
    let i = 0
    const id = setInterval(() => {
      i++
      setRevealed(i)
      if (i >= displayCount) clearInterval(id)
    }, 30)
    return () => clearInterval(id)
  }, [started, displayCount])

  const dotColor =
    color === 'red' ? 'bg-red-500' : color === 'amber' ? 'bg-amber-500' : 'bg-emerald-500'

  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <div className="flex flex-wrap gap-[3px]">
        {Array.from({ length: displayCount }).map((_, i) => (
          <div
            key={i}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              i < revealed ? dotColor : 'bg-slate-800'
            } ${i < revealed ? 'scale-100 opacity-100' : 'scale-50 opacity-30'}`}
          />
        ))}
      </div>
      <p className="mt-2 text-xs text-slate-500">
        Each dot = 1 person.{' '}
        {count > 175 && `Showing 175 of ${count.toLocaleString()}.`}
      </p>
    </div>
  )
}

function HumanCostSection() {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.15 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
    >
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6 md:p-10">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-red-500">
          EACH DOT IS A CHILD
        </p>
        <h3 className="mb-3 text-2xl font-black text-white md:text-3xl">
          175 schoolgirls killed. The missile cost $3.5 million.
        </h3>
        <p className="mb-8 text-sm text-slate-400 md:text-base">
          That same $3.5M could feed 29,166 Kenyan children for a year. Below, each dot
          is one child — the 175 who were killed, and just a fraction of those who could
          have been saved.
        </p>

        <div className="grid gap-8 md:grid-cols-2">
          <DotGrid
            count={175}
            label="Children killed at Minab school — Feb 28, 2026"
            color="red"
            started={visible}
          />
          <DotGrid
            count={29166}
            label="Children feedable for 1 year with the cost of that one missile"
            color="emerald"
            started={visible}
          />
        </div>
      </div>
    </div>
  )
}

/* ─── sources ─── */

const SOURCES = [
  {
    name: 'Lever News',
    desc: 'The Aid Cuts Before the Iran Missile Strikes',
    url: 'https://www.levernews.com/the-aid-cuts-before-the-iran-missile-strikes/',
  },
  {
    name: 'CSIS',
    desc: 'Iran War Cost Estimate Update',
    url: 'https://www.csis.org/analysis/iran-war-cost-estimate-update-113-billion-day-6-165-billion-day-12',
  },
  {
    name: 'TIME',
    desc: 'What US Spending on the War in Iran Could Fund Instead',
    url: 'https://time.com/article/2026/03/16/what-us-spending-on-the-war-in-iran-could-fund-instead/',
  },
  {
    name: 'Amnesty International',
    desc: 'US Strike on School Killed Over 100 Children',
    url: 'https://www.amnesty.org/en/latest/news/2026/03/usa-iran-those-responsible-for-deadly-and-unlawful-us-strike-on-school-that-killed-over-100-children-must-be-held-accountable/',
  },
  {
    name: 'Al Jazeera',
    desc: 'Who Bombed the Iranian Girls\u2019 School?',
    url: 'https://www.aljazeera.com/news/2026/3/12/who-bombed-the-iranian-girls-school-killing-more-than-170-what-we-know',
  },
  {
    name: 'ProPublica',
    desc: 'After Trump Cuts to Kenya Food Aid, Children Died',
    url: 'https://www.propublica.org/article/kenya-trump-usaid-world-food-program-starvation-children-deaths',
  },
  {
    name: 'CNN',
    desc: 'House GOP Proposed $1 Trillion in Medicaid and SNAP Cuts',
    url: 'https://www.cnn.com/2025/05/21/politics/medicaid-food-stamps-gop-proposed-cuts',
  },
  {
    name: 'CNBC',
    desc: 'Trump\u2019s Bill Cuts SNAP for Millions',
    url: 'https://www.cnbc.com/2025/07/10/trumps-big-beautiful-bill-cuts-snap-for-millions-of-families.html',
  },
  {
    name: 'UNESCO',
    desc: 'Bombing of Iran Primary School a Grave Violation',
    url: 'https://news.un.org/en/story/2026/03/1167063',
  },
]

/* ─── main page ─── */

function Visualization() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <header className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden px-4 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(127,29,29,0.2),transparent_70%)]" />
        <div className="relative max-w-3xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-red-500">
            An interactive visualization
          </p>
          <h1 className="mb-6 text-4xl font-black leading-[1.1] tracking-tight md:text-6xl lg:text-7xl">
            <span className="text-red-400">$24,000,000,000</span>
            <br />
            <span className="text-slate-300">for bombs.</span>
          </h1>
          <p className="mx-auto mb-4 max-w-xl text-lg text-slate-400 md:text-xl">
            The US has spent $24 billion in three weeks bombing Iran while
            slashing food, health care, and aid for the most vulnerable people
            on earth.
          </p>
          <p className="mx-auto max-w-lg text-sm text-slate-500">
            This page puts those numbers side by side, so you can see what that
            money bought — and what it could have bought instead.
          </p>
          <div className="mt-10 animate-bounce text-slate-600">
            <svg className="mx-auto h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            <p className="mt-1 text-xs">Scroll</p>
          </div>
        </div>
      </header>

      {/* Live Ticker */}
      <section className="mx-auto max-w-4xl px-4 py-12">
        <WarCostTicker />
      </section>

      {/* Human Cost Dots */}
      <section className="mx-auto max-w-4xl px-4 py-8">
        <HumanCostSection />
      </section>

      {/* Comparison Cards */}
      <section className="mx-auto max-w-4xl space-y-10 px-4 py-8">
        {COMPARISONS.map((c, i) => (
          <ComparisonCard key={c.id} data={c} index={i} />
        ))}
      </section>

      {/* Pull quote */}
      <section className="mx-auto max-w-3xl px-4 py-16 text-center">
        <blockquote className="text-xl font-medium italic leading-relaxed text-slate-300 md:text-2xl">
          &ldquo;While there is no money for 15 million Americans who lost
          their health care, there&rsquo;s a billion dollars a day to spend on
          bombing Iran.&rdquo;
        </blockquote>
        <p className="mt-4 text-sm text-slate-500">— Sen. Elizabeth Warren</p>
      </section>

      {/* Final statement */}
      <section className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h2 className="mb-6 text-3xl font-black text-white md:text-4xl">
          The money exists. The priorities don&rsquo;t.
        </h2>
        <div className="mx-auto max-w-xl space-y-4 text-left text-sm leading-relaxed text-slate-400">
          <p>
            <span className="font-bold text-red-400">$24 billion</span> has
            been spent on three weeks of war. The Pentagon wants{' '}
            <span className="font-bold text-red-400">$200 billion more</span>.
          </p>
          <p>
            <span className="font-bold text-amber-400">$186 billion</span> was
            cut from food stamps — the largest cut in history — affecting{' '}
            <span className="font-bold text-amber-400">
              16 million children
            </span>
            .
          </p>
          <p>
            <span className="font-bold text-amber-400">$793 billion</span> was
            slashed from Medicaid, leaving{' '}
            <span className="font-bold text-amber-400">
              10 million more Americans
            </span>{' '}
            without health insurance.
          </p>
          <p>
            <span className="font-bold text-amber-400">500 tons</span> of food
            aid was{' '}
            <span className="font-bold text-amber-400">
              burned and left to rot
            </span>{' '}
            because of DOGE-created chaos at USAID.
          </p>
          <p>
            <span className="font-bold text-emerald-400">
              175 schoolgirls
            </span>{' '}
            are dead in Minab. The Pentagon says it was a{' '}
            <span className="italic">&ldquo;targeting error.&rdquo;</span>
          </p>
          <p>
            The numbers are too large to feel. That&rsquo;s the point. Scroll
            back up and watch the counter. Every second,{' '}
            <span className="font-bold text-red-400">$11,000</span> more is
            spent.
          </p>
        </div>
      </section>

      {/* Sources */}
      <footer className="border-t border-slate-800/50 bg-slate-950 px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <h3 className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
            Sources
          </h3>
          <ul className="grid gap-3 md:grid-cols-2">
            {SOURCES.map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-lg border border-slate-800/50 p-3 transition-colors hover:border-slate-700 hover:bg-slate-900/50"
                >
                  <p className="text-sm font-semibold text-slate-300 group-hover:text-white">
                    {s.name}
                  </p>
                  <p className="text-xs text-slate-500">{s.desc}</p>
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-center text-xs text-slate-600">
            Data sourced from publicly available reporting as of March 2026.
            Figures are estimates based on available data.
          </p>
        </div>
      </footer>
    </div>
  )
}
