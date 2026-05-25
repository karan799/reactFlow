// mathNode.js
//
// Two-input arithmetic node. Demonstrates: multiple target handles on the
// same side (auto-distributed), a select-driven dynamic subtitle.

import { createNode } from './createNode';

const OPS = [
  { value: 'add', label: '+ Add' },
  { value: 'sub', label: '\u2212 Subtract' },
  { value: 'mul', label: '\u00D7 Multiply' },
  { value: 'div', label: '\u00F7 Divide' },
];

const OP_SYMBOL = { add: '+', sub: '\u2212', mul: '\u00D7', div: '\u00F7' };

export const MathNode = createNode({
  kind: 'transform',
  title: 'Math',
  icon: 'fx',
  subtitle: ({ data }) => `a ${OP_SYMBOL[data.op] || '?'} b`,
  defaults: { op: 'add' },
  handles: ({ id }) => [
    { id: `${id}-a`, type: 'target', label: 'a' },
    { id: `${id}-b`, type: 'target', label: 'b' },
    { id: `${id}-result`, type: 'source', label: 'result' },
  ],
  fields: [
    { name: 'op', label: 'Operation', type: 'select', options: OPS },
  ],
});
