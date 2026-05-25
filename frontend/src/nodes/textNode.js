// textNode.js
//
// Part 1 deliberately keeps this minimal: a single text field and a single
// output handle. Parts 2 & 3 will build on the same abstraction to add
// auto-resize and variable-driven handles without rewriting the node itself.

import { createNode } from './createNode';

export const TextNode = createNode({
  kind: 'text',
  title: 'Text',
  icon: 'T',
  defaults: { text: '{{input}}' },
  handles: ({ id }) => [
    { id: `${id}-output`, type: 'source' },
  ],
  fields: [
    { name: 'text', label: 'Text', type: 'text' },
  ],
});
