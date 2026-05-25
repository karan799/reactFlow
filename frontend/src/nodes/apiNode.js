// apiNode.js
//
// Integration node with a textarea (headers JSON), a select (method) and a
// text field (url). Demonstrates wider layout via `width`.

import { createNode } from './createNode';

export const ApiNode = createNode({
  kind: 'integration',
  title: 'API Call',
  icon: 'API',
  subtitle: ({ data }) => `${data.method} ${data.url || '\u2014'}`,
  width: 280,
  defaults: {
    method: 'GET',
    url: 'https://api.example.com/v1/items',
    headers: '{\n  "Content-Type": "application/json"\n}',
  },
  handles: ({ id }) => [
    { id: `${id}-trigger`, type: 'target', label: 'trigger' },
    { id: `${id}-body`, type: 'target', label: 'body' },
    { id: `${id}-response`, type: 'source', label: 'response' },
    { id: `${id}-error`, type: 'source', label: 'error' },
  ],
  fields: [
    { name: 'method', label: 'Method', type: 'select',
      options: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] },
    { name: 'url', label: 'URL', type: 'text', placeholder: 'https://…' },
    { name: 'headers', label: 'Headers (JSON)', type: 'textarea', rows: 3 },
  ],
});
