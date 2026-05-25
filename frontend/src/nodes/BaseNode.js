// BaseNode.js
//
// The visual shell for every node. Responsibilities:
//   1. Render a consistent header (accent stripe + icon + title + subtitle).
//   2. Render a body slot for fields / custom children.
//   3. Render handles. When multiple handles sit on the same side, they are
//      automatically distributed vertically so configs don't have to do the
//      "top: 33%" math the original LLM node did by hand.
//
// BaseNode is presentational only. It knows nothing about the store.

import { memo, useMemo } from 'react';
import { Handle, Position } from 'reactflow';
import { NODE_TOKENS, accentFor } from './nodeStyles';

const DEFAULT_WIDTH = 240;

// Group handles by side, then assign vertical offsets where not explicitly set.
const layoutHandles = (handles) => {
  const groups = { [Position.Left]: [], [Position.Right]: [], [Position.Top]: [], [Position.Bottom]: [] };
  handles.forEach((h, idx) => {
    const side = h.position || (h.type === 'target' ? Position.Left : Position.Right);
    groups[side].push({ ...h, position: side, _idx: idx });
  });

  const out = [];
  Object.values(groups).forEach((group) => {
    group.forEach((h, i) => {
      const explicit = h.style && (h.style.top !== undefined || h.style.left !== undefined);
      const isVertical = h.position === Position.Left || h.position === Position.Right;
      const computed = explicit
        ? {}
        : isVertical
          ? { top: `${((i + 1) * 100) / (group.length + 1)}%` }
          : { left: `${((i + 1) * 100) / (group.length + 1)}%` };
      out.push({ ...h, style: { ...computed, ...(h.style || {}) } });
    });
  });
  return out;
};

const HandleLabel = ({ side, label }) => {
  if (!label) return null;
  const base = {
    position: 'absolute',
    fontSize: 10,
    color: NODE_TOKENS.mutedColor,
    fontFamily: NODE_TOKENS.fontFamily,
    pointerEvents: 'none',
    transform: 'translateY(-50%)',
    top: '50%',
    whiteSpace: 'nowrap',
  };
  const sideStyle = side === Position.Left
    ? { left: 10 }
    : side === Position.Right
      ? { right: 10 }
      : {};
  return <span style={{ ...base, ...sideStyle }}>{label}</span>;
};

const BaseNodeImpl = ({
  id,
  kind = 'default',
  title,
  subtitle,
  icon,
  width = DEFAULT_WIDTH,
  handles = [],
  children,
}) => {
  const accent = accentFor(kind);
  const positioned = useMemo(() => layoutHandles(handles), [handles]);

  return (
    <div
      style={{
        width,
        background: NODE_TOKENS.background,
        border: `1px solid ${NODE_TOKENS.borderColor}`,
        borderRadius: NODE_TOKENS.radius,
        boxShadow: NODE_TOKENS.shadow,
        fontFamily: NODE_TOKENS.fontFamily,
        color: NODE_TOKENS.textColor,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 12px',
          background: NODE_TOKENS.headerBackground,
          borderBottom: `1px solid ${NODE_TOKENS.borderColor}`,
          borderLeft: `3px solid ${accent}`,
        }}
      >
        {icon && (
          <span
            aria-hidden
            style={{
              width: 20,
              height: 20,
              borderRadius: 4,
              background: `${accent}22`,
              color: accent,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {icon}
          </span>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>{title}</span>
          {subtitle && (
            <span style={{ fontSize: 10, color: NODE_TOKENS.mutedColor }}>{subtitle}</span>
          )}
        </div>
      </div>

      <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {children}
      </div>

      {positioned.map((h) => (
        <Handle
          key={h.id}
          id={h.id}
          type={h.type}
          position={h.position}
          style={{
            background: NODE_TOKENS.background,
            border: `2px solid ${accent}`,
            width: NODE_TOKENS.handleSize,
            height: NODE_TOKENS.handleSize,
            ...h.style,
          }}
        />
      ))}

      {positioned.map((h) =>
        h.label ? (
          <div key={`${h.id}-label-wrap`} style={{ position: 'absolute', top: h.style.top, left: 0, right: 0 }}>
            <HandleLabel side={h.position} label={h.label} />
          </div>
        ) : null
      )}
    </div>
  );
};

export const BaseNode = memo(BaseNodeImpl);
