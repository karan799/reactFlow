// toolbar.js

import { Card, Space, Typography } from 'antd';
import { DraggableNode } from './draggableNode';
import { TOOLBAR_ITEMS } from './nodes/registry';

export const PipelineToolbar = () => {
  return (
    <Card
      size="small"
      style={{ marginBottom: 12 }}
      title={<Typography.Text strong>Nodes</Typography.Text>}
    >
      <Space size={[10, 10]} wrap>
        {TOOLBAR_ITEMS.map((item) => (
          <DraggableNode
            key={item.type}
            type={item.type}
            label={item.label}
            kind={item.kind}
          />
        ))}
      </Space>
    </Card>
  );
};
