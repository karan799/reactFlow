// textNode.js
//
// The Text node has two pieces of dynamic behaviour wired through the
// generic abstraction:
//   * width grows with the longest line of text (capped between
//     MIN_WIDTH and MAX_WIDTH);
//   * one target handle on the left for every valid `{{ identifier }}`
//     found in the text. Handle ids are deterministic (`<nodeId>-var-<name>`)
//     so existing edges survive any edits that don't remove their variable.
//
// Edge cleanup when a variable is removed/renamed is handled centrally by
// createNode -> store.syncHandles, so nothing node-specific to do here.

import { Position } from 'reactflow';
import { createNode } from './createNode';
import { NODE_ICONS } from './icons';
import { TextareaField } from './fields';
import { parseVariables, measureLongestLineWidth } from './textParsing';

const MIN_WIDTH = 240;
const MAX_WIDTH = 480;
// Header padding + body padding + textarea inner padding + a small safety
// margin so the longest line is comfortable, not hard against the border.
const HORIZONTAL_CHROME = 56;
const TEXT_FONT =
  '13px -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", "Roboto", sans-serif';
// Each variable handle on the left needs vertical room to avoid overlap.
// BaseNode distributes handles by percentage, so we enforce a minimum body
// height proportional to the variable count.
const PX_PER_HANDLE = 28;

const computeWidth = (text) => {
  const measured = measureLongestLineWidth(text, TEXT_FONT);
  return Math.max(
    MIN_WIDTH,
    Math.min(MAX_WIDTH, Math.round(measured + HORIZONTAL_CHROME))
  );
};

export const TextNode = createNode({
  kind: 'text',
  title: 'Text',
  icon: NODE_ICONS.text,
  defaults: { text: '{{ input }}' },

  width: ({ data }) => computeWidth(data.text || ''),

  subtitle: ({ data }) => {
    const count = parseVariables(data.text).length;
    return count === 0
      ? 'plain text'
      : `${count} variable${count === 1 ? '' : 's'}`;
  },

  handles: ({ id, data }) => {
    const vars = parseVariables(data.text);
    const targets = vars.map((name) => ({
      id: `${id}-var-${name}`,
      type: 'target',
      position: Position.Left,
      label: name,
    }));
    return [
      ...targets,
      {
        id: `${id}-output`,
        type: 'source',
        position: Position.Right,
        label: 'output',
      },
    ];
  },

  // We use the render escape hatch (rather than a field descriptor) so we
  // can apply a minimum body height that scales with the number of handles
  // on the left side. This guarantees the auto-distributed handles never
  // overlap, no matter how short the text is.
  render: ({ id, data, setField }) => {
    const variableCount = parseVariables(data.text).length;
    return (
      <div
        style={{
          minHeight: variableCount * PX_PER_HANDLE,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        <TextareaField
          id={`${id}-text`}
          value={data.text}
          onChange={(next) => setField('text', next)}
          rows={2}
          maxRows={14}
          placeholder="Type {{ variableName }} to create input handles…"
        />
      </div>
    );
  },
});
