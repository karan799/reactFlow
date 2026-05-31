// toolbar.js
//
// The categorised, searchable node palette that lives in the left sidebar.
// Each palette item is a draggable card; dropping it on the canvas is handled
// by ui.js. Categories come from the registry, so adding a node just shows
// up here automatically.

import { useMemo, useState } from 'react';
import { Collapse, Input, Tooltip, Empty } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { DraggableNode } from './draggableNode';
import { groupedToolbarItems, CATEGORY_ORDER } from './nodes/registry';
import { NODE_TOKENS } from './nodes/core/nodeStyles';

export const PipelineToolbar = () => {
  const [query, setQuery] = useState('');

  const filteredGroups = useMemo(() => {
    const groups = groupedToolbarItems();
    if (!query.trim()) return groups;
    const q = query.toLowerCase();
    const out = {};
    for (const [cat, items] of Object.entries(groups)) {
      const matched = items.filter(
        (it) =>
          it.label.toLowerCase().includes(q) ||
          it.description.toLowerCase().includes(q) ||
          it.type.toLowerCase().includes(q)
      );
      if (matched.length) out[cat] = matched;
    }
    return out;
  }, [query]);

  const hasResults = Object.values(filteredGroups).some((arr) => arr && arr.length);

  const collapseItems = CATEGORY_ORDER
    .filter((cat) => filteredGroups[cat] && filteredGroups[cat].length)
    .map((cat) => ({
      key: cat,
      label: (
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>{cat}</span>
          <span style={{ color: NODE_TOKENS.invertedMutedColor, fontSize: 10 }}>
            {filteredGroups[cat].length}
          </span>
        </span>
      ),
      children: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {filteredGroups[cat].map((item) => (
            <Tooltip
              key={item.type}
              title={item.description}
              placement="right"
              mouseEnterDelay={0.4}
            >
              <span>
                <DraggableNode
                  type={item.type}
                  label={item.label}
                  kind={item.kind}
                  icon={item.icon}
                />
              </span>
            </Tooltip>
          ))}
        </div>
      ),
    }));

  return (
    <div className="palette" style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      <div style={{ padding: 12, borderBottom: '1px solid rgba(148, 163, 184, 0.12)' }}>
        <div
          style={{
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: NODE_TOKENS.invertedMutedColor,
            marginBottom: 8,
          }}
        >
          Components
        </div>
        <Input
          allowClear
          size="small"
          prefix={<SearchOutlined />}
          placeholder="Search nodes…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div style={{ overflowY: 'auto', flex: 1, minHeight: 0 }}>
        {hasResults ? (
          <Collapse
            ghost
            defaultActiveKey={CATEGORY_ORDER}
            items={collapseItems}
          />
        ) : (
          <div style={{ padding: 20 }}>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span style={{ color: NODE_TOKENS.invertedMutedColor, fontSize: 12 }}>
                  No nodes match "{query}"
                </span>
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};
