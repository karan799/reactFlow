// createNode.js
//
// Factory that turns a declarative config into a React-Flow node component.
//
//   createNode({
//     kind:     'transform',
//     title:    'Math',
//     icon:     'fx',
//     subtitle: ({ data }) => `op = ${data.op}`,
//     width:    260,
//     defaults: { op: 'add' },
//     handles:  ({ id }) => [
//       { id: `${id}-a`, type: 'target' },
//       { id: `${id}-b`, type: 'target' },
//       { id: `${id}-out`, type: 'source' },
//     ],
//     fields: [
//       { name: 'op', label: 'Operation', type: 'select',
//         options: ['add', 'sub', 'mul', 'div'] },
//     ],
//   })
//
// Either `handles` and `fields` may be a value OR a function of
// `{ id, data, setField }` so they can react to the node's own data. That
// gives Part 3 the hook it needs to derive Text-node handles from `{{var}}`s
// without any special-casing here.

import { BaseNode } from './BaseNode';
import { FIELD_COMPONENTS } from './fields';
import { useNodeData } from './useNodeData';

const resolve = (val, ctx) => (typeof val === 'function' ? val(ctx) : val);

export const createNode = (config) => {
  const {
    kind,
    title,
    icon,
    subtitle,
    width,
    defaults = {},
    handles = [],
    fields = [],
    render, // optional escape hatch: (ctx) => ReactNode for full custom bodies
  } = config;

  const NodeComponent = ({ id, data }) => {
    const [view, setField] = useNodeData(id, data, defaults);
    const ctx = { id, data: view, setField };

    const resolvedHandles = resolve(handles, ctx);
    const resolvedFields = resolve(fields, ctx);
    const resolvedSubtitle = resolve(subtitle, ctx);

    return (
      <BaseNode
        id={id}
        kind={kind}
        title={resolve(title, ctx)}
        subtitle={resolvedSubtitle}
        icon={resolve(icon, ctx)}
        width={resolve(width, ctx)}
        handles={resolvedHandles}
      >
        {render
          ? render(ctx)
          : resolvedFields.map((field) => {
              const Component = FIELD_COMPONENTS[field.type];
              if (!Component) {
                if (process.env.NODE_ENV !== 'production') {
                  // eslint-disable-next-line no-console
                  console.warn(`createNode: unknown field type "${field.type}"`);
                }
                return null;
              }
              const value = view[field.name];
              return (
                <Component
                  key={field.name}
                  id={`${id}-${field.name}`}
                  label={field.label}
                  value={value}
                  options={field.options}
                  placeholder={field.placeholder}
                  rows={field.rows}
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  onChange={(next) => setField(field.name, next)}
                />
              );
            })}
      </BaseNode>
    );
  };

  NodeComponent.displayName = `Node(${config.title || 'Custom'})`;
  return NodeComponent;
};
