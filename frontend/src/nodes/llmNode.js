// llmNode.js

import { createNode } from './createNode';
import { NODE_ICONS } from './icons';

export const LLMNode = createNode({
  kind: 'llm',
  title: 'LLM',
  subtitle: 'Large language model',
  icon: NODE_ICONS.llm,
  handles: ({ id }) => [
    { id: `${id}-system`, type: 'target', label: 'system' },
    { id: `${id}-prompt`, type: 'target', label: 'prompt' },
    { id: `${id}-response`, type: 'source', label: 'response' },
  ],
  fields: [
    { name: 'model', label: 'Model', type: 'select',
      options: ['gpt-4o', 'gpt-4o-mini', 'claude-3.5-sonnet', 'llama-3.1-70b'] },
    { name: 'temperature', label: 'Temperature', type: 'number',
      min: 0, max: 2, step: 0.1 },
  ],
  defaults: { model: 'gpt-4o', temperature: 0.7 },
});
