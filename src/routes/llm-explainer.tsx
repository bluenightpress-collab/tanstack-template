import { createFileRoute } from '@tanstack/react-router'
import { LLMExplainer } from '../components/LLMExplainer'

export const Route = createFileRoute('/llm-explainer')({
  head: () => ({
    meta: [
      {
        title: 'How Do LLMs Work? - A Visual Explainer',
      },
    ],
  }),
  component: LLMExplainerPage,
})

function LLMExplainerPage() {
  return <LLMExplainer />
}
