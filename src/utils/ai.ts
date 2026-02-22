import { createServerFn } from '@tanstack/react-start'
import { Anthropic } from '@anthropic-ai/sdk'
import type { DiagramResult, SentenceParse } from '../store/store'

const SENTENCE_PARSE_SYSTEM_PROMPT = `You are a sentence diagramming expert and encouraging writing teacher. Your job is to analyze sentences and return structured JSON for rendering Reed-Kellogg style diagrams.

You must ALWAYS respond with valid JSON matching this exact schema (no markdown, no code fences, just raw JSON):

{
  "parse": {
    "sentence": "the original sentence",
    "words": [
      { "word": "the word", "partOfSpeech": "noun|verb|adjective|adverb|preposition|conjunction|pronoun|interjection|article|determiner", "role": "subject|predicate|directObject|indirectObject|subjectModifier|predicateModifier|objectModifier|prepositionalPhrase|conjunction|interjection", "modifies": "word it modifies or null", "color": "hex color for this part of speech" }
    ],
    "subject": "the subject word(s)",
    "predicate": "the predicate/verb word(s)",
    "directObject": "direct object or null",
    "indirectObject": "indirect object or null",
    "subjectModifiers": ["words modifying the subject"],
    "predicateModifiers": ["words modifying the predicate"],
    "objectModifiers": ["words modifying any object"],
    "prepositionalPhrases": [
      { "preposition": "prep word", "object": "object of prep", "modifiers": ["modifiers of prep object"] }
    ],
    "clauses": [
      { "type": "independent|dependent|relative|adverbial", "content": "clause content" }
    ],
    "sentenceType": "declarative|interrogative|imperative|exclamatory",
    "complexity": "simple|compound|complex|compound-complex"
  },
  "feedback": "A 1-2 sentence educational comment about the grammar structure used. Be specific about what makes this sentence interesting or how it could be improved.",
  "encouragement": "A warm, specific encouraging message to the student. Reference something they did well. Be genuine, not generic.",
  "syntaxIssues": ["List any grammar or syntax problems. Empty array if none."],
  "improvementSuggestions": ["2-3 specific suggestions for making the sentence more engaging, vivid, or complex. Always suggest ways to make writing more exciting."],
  "complexityScore": 5
}

Color scheme for parts of speech (use these exact colors):
- noun: #60a5fa (blue)
- pronoun: #818cf8 (indigo)
- verb: #f87171 (red)
- adjective: #34d399 (green)
- adverb: #fbbf24 (yellow)
- preposition: #a78bfa (purple)
- conjunction: #fb923c (orange)
- interjection: #f472b6 (pink)
- article/determiner: #94a3b8 (gray)

Rules:
1. Handle ANY input, even fragments or badly formed sentences. Identify issues in syntaxIssues.
2. For fragments, still parse what you can and explain what's missing.
3. complexityScore: 1-2 for fragments, 3-4 for simple, 5-6 for compound, 7-8 for complex, 9-10 for compound-complex with rich modifiers.
4. Always be encouraging. Find something positive even in problematic sentences.
5. Suggestions should push students toward more vivid, varied writing.
6. If a sentence is a question, parse the underlying declarative structure.
7. For imperative sentences, note the implied "you" subject.`

export const parseSentence = createServerFn({ method: 'POST' })
  .validator((d: { sentence: string }) => d)
  .handler(async ({ data }) => {
    const apiKey = process.env.ANTHROPIC_API_KEY

    if (!apiKey) {
      throw new Error(
        'Missing API key: Please set ANTHROPIC_API_KEY in your environment variables or .env file.'
      )
    }

    const anthropic = new Anthropic({
      apiKey,
      timeout: 30000,
    })

    try {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 2048,
        system: SENTENCE_PARSE_SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: `Parse this sentence and return the JSON diagram data: "${data.sentence}"`,
          },
        ],
      })

      const textContent = response.content.find(block => block.type === 'text')
      if (!textContent || textContent.type !== 'text') {
        throw new Error('No text response from AI')
      }

      // Parse the JSON response
      let parsed
      try {
        parsed = JSON.parse(textContent.text)
      } catch {
        // Try to extract JSON from the response if it has extra text
        const jsonMatch = textContent.text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[0])
        } else {
          throw new Error('Failed to parse AI response as JSON')
        }
      }

      const result: DiagramResult = {
        id: Date.now().toString(),
        sentence: data.sentence,
        parse: parsed.parse as SentenceParse,
        feedback: parsed.feedback,
        encouragement: parsed.encouragement,
        syntaxIssues: parsed.syntaxIssues || [],
        improvementSuggestions: parsed.improvementSuggestions || [],
        complexityScore: parsed.complexityScore || 3,
        timestamp: Date.now(),
      }

      return result
    } catch (error) {
      console.error('Error in parseSentence:', error)

      let errorMessage = 'Failed to parse sentence'

      if (error instanceof Error) {
        if (error.message.includes('rate limit')) {
          errorMessage = 'Rate limit exceeded. Please try again in a moment.'
        } else if (error.message.includes('Connection error') || error.name === 'APIConnectionError') {
          errorMessage = 'Connection to AI failed. Please check your internet connection.'
        } else if (error.message.includes('authentication')) {
          errorMessage = 'Authentication failed. Please check your API key.'
        } else {
          errorMessage = error.message
        }
      }

      return { error: errorMessage } as any
    }
  })
