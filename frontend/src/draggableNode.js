// draggableNode.js

import { accentFor } from './nodes/nodeStyles';

export const DraggableNode = ({ type, label, kind }) => {
  const accent = accentFor(kind);

  const onDragStart = (event, nodeType) => {
    const appData = { nodeType };
    event.target.style.cursor = 'grabbing';
    event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className={type}
      onDragStart={(event) => onDragStart(event, type)}
      onDragEnd={(event) => (event.target.style.cursor = 'grab')}
      style={{
        cursor: 'grab',
        minWidth: 90,
        height: 56,
        display: 'flex',
        alignItems: 'center',
        borderRadius: 8,
        background: '#1C2536',
        borderLeft: `4px solid ${accent}`,
        padding: '0 14px',
        color: '#fff',
        fontSize: 13,
        fontWeight: 500,
        boxShadow: '0 1px 2px rgba(16,24,40,0.08)',
        userSelect: 'none',
      }}
      draggable
    >
      {label}
    </div>
  );
};
