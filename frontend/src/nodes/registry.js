// registry.js
//
// The one place that lists every node type the app knows about. Adding a new
// node to the toolbar AND to React Flow is now a single entry here.

import { InputNode } from './inputNode';
import { OutputNode } from './outputNode';
import { LLMNode } from './llmNode';
import { TextNode } from './textNode';
import { MathNode } from './mathNode';
import { FilterNode } from './filterNode';
import { ApiNode } from './apiNode';
import { ImageNode } from './imageNode';
import { TimerNode } from './timerNode';

/**
 * @typedef {Object} NodeRegistryEntry
 * @property {React.ComponentType} component  Rendered inside React Flow
 * @property {string} label                   Shown in the toolbar
 * @property {string} kind                    Drives the accent colour
 */

/** @type {Record<string, NodeRegistryEntry>} */
export const NODE_REGISTRY = {
  customInput:  { component: InputNode,  label: 'Input',   kind: 'input' },
  customOutput: { component: OutputNode, label: 'Output',  kind: 'output' },
  llm:          { component: LLMNode,    label: 'LLM',     kind: 'llm' },
  text:         { component: TextNode,   label: 'Text',    kind: 'text' },

  math:    { component: MathNode,   label: 'Math',     kind: 'transform' },
  filter:  { component: FilterNode, label: 'Filter',   kind: 'transform' },
  api:     { component: ApiNode,    label: 'API Call', kind: 'integration' },
  image:   { component: ImageNode,  label: 'Image',    kind: 'media' },
  timer:   { component: TimerNode,  label: 'Delay',    kind: 'control' },
};

export const NODE_TYPES = Object.fromEntries(
  Object.entries(NODE_REGISTRY).map(([type, entry]) => [type, entry.component])
);

export const TOOLBAR_ITEMS = Object.entries(NODE_REGISTRY).map(([type, entry]) => ({
  type,
  label: entry.label,
  kind: entry.kind,
}));
