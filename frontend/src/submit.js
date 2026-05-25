// submit.js
//
// Part 4 will wire this button to POST nodes/edges to /pipelines/parse.
// For now we present the antd Button so the chrome is in place.

import { Button } from 'antd';

export const SubmitButton = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
      <Button type="primary" size="large">
        Submit Pipeline
      </Button>
    </div>
  );
};
