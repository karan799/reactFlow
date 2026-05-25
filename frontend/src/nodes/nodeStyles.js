// nodeStyles.js
//
// Design tokens for nodes. Keeping these centralised means Part 2 (styling)
// can re-skin every node by editing a single file, and adding a new node
// "kind" is one entry in KIND_ACCENTS.

export const NODE_TOKENS = {
  radius: 10,
  borderColor: '#D6DAE1',
  background: '#FFFFFF',
  headerBackground: '#F7F8FA',
  textColor: '#1C2536',
  mutedColor: '#6B7280',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
  fontSize: 12,
  shadow: '0 1px 2px rgba(16, 24, 40, 0.06), 0 1px 3px rgba(16, 24, 40, 0.10)',
  handleColor: '#1C2536',
  handleSize: 10,
};

// kind -> accent colour. The accent drives the header strip and handle ring.
// A new "kind" of node is one line here.
export const KIND_ACCENTS = {
  input: '#3B82F6',        // blue
  output: '#10B981',       // green
  llm: '#8B5CF6',          // purple
  text: '#F59E0B',         // amber
  transform: '#06B6D4',    // cyan  (math, filter, ...)
  integration: '#EF4444',  // red   (api calls, webhooks)
  media: '#EC4899',        // pink  (image, audio)
  control: '#6B7280',      // gray  (timer, delay, branch)
};

export const accentFor = (kind) => KIND_ACCENTS[kind] || NODE_TOKENS.textColor;
