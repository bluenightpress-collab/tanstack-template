import { useEffect, useState, useRef } from 'react'
import type { SentenceParse } from '../store/store'

interface SentenceDiagramProps {
  parse: SentenceParse
  animationPhase: string
}

interface DiagramNode {
  text: string
  x: number
  y: number
  width: number
  color: string
  role: string
  opacity: number
}

const PART_OF_SPEECH_LABELS: Record<string, string> = {
  noun: 'N',
  pronoun: 'PRO',
  verb: 'V',
  adjective: 'ADJ',
  adverb: 'ADV',
  preposition: 'PREP',
  conjunction: 'CONJ',
  interjection: 'INT',
  article: 'ART',
  determiner: 'DET',
}

export function SentenceDiagram({ parse, animationPhase }: SentenceDiagramProps) {
  const [nodes, setNodes] = useState<DiagramNode[]>([])
  const [lines, setLines] = useState<{ x1: number; y1: number; x2: number; y2: number; dashed?: boolean; opacity: number }[]>([])
  const [animStep, setAnimStep] = useState(0)
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [svgWidth, setSvgWidth] = useState(800)

  useEffect(() => {
    if (containerRef.current) {
      const observer = new ResizeObserver(entries => {
        for (const entry of entries) {
          setSvgWidth(Math.max(600, entry.contentRect.width - 32))
        }
      })
      observer.observe(containerRef.current)
      return () => observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (animationPhase === 'building') {
      setAnimStep(0)
      const timer = setInterval(() => {
        setAnimStep(prev => {
          if (prev >= 10) {
            clearInterval(timer)
            return 10
          }
          return prev + 1
        })
      }, 150)
      return () => clearInterval(timer)
    } else if (animationPhase === 'complete') {
      setAnimStep(10)
    }
  }, [animationPhase])

  useEffect(() => {
    if (!parse) return

    const newNodes: DiagramNode[] = []
    const newLines: { x1: number; y1: number; x2: number; y2: number; dashed?: boolean; opacity: number }[] = []

    const baselineY = 120
    const modifierY = 200
    const prepY = 270
    const padding = 40
    const charWidth = 10

    // Calculate widths
    const subjectWidth = Math.max(80, (parse.subject?.length || 5) * charWidth + padding)
    const predicateWidth = Math.max(80, (parse.predicate?.length || 5) * charWidth + padding)
    const doWidth = parse.directObject ? Math.max(80, parse.directObject.length * charWidth + padding) : 0
    const ioWidth = parse.indirectObject ? Math.max(70, parse.indirectObject.length * charWidth + padding) : 0

    const totalMainWidth = subjectWidth + predicateWidth + doWidth + ioWidth + 60
    const startX = Math.max(40, (svgWidth - totalMainWidth) / 2)

    let currentX = startX

    // Subject
    const subjectNode: DiagramNode = {
      text: parse.subject || '(none)',
      x: currentX,
      y: baselineY,
      width: subjectWidth,
      color: '#60a5fa',
      role: 'subject',
      opacity: animStep >= 1 ? 1 : 0,
    }
    newNodes.push(subjectNode)
    currentX += subjectWidth

    // Subject-predicate divider (vertical line)
    const dividerX = currentX
    newLines.push({
      x1: dividerX,
      y1: baselineY - 30,
      x2: dividerX,
      y2: baselineY + 15,
      opacity: animStep >= 2 ? 1 : 0,
    })

    // Predicate
    const predicateNode: DiagramNode = {
      text: parse.predicate || '(none)',
      x: currentX + 10,
      y: baselineY,
      width: predicateWidth,
      color: '#f87171',
      role: 'predicate',
      opacity: animStep >= 2 ? 1 : 0,
    }
    newNodes.push(predicateNode)
    currentX += predicateWidth + 10

    // Direct object divider and node
    if (parse.directObject) {
      newLines.push({
        x1: currentX,
        y1: baselineY - 10,
        x2: currentX,
        y2: baselineY + 15,
        opacity: animStep >= 3 ? 1 : 0,
      })

      const doNode: DiagramNode = {
        text: parse.directObject,
        x: currentX + 10,
        y: baselineY,
        width: doWidth,
        color: '#60a5fa',
        role: 'direct object',
        opacity: animStep >= 3 ? 1 : 0,
      }
      newNodes.push(doNode)
      currentX += doWidth + 10
    }

    // Indirect object
    if (parse.indirectObject) {
      const ioNode: DiagramNode = {
        text: parse.indirectObject,
        x: predicateNode.x + predicateWidth / 2 - ioWidth / 2,
        y: modifierY + 20,
        width: ioWidth,
        color: '#818cf8',
        role: 'indirect object',
        opacity: animStep >= 4 ? 1 : 0,
      }
      newNodes.push(ioNode)

      // Diagonal line from predicate to indirect object
      newLines.push({
        x1: predicateNode.x + predicateWidth / 2,
        y1: baselineY + 15,
        x2: ioNode.x + ioWidth / 2,
        y2: modifierY + 10,
        dashed: false,
        opacity: animStep >= 4 ? 1 : 0,
      })
    }

    // Baseline
    newLines.push({
      x1: startX,
      y1: baselineY + 15,
      x2: currentX,
      y2: baselineY + 15,
      opacity: animStep >= 1 ? 1 : 0,
    })

    // Subject modifiers
    if (parse.subjectModifiers && parse.subjectModifiers.length > 0) {
      const modSpacing = subjectWidth / (parse.subjectModifiers.length + 1)
      parse.subjectModifiers.forEach((mod, i) => {
        const modX = subjectNode.x + modSpacing * (i + 1)
        const modNode: DiagramNode = {
          text: mod,
          x: modX - 20,
          y: modifierY,
          width: Math.max(50, mod.length * charWidth + 10),
          color: '#34d399',
          role: 'modifier',
          opacity: animStep >= 5 ? 1 : 0,
        }
        newNodes.push(modNode)

        // Diagonal line from baseline to modifier
        newLines.push({
          x1: modX,
          y1: baselineY + 15,
          x2: modX - 15,
          y2: modifierY - 10,
          dashed: false,
          opacity: animStep >= 5 ? 1 : 0,
        })
      })
    }

    // Predicate modifiers
    if (parse.predicateModifiers && parse.predicateModifiers.length > 0) {
      const modSpacing = predicateWidth / (parse.predicateModifiers.length + 1)
      parse.predicateModifiers.forEach((mod, i) => {
        const modX = predicateNode.x + modSpacing * (i + 1)
        const modNode: DiagramNode = {
          text: mod,
          x: modX - 20,
          y: modifierY,
          width: Math.max(50, mod.length * charWidth + 10),
          color: '#fbbf24',
          role: 'modifier',
          opacity: animStep >= 6 ? 1 : 0,
        }
        newNodes.push(modNode)

        newLines.push({
          x1: modX,
          y1: baselineY + 15,
          x2: modX - 15,
          y2: modifierY - 10,
          dashed: false,
          opacity: animStep >= 6 ? 1 : 0,
        })
      })
    }

    // Object modifiers
    if (parse.objectModifiers && parse.objectModifiers.length > 0 && parse.directObject) {
      const doStartX = newNodes.find(n => n.role === 'direct object')?.x || currentX - doWidth
      const modSpacing = doWidth / (parse.objectModifiers.length + 1)
      parse.objectModifiers.forEach((mod, i) => {
        const modX = doStartX + modSpacing * (i + 1)
        const modNode: DiagramNode = {
          text: mod,
          x: modX - 20,
          y: modifierY,
          width: Math.max(50, mod.length * charWidth + 10),
          color: '#34d399',
          role: 'modifier',
          opacity: animStep >= 7 ? 1 : 0,
        }
        newNodes.push(modNode)

        newLines.push({
          x1: modX,
          y1: baselineY + 15,
          x2: modX - 15,
          y2: modifierY - 10,
          dashed: false,
          opacity: animStep >= 7 ? 1 : 0,
        })
      })
    }

    // Prepositional phrases
    if (parse.prepositionalPhrases && parse.prepositionalPhrases.length > 0) {
      parse.prepositionalPhrases.forEach((pp, i) => {
        const ppX = startX + 60 + i * 160
        const prepNode: DiagramNode = {
          text: pp.preposition,
          x: ppX,
          y: prepY - 30,
          width: Math.max(40, pp.preposition.length * charWidth + 10),
          color: '#a78bfa',
          role: 'preposition',
          opacity: animStep >= 8 ? 1 : 0,
        }
        newNodes.push(prepNode)

        const objNode: DiagramNode = {
          text: pp.object,
          x: ppX + 10,
          y: prepY + 10,
          width: Math.max(60, pp.object.length * charWidth + 10),
          color: '#60a5fa',
          role: 'prep object',
          opacity: animStep >= 8 ? 1 : 0,
        }
        newNodes.push(objNode)

        // Line connecting prep phrase
        newLines.push({
          x1: ppX + 20,
          y1: modifierY + 10,
          x2: ppX,
          y2: prepY - 40,
          dashed: false,
          opacity: animStep >= 8 ? 1 : 0,
        })

        // Horizontal line under prep object
        newLines.push({
          x1: ppX,
          y1: prepY + 25,
          x2: ppX + objNode.width + 20,
          y2: prepY + 25,
          opacity: animStep >= 8 ? 1 : 0,
        })
      })
    }

    setNodes(newNodes)
    setLines(newLines)
  }, [parse, animStep, svgWidth])

  const svgHeight = 340

  return (
    <div ref={containerRef} className="w-full">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full"
        style={{ maxHeight: '400px' }}
      >
        {/* Background grid pattern */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(148, 163, 184, 0.05)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Lines */}
        {lines.map((line, i) => (
          <line
            key={`line-${i}`}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="rgba(148, 163, 184, 0.6)"
            strokeWidth="2"
            strokeDasharray={line.dashed ? '4 4' : undefined}
            style={{
              opacity: line.opacity,
              transition: 'opacity 0.4s ease-in-out',
            }}
          />
        ))}

        {/* Nodes */}
        {nodes.map((node, i) => (
          <g
            key={`node-${i}`}
            style={{
              opacity: node.opacity,
              transition: 'opacity 0.4s ease-in-out, transform 0.4s ease-in-out',
              transform: node.opacity ? 'translateY(0)' : 'translateY(-10px)',
            }}
          >
            <text
              x={node.x + node.width / 2}
              y={node.y}
              textAnchor="middle"
              fill={node.color}
              fontSize="16"
              fontWeight="600"
              fontFamily="'Segoe UI', system-ui, sans-serif"
            >
              {node.text}
            </text>
            {/* Part of speech label */}
            {parse.words && (() => {
              const wordInfo = parse.words.find(
                w => w.word.toLowerCase() === node.text.toLowerCase()
              )
              if (wordInfo) {
                return (
                  <text
                    x={node.x + node.width / 2}
                    y={node.y + 16}
                    textAnchor="middle"
                    fill="rgba(148, 163, 184, 0.6)"
                    fontSize="9"
                    fontFamily="'Segoe UI', system-ui, sans-serif"
                  >
                    {PART_OF_SPEECH_LABELS[wordInfo.partOfSpeech] || wordInfo.partOfSpeech.toUpperCase()}
                  </text>
                )
              }
              return null
            })()}
          </g>
        ))}

        {/* Sentence type badge */}
        {animStep >= 9 && (
          <g style={{ opacity: animStep >= 9 ? 1 : 0, transition: 'opacity 0.5s' }}>
            <rect
              x={svgWidth - 170}
              y={15}
              width={150}
              height={28}
              rx={14}
              fill="rgba(99, 102, 241, 0.15)"
              stroke="rgba(99, 102, 241, 0.3)"
              strokeWidth="1"
            />
            <text
              x={svgWidth - 95}
              y={34}
              textAnchor="middle"
              fill="#818cf8"
              fontSize="11"
              fontWeight="500"
              fontFamily="'Segoe UI', system-ui, sans-serif"
            >
              {parse.sentenceType} / {parse.complexity}
            </text>
          </g>
        )}
      </svg>

      {/* Part of speech legend */}
      <div className="flex flex-wrap justify-center gap-3 mt-3 px-4">
        {[
          { label: 'Noun', color: '#60a5fa' },
          { label: 'Verb', color: '#f87171' },
          { label: 'Adjective', color: '#34d399' },
          { label: 'Adverb', color: '#fbbf24' },
          { label: 'Preposition', color: '#a78bfa' },
          { label: 'Conjunction', color: '#fb923c' },
          { label: 'Pronoun', color: '#818cf8' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-1.5 text-xs">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-slate-400">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
