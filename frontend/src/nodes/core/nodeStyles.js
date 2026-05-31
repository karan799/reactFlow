// nodeStyles.js
//
// Design tokens for the editor. Centralised so the whole product can be
// re-skinned by editing this single file.

export const NODE_TOKENS = {
  // surfaces
  background: '#FFFFFF',
  headerBackground: '#FAFBFC',
  canvasBackground: '#F4F5F7',
  paletteBackground: '#0F172A',
  paletteSurface: '#1E293B',
  paletteHover: '#293548',

  // text
  textColor: '#1C2536',
  mutedColor: '#6B7280',
  invertedTextColor: '#F8FAFC',
  invertedMutedColor: '#94A3B8',

  // borders
  borderColor: '#E5E7EB',
  borderColorStrong: '#D6DAE1',

  // shape
  radius: 12,
  radiusSm: 8,

  // typography
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
  fontSize: 12,
  fontSizeSm: 11,

  // elevation
  shadow: '0 1px 2px rgba(16, 24, 40, 0.04), 0 1px 3px rgba(16, 24, 40, 0.08)',
  shadowHover: '0 4px 8px rgba(16, 24, 40, 0.06), 0 8px 24px rgba(16, 24, 40, 0.12)',
  shadowSelected: '0 0 0 2px rgba(59, 130, 246, 0.18), 0 8px 24px rgba(16, 24, 40, 0.14)',

  // motion
  transition: 'all 0.15s ease',

  // handles
  handleSize: 10,
};

// kind -> accent colour. A new kind of node is one entry here.
export const KIND_ACCENTS = {
  input: '#3B82F6',        // blue
  output: '#10B981',       // green
  llm: '#8B5CF6',          // purple
  text: '#F59E0B',         // amber
  transform: '#06B6D4',    // cyan  (math, filter)
  integration: '#EF4444',  // red   (api, webhooks)
  media: '#EC4899',        // pink  (image, audio)
  control: '#6B7280',      // gray  (timer, branch)
};

export const accentFor = (kind) => KIND_ACCENTS[kind] || NODE_TOKENS.textColor;

// "kind" -> soft tinted background (used for icon badges)
export const accentSoft = (kind) => `${accentFor(kind)}1A`; // ~10% alpha
