// draggableNode.js
//
// A draggable palette item. Visual: dark card row with a tinted icon badge
// and a left accent stripe matching the node's kind.

import { accentFor, accentSoft, NODE_TOKENS } from './nodes/core/nodeStyles';

export const DraggableNode = ({ type, label, kind, icon }) => {
  const accent = accentFor(kind);

  const onDragStart = (event, nodeType) => {
    const appData = { nodeType };
    event.target.style.cursor = 'grabbing';
    event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className={`palette-item ${type}`}
      onDragStart={(event) => onDragStart(event, type)}
      onDragEnd={(event) => (event.target.style.cursor = 'grab')}
      style={{
        cursor: 'grab',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 10px',
        borderRadius: 8,
        background: NODE_TOKENS.paletteSurface,
        borderLeft: `3px solid ${accent}`,
        color: NODE_TOKENS.invertedTextColor,
        userSelect: 'none',
      }}
      draggable
    >
      <span
        aria-hidden
        style={{
          width: 24,
          height: 24,
          borderRadius: 6,
          background: accentSoft(kind),
          color: accent,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 13,
          flexShrink: 0,
        }}
      >
        {icon}
      </span>
      <span style={{ fontSize: 12.5, fontWeight: 500 }}>{label}</span>
    </div>
  );
};
