// icons.js
//
// Single source of truth for node iconography. Both the palette items and
// the node header badges read from this map so they always stay in sync.

import {
  LoginOutlined,
  LogoutOutlined,
  RobotOutlined,
  FontSizeOutlined,
  CalculatorOutlined,
  FilterOutlined,
  ApiOutlined,
  PictureOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';

export const NODE_ICONS = {
  customInput:  <LoginOutlined />,
  customOutput: <LogoutOutlined />,
  llm:          <RobotOutlined />,
  text:         <FontSizeOutlined />,
  math:         <CalculatorOutlined />,
  filter:       <FilterOutlined />,
  api:          <ApiOutlined />,
  image:        <PictureOutlined />,
  timer:        <ClockCircleOutlined />,
};

export const iconFor = (type) => NODE_ICONS[type] || null;
