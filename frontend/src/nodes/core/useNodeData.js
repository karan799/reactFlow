// useNodeData.js
//
// Bridges a node's React-Flow `data` prop with the zustand store. Reading
// `data` directly from props keeps us in sync with external changes (undo,
// load-from-server, etc.), while every write goes through `updateNodeField`
// so the pipeline that Part 4 submits to the backend is always accurate.
//
// `defaults` may contain plain values OR functions of ({ id, data }) so
// per-instance defaults (e.g. "input_1", "input_2") are easy.

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useStore } from '../../store';

const resolveDefault = (value, ctx) =>
  typeof value === 'function' ? value(ctx) : value;

export const useNodeData = (id, data = {}, defaults = {}) => {
  const updateNodeField = useStore((s) => s.updateNodeField);
  const seeded = useRef(false);

  useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;
    Object.entries(defaults).forEach(([key, value]) => {
      if (data[key] === undefined) {
        updateNodeField(id, key, resolveDefault(value, { id, data }));
      }
    });
  }, [id, data, defaults, updateNodeField]);

  // Merge defaults into the view layer immediately so the first render shows
  // something even before the store-seed effect commits.
  const view = useMemo(() => {
    const merged = { ...data };
    Object.entries(defaults).forEach(([key, value]) => {
      if (merged[key] === undefined) {
        merged[key] = resolveDefault(value, { id, data });
      }
    });
    return merged;
  }, [id, data, defaults]);

  const setField = useCallback(
    (name, value) => updateNodeField(id, name, value),
    [id, updateNodeField]
  );

  return [view, setField];
};
