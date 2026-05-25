// fields.js
//
// Thin wrappers around antd inputs. Each field is a controlled component:
// state lives in the zustand store (via useNodeData) and is passed in via
// `value`; changes are reported via `onChange`. Wrapping antd here keeps
// nodes declarative — configs just say `type: 'select'` etc.

import { Input, InputNumber, Select, Checkbox, Typography } from 'antd';
import { NODE_TOKENS } from './nodeStyles';

const { TextArea } = Input;

const labelStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  fontSize: NODE_TOKENS.fontSize,
  color: NODE_TOKENS.mutedColor,
  fontFamily: NODE_TOKENS.fontFamily,
};

const Label = ({ label, htmlFor, children }) => (
  <label htmlFor={htmlFor} style={labelStyle}>
    {label && <span>{label}</span>}
    {children}
  </label>
);

// Antd inputs swallow drag events for node movement; stopping pointerdown
// propagation lets the user click inside the field without dragging the node.
const stop = (e) => e.stopPropagation();

const wrap = (node) => (
  <div onPointerDown={stop} onMouseDown={stop} className="nodrag">
    {node}
  </div>
);

export const TextField = ({ id, label, value = '', onChange, placeholder }) => (
  <Label label={label} htmlFor={id}>
    {wrap(
      <Input
        id={id}
        size="small"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    )}
  </Label>
);

export const NumberField = ({ id, label, value = 0, onChange, min, max, step }) => (
  <Label label={label} htmlFor={id}>
    {wrap(
      <InputNumber
        id={id}
        size="small"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(v) => onChange(v ?? 0)}
        style={{ width: '100%' }}
      />
    )}
  </Label>
);

export const SelectField = ({ id, label, value, onChange, options = [] }) => {
  const normalized = options.map((opt) =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );
  return (
    <Label label={label} htmlFor={id}>
      {wrap(
        <Select
          id={id}
          size="small"
          value={value}
          onChange={(v) => onChange(v)}
          options={normalized}
          style={{ width: '100%' }}
          getPopupContainer={(trigger) => trigger.parentElement}
        />
      )}
    </Label>
  );
};

export const TextareaField = ({ id, label, value = '', onChange, rows = 3, placeholder }) => (
  <Label label={label} htmlFor={id}>
    {wrap(
      <TextArea
        id={id}
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        autoSize={{ minRows: rows, maxRows: rows + 4 }}
      />
    )}
  </Label>
);

export const CheckboxField = ({ id, label, value = false, onChange }) =>
  wrap(
    <Checkbox
      id={id}
      checked={!!value}
      onChange={(e) => onChange(e.target.checked)}
    >
      {label}
    </Checkbox>
  );

export const DisplayField = ({ label, value }) => (
  <div style={labelStyle}>
    {label && <span>{label}</span>}
    <Typography.Text style={{ fontSize: NODE_TOKENS.fontSize, color: NODE_TOKENS.textColor }}>
      {value}
    </Typography.Text>
  </div>
);

export const FIELD_COMPONENTS = {
  text: TextField,
  number: NumberField,
  select: SelectField,
  textarea: TextareaField,
  checkbox: CheckboxField,
  display: DisplayField,
};
