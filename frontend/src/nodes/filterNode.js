// filterNode.js
//
// Conditional field demo: when mode === 'regex' we show a "Flags" field,
// otherwise we hide it. Proves `fields` can be a function of data.

import { createNode } from './createNode';
import { NODE_ICONS } from './icons';

export const FilterNode = createNode({
  kind: 'transform',
  title: 'Filter',
  icon: NODE_ICONS.filter,
  subtitle: ({ data }) => `mode: ${data.mode}`,
  defaults: { mode: 'contains', pattern: '', flags: 'i' },
  handles: ({ id }) => [
    { id: `${id}-input`, type: 'target', label: 'in' },
    { id: `${id}-output`, type: 'source', label: 'out' },
  ],
  fields: ({ data }) => {
    const base = [
      { name: 'mode', label: 'Mode', type: 'select',
        options: ['contains', 'equals', 'startsWith', 'regex'] },
      { name: 'pattern', label: 'Pattern', type: 'text',
        placeholder: data.mode === 'regex' ? '^[a-z]+$' : 'search…' },
    ];
    if (data.mode === 'regex') {
      base.push({ name: 'flags', label: 'Flags', type: 'text', placeholder: 'gimsuy' });
    }
    return base;
  },
});
