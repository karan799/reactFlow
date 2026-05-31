// textParsing.js
//
// Helpers for the Text node's variable detection and auto-resize logic.
// Both are pure functions so they're trivially testable.

// {{ <whitespace?> <valid JS identifier> <whitespace?> }}
// JS identifiers start with a letter, underscore, or $ — never a digit.
// We deliberately do NOT support dotted paths (`{{ user.name }}`) for now;
// those would need a separate convention and validation rules.
const TEMPLATE_RE = /\{\{\s*([A-Za-z_$][A-Za-z0-9_$]*)\s*\}\}/g;

/**
 * Extracts the ordered, deduplicated list of variable names referenced in
 * the given text. Order is by first appearance, which is the order we want
 * for the handles laid out top-to-bottom on the left of the node.
 *
 * @param {string} text
 * @returns {string[]}
 */
export const parseVariables = (text = '') => {
  const seen = new Set();
  const out = [];
  // Make sure the stateful regex starts fresh on every call.
  TEMPLATE_RE.lastIndex = 0;
  let m;
  while ((m = TEMPLATE_RE.exec(text)) !== null) {
    const name = m[1];
    if (!seen.has(name)) {
      seen.add(name);
      out.push(name);
    }
  }
  return out;
};

// ----- Pixel-accurate text measurement ---------------------------------
//
// We measure the longest line in the text to compute the natural width the
// node "wants" to be. Using a single shared canvas avoids creating DOM
// nodes per keystroke and never triggers a layout/reflow.

let _ctx = null;
const ensureCtx = () => {
  if (_ctx) return _ctx;
  if (typeof document === 'undefined') return null;
  _ctx = document.createElement('canvas').getContext('2d');
  return _ctx;
};

/**
 * Pixel width of the widest line in `text` rendered with `font`.
 * Returns 0 in non-browser environments (SSR / tests without DOM).
 */
export const measureLongestLineWidth = (
  text,
  font = '13px -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", "Roboto", sans-serif'
) => {
  const ctx = ensureCtx();
  if (!ctx) return 0;
  ctx.font = font;
  let max = 0;
  const lines = (text || '').split('\n');
  for (const line of lines) {
    // Empty lines should still contribute some baseline so the textarea
    // doesn't snap to its minimum width on a trailing newline.
    const w = ctx.measureText(line || ' ').width;
    if (w > max) max = w;
  }
  return max;
};
