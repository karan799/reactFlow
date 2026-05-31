// store.js

import { create } from "zustand";
import {
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    MarkerType,
  } from 'reactflow';

export const useStore = create((set, get) => ({
    nodes: [],
    edges: [],
    getNodeID: (type) => {
        const newIDs = {...get().nodeIDs};
        if (newIDs[type] === undefined) {
            newIDs[type] = 0;
        }
        newIDs[type] += 1;
        set({nodeIDs: newIDs});
        return `${type}-${newIDs[type]}`;
    },
    addNode: (node) => {
        set({
            nodes: [...get().nodes, node]
        });
    },
    onNodesChange: (changes) => {
      set({
        nodes: applyNodeChanges(changes, get().nodes),
      });
    },
    onEdgesChange: (changes) => {
      set({
        edges: applyEdgeChanges(changes, get().edges),
      });
    },
    onConnect: (connection) => {
      set({
        edges: addEdge({...connection, type: 'smoothstep', animated: true, markerEnd: {type: MarkerType.Arrow, height: '20px', width: '20px'}}, get().edges),
      });
    },
    updateNodeField: (nodeId, fieldName, fieldValue) => {
      set({
        nodes: get().nodes.map((node) => {
          if (node.id === nodeId) {
            node.data = { ...node.data, [fieldName]: fieldValue };
          }

          return node;
        }),
      });
    },
    // Generic dynamic-handle support: drop any edges that reference handles
    // on `nodeId` which are no longer in `validHandleIds`. Used by nodes
    // whose handles are derived from data (e.g. the Text node's {{vars}}).
    syncHandles: (nodeId, validHandleIds) => {
      const valid = new Set(validHandleIds);
      const before = get().edges;
      const after = before.filter((e) => {
        if (e.source === nodeId && e.sourceHandle && !valid.has(e.sourceHandle)) return false;
        if (e.target === nodeId && e.targetHandle && !valid.has(e.targetHandle)) return false;
        return true;
      });
      if (after.length !== before.length) set({ edges: after });
    },
    deleteNode: (nodeId) => {
      set({
        nodes: get().nodes.filter((n) => n.id !== nodeId),
        edges: get().edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
      });
    },
  }));
