// timerNode.js
//
// Pass-through control node — adds a delay before propagating its input.
// Demonstrates number + unit combo and a single in/out handle pair.

import { createNode } from './createNode';

export const TimerNode = createNode({
  kind: 'control',
  title: 'Delay',
  icon: 'T',
  subtitle: ({ data }) => `wait ${data.duration} ${data.unit}`,
  defaults: { duration: 1, unit: 's' },
  handles: ({ id }) => [
    { id: `${id}-in`, type: 'target', label: 'in' },
    { id: `${id}-out`, type: 'source', label: 'out' },
  ],
  fields: [
    { name: 'duration', label: 'Duration', type: 'number', min: 0, step: 0.1 },
    { name: 'unit', label: 'Unit', type: 'select',
      options: [
        { value: 'ms', label: 'milliseconds' },
        { value: 's', label: 'seconds' },
        { value: 'm', label: 'minutes' },
      ] },
  ],
});
