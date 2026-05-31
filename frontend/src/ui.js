// ui.js
//
// The pipeline canvas. Wraps React Flow with theming, a status panel that
// reports node/edge counts, and styled defaults for edges + minimap.

import { useState, useRef, useCallback } from 'react';
import ReactFlow, {
  Controls,
  Background,
  BackgroundVariant,
  MiniMap,
  MarkerType,
  Panel,
} from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { NODE_TYPES, NODE_REGISTRY } from './nodes/registry';
import { accentFor, NODE_TOKENS } from './nodes/core/nodeStyles';

import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };

const defaultEdgeOptions = {
  type: 'smoothstep',
  animated: true,
  style: { stroke: '#94A3B8', strokeWidth: 1.75 },
  markerEnd: { type: MarkerType.ArrowClosed, color: '#94A3B8', width: 18, height: 18 },
};

const connectionLineStyle = { stroke: '#3B82F6', strokeWidth: 2 };

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

const StatusPill = ({ label, value, accent }) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '4px 10px',
      borderRadius: 999,
      background: '#FFFFFF',
      border: `1px solid ${NODE_TOKENS.borderColor}`,
      fontSize: 11,
      color: NODE_TOKENS.mutedColor,
      boxShadow: NODE_TOKENS.shadow,
    }}
  >
    <span
      style={{
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: accent || NODE_TOKENS.mutedColor,
      }}
    />
    <span style={{ color: NODE_TOKENS.textColor, fontWeight: 600 }}>{value}</span>
    <span>{label}</span>
  </div>
);

const EmptyState = () => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'none',
      color: NODE_TOKENS.mutedColor,
      gap: 6,
    }}
  >
    <div
      style={{
        width: 44,
        height: 44,
        borderRadius: 12,
        background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
        opacity: 0.15,
      }}
    />
    <div style={{ fontSize: 14, fontWeight: 600, color: NODE_TOKENS.textColor }}>
      Build your pipeline
    </div>
    <div style={{ fontSize: 12 }}>
      Drag components from the left to start building.
    </div>
  </div>
);

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const {
    nodes,
    edges,
    getNodeID,
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
  } = useStore(selector, shallow);

  const getInitNodeData = (nodeID, type) => ({ id: nodeID, nodeType: type });

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      if (event?.dataTransfer?.getData('application/reactflow')) {
        const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
        const type = appData?.nodeType;
        if (!type) return;

        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        const nodeID = getNodeID(type);
        addNode({
          id: nodeID,
          type,
          position,
          data: getInitNodeData(nodeID, type),
        });
      }
    },
    [reactFlowInstance, addNode, getNodeID]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const minimapNodeColor = (n) => {
    const entry = NODE_REGISTRY[n.type];
    return entry ? accentFor(entry.kind) : '#94A3B8';
  };

  return (
    <div
      ref={reactFlowWrapper}
      style={{
        position: 'relative',
        width: '100%',
        flex: 1,
        minHeight: 0,
        background: NODE_TOKENS.background,
        border: `1px solid ${NODE_TOKENS.borderColor}`,
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: NODE_TOKENS.shadow,
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setReactFlowInstance}
        nodeTypes={NODE_TYPES}
        proOptions={proOptions}
        snapToGrid
        snapGrid={[gridSize, gridSize]}
        defaultEdgeOptions={defaultEdgeOptions}
        connectionLineStyle={connectionLineStyle}
        connectionLineType="smoothstep"
        fitView
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={gridSize}
          size={1.2}
          color="#D6DAE1"
        />
        <Controls position="bottom-left" showInteractive={false} />
        <MiniMap
          nodeColor={minimapNodeColor}
          nodeStrokeWidth={3}
          maskColor="rgba(15, 23, 42, 0.05)"
          pannable
          zoomable
        />
        <Panel position="top-right">
          <div style={{ display: 'flex', gap: 8 }}>
            <StatusPill label="nodes" value={nodes.length} accent="#3B82F6" />
            <StatusPill label="edges" value={edges.length} accent="#8B5CF6" />
          </div>
        </Panel>
      </ReactFlow>
      {nodes.length === 0 && <EmptyState />}
    </div>
  );
};
