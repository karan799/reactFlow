// outputNode.js

import { createNode } from '../core/createNode';
import { NODE_ICONS } from '../core/icons';

export const OutputNode = createNode({
  kind: 'output',
  title: 'Output',
  icon: NODE_ICONS.customOutput,
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
