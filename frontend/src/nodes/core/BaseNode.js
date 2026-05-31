// BaseNode.js
//
// Presentational shell for every node. Knows nothing about the store.
// Responsibilities:
//   1. Consistent header (accent bar + icon badge + title + subtitle)
//   2. Body slot for fields / custom children
//   3. Handle rendering with automatic vertical distribution
//   4. Visual states: idle / hover / selected (passed by React Flow)

import { memo, useMemo, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { CloseOutlined } from '@ant-design/icons';
import { NODE_TOKENS, accentFor, accentSoft } from './nodeStyles';

const DEFAULT_WIDTH = 240;

// Distribute multiple handles on the same side evenly so configs never have
// to compute `top: 33%` etc. by hand.
const layoutHandles = (handles) => {
  const groups = {
    [Position.Left]: [], [Position.Right]: [],
    [Position.Top]: [],  [Position.Bottom]: [],
  };
  handles.forEach((h) => {
    const side = h.position || (h.type === 'target' ? Position.Left : Position.Right);
    groups[side].push({ ...h, position: side });
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
    top: 0,
    fontSize: 10,
    color: NODE_TOKENS.mutedColor,
    fontFamily: NODE_TOKENS.fontFamily,
    pointerEvents: 'none',
    whiteSpace: 'nowrap',
    lineHeight: 1,
  };
  const sideStyle =
    side === Position.Left
      ? {
          left: 0,
          transform: 'translate(calc(-100% - 10px), -50%)',
          textAlign: 'right',
        }
      : side === Position.Right
        ? {
            right: 0,
            transform: 'translate(calc(100% + 10px), -50%)',
            textAlign: 'left',
          }
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
  selected = false,
  onDelete,
  children,
}) => {
  const accent = accentFor(kind);
  const [hover, setHover] = useState(false);
  const positioned = useMemo(() => layoutHandles(handles), [handles]);

  const shadow = selected
    ? NODE_TOKENS.shadowSelected
    : hover
      ? NODE_TOKENS.shadowHover
      : NODE_TOKENS.shadow;

  const borderColor = selected ? accent : NODE_TOKENS.borderColor;

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width,
        background: NODE_TOKENS.background,
        border: `1px solid ${borderColor}`,
        borderRadius: NODE_TOKENS.radius,
        boxShadow: shadow,
        fontFamily: NODE_TOKENS.fontFamily,
        color: NODE_TOKENS.textColor,
        overflow: 'visible',
        position: 'relative',
        transition: NODE_TOKENS.transition,
      }}
    >
      <div style={{ borderRadius: NODE_TOKENS.radius, overflow: 'hidden' }}>
      {/* Accent top stripe (subtle product signature) */}
      <div style={{ height: 3, background: accent, opacity: 0.9 }} />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 12px',
          background: NODE_TOKENS.headerBackground,
          borderBottom: `1px solid ${NODE_TOKENS.borderColor}`,
        }}
      >
        {icon && (
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
        )}
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15, flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: NODE_TOKENS.textColor }}>{title}</span>
          {subtitle && (
            <span
              style={{
                fontSize: 11,
                color: NODE_TOKENS.mutedColor,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {subtitle}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          {onDelete && (hover || selected) && (
            <button
              type="button"
              className="nodrag"
              aria-label="Delete node"
              title="Delete node"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              onPointerDown={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 22,
                height: 22,
                padding: 0,
                border: 'none',
                borderRadius: 6,
                background: 'rgba(239, 68, 68, 0.08)',
                color: '#EF4444',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <CloseOutlined style={{ fontSize: 11 }} />
            </button>
          )}
          <span
            style={{
              fontSize: 10,
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: accent,
              opacity: 0.8,
            }}
          >
            #{String(id).split('-').pop()}
          </span>
        </div>
      </div>

      <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {children}
      </div>
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
          <div
            key={`${h.id}-label-wrap`}
            style={{
              position: 'absolute',
              top: h.style.top,
              left: h.position === Position.Left ? 0 : undefined,
              right: h.position === Position.Right ? 0 : undefined,
              height: 0,
              width: 0,
              overflow: 'visible',
            }}
          >
            <HandleLabel side={h.position} label={h.label} />
          </div>
        ) : null
      )}
    </div>
  );
};

export const BaseNode = memo(BaseNodeImpl);
