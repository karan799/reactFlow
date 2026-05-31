// imageNode.js
//
// Custom-render demo: the body is supplied via the `render` escape hatch so
// we can show a live preview thumbnail under the URL field.

import { createNode } from '../core/createNode';
import { TextField } from '../core/fields';
import { NODE_TOKENS } from '../core/nodeStyles';
import { NODE_ICONS } from '../core/icons';

export const ImageNode = createNode({
  kind: 'media',
  title: 'Image',
  icon: NODE_ICONS.image,
  defaults: {
    url: 'https://picsum.photos/seed/vectorshift/240/120',
    alt: 'preview',
  },
  handles: ({ id }) => [
    { id: `${id}-source`, type: 'target', label: 'src' },
    { id: `${id}-image`, type: 'source', label: 'image' },
  ],
  render: ({ id, data, setField }) => (
    <>
      <TextField
        id={`${id}-url`}
        label="URL"
        value={data.url}
        onChange={(v) => setField('url', v)}
      />
      <TextField
        id={`${id}-alt`}
        label="Alt text"
        value={data.alt}
        onChange={(v) => setField('alt', v)}
      />
      <div
        style={{
          border: `1px solid ${NODE_TOKENS.borderColor}`,
          borderRadius: 6,
          overflow: 'hidden',
          background: '#F3F4F6',
          height: 80,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {data.url ? (
          <img
            src={data.url}
            alt={data.alt}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        ) : (
          <span style={{ fontSize: 11, color: NODE_TOKENS.mutedColor }}>no image</span>
        )}
      </div>
    </>
  ),
});
