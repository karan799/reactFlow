// inputNode.js

import { createNode } from './createNode';

export const InputNode = createNode({
  kind: 'input',
  title: 'Input',
  icon: 'IN',
  defaults: {
    inputName: ({ id }) => id.replace('customInput-', 'input_'),
    inputType: 'Text',
  },
  handles: ({ id }) => [
    { id: `${id}-value`, type: 'source' },
  ],
  fields: [
    { name: 'inputName', label: 'Name', type: 'text' },
    { name: 'inputType', label: 'Type', type: 'select', options: ['Text', 'File'] },
  ],
});
