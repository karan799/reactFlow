// submit.js
//
// Primary CTA shown in the top header. Part 4 will wire this to POST the
// nodes + edges to the FastAPI backend and surface the response.

import { Button } from 'antd';
import { PlayCircleFilled } from '@ant-design/icons';

export const SubmitButton = () => {
  return (
    <Button type="primary" icon={<PlayCircleFilled />} size="middle">
      Run Pipeline
    </Button>
  );
};
