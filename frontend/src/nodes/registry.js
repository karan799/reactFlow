// registry.js
//
// One place lists every node type the app knows about. Adding a node = one
// entry here. Drives both the React-Flow nodeTypes map and the categorized
// palette in the sidebar.

import { InputNode } from './inputNode';
import { OutputNode } from './outputNode';
import { LLMNode } from './llmNode';
import { TextNode } from './textNode';
import { MathNode } from './mathNode';
import { FilterNode } from './filterNode';
import { ApiNode } from './apiNode';
import { ImageNode } from './imageNode';
import { TimerNode } from './timerNode';
import { NODE_ICONS } from './icons';

/**
 * @typedef {Object} NodeRegistryEntry
 * @property {React.ComponentType} component
 * @property {string} label
 * @property {string} kind         drives the accent colour
 * @property {string} category     grouping in the sidebar palette
 * @property {string} description  short blurb shown on hover
 * @property {React.ReactNode} icon
 */

/** @type {Record<string, NodeRegistryEntry>} */
export const NODE_REGISTRY = {
  customInput: {
    component: InputNode, label: 'Input', kind: 'input',
    category: 'I/O', icon: NODE_ICONS.customInput,
    description: 'External input into the pipeline.',
  },
  customOutput: {
    component: OutputNode, label: 'Output', kind: 'output',
    category: 'I/O', icon: NODE_ICONS.customOutput,
    description: 'Final output emitted by the pipeline.',
  },

  llm: {
    component: LLMNode, label: 'LLM', kind: 'llm',
    category: 'AI', icon: NODE_ICONS.llm,
    description: 'Large language model call (system + prompt).',
  },

  text: {
    component: TextNode, label: 'Text', kind: 'text',
    category: 'Content', icon: NODE_ICONS.text,
    description: 'Static or templated text with variables.',
  },
  image: {
    component: ImageNode, label: 'Image', kind: 'media',
    category: 'Content', icon: NODE_ICONS.image,
    description: 'Image asset with a live preview.',
  },

  math: {
    component: MathNode, label: 'Math', kind: 'transform',
    category: 'Logic', icon: NODE_ICONS.math,
    description: 'Arithmetic on two numeric inputs.',
  },
  filter: {
    component: FilterNode, label: 'Filter', kind: 'transform',
    category: 'Logic', icon: NODE_ICONS.filter,
    description: 'Pass-through if input matches a pattern.',
  },
  timer: {
    component: TimerNode, label: 'Delay', kind: 'control',
    category: 'Logic', icon: NODE_ICONS.timer,
    description: 'Wait N units before passing input through.',
  },

  api: {
    component: ApiNode, label: 'API Call', kind: 'integration',
    category: 'Integrations', icon: NODE_ICONS.api,
    description: 'HTTP request to an external service.',
  },
};

export const NODE_TYPES = Object.fromEntries(
  Object.entries(NODE_REGISTRY).map(([type, entry]) => [type, entry.component])
);

export const TOOLBAR_ITEMS = Object.entries(NODE_REGISTRY).map(([type, entry]) => ({
  type,
  label: entry.label,
  kind: entry.kind,
  category: entry.category,
  icon: entry.icon,
  description: entry.description,
}));

// Display order for the categorized palette
export const CATEGORY_ORDER = ['I/O', 'AI', 'Content', 'Logic', 'Integrations'];

export const groupedToolbarItems = () => {
  const groups = {};
  for (const cat of CATEGORY_ORDER) groups[cat] = [];
  for (const item of TOOLBAR_ITEMS) {
    if (!groups[item.category]) groups[item.category] = [];
    groups[item.category].push(item);
  }
  return groups;
};
