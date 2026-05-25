// outputNode.js

import { createNode } from './createNode';

export const OutputNode = createNode({
  kind: 'output',
  title: 'Output',
  icon: 'OUT',
  defaults: {
    outputName: ({ id }) => id.replace('customOutput-', 'output_'),
    outputType: 'Text',
  },
  handles: ({ id }) => [
    { id: `${id}-value`, type: 'target' },
  ],
  fields: [
    { name: 'outputName', label: 'Name', type: 'text' },
    {
      name: 'outputType',
      label: 'Type',
      type: 'select',
      options: [
        { value: 'Text', label: 'Text' },
        { value: 'Image', label: 'Image' },
      ],
    },
  ],
});
