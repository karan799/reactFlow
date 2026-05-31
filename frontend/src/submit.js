// submit.js
//
// Primary CTA shown in the top header. POSTs the current nodes + edges to
// the FastAPI backend and surfaces the parse response in a modal.

import { useCallback, useState } from 'react';
import { Button, Descriptions, Modal, Tag, message } from 'antd';
import {
  CheckCircleFilled,
  CloseCircleFilled,
  PlayCircleFilled,
} from '@ant-design/icons';
import { shallow } from 'zustand/shallow';
import { useStore } from './store';

const API_URL = 'http://localhost:8000/pipelines/parse';

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
});

export const SubmitButton = () => {
  const { nodes, edges } = useStore(selector, shallow);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      setResult(data);
      setModalOpen(true);
    } catch (err) {
      const isNetworkError =
        err instanceof TypeError || err.message === 'Failed to fetch';
      message.error(
        isNetworkError
          ? 'Could not reach the backend at localhost:8000. Is it running?'
          : err.message || 'Failed to parse pipeline'
      );
    } finally {
      setLoading(false);
    }
  }, [nodes, edges]);

  const closeModal = () => setModalOpen(false);

  return (
    <>
      <Button
        type="primary"
        icon={<PlayCircleFilled />}
        size="middle"
        loading={loading}
        onClick={handleSubmit}
      >
        Run Pipeline
      </Button>

      <Modal
        title="Pipeline analysis"
        open={modalOpen}
        onCancel={closeModal}
        onOk={closeModal}
        okText="Close"
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        {result && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Nodes">{result.num_nodes}</Descriptions.Item>
            <Descriptions.Item label="Edges">{result.num_edges}</Descriptions.Item>
            <Descriptions.Item label="Valid DAG">
              <Tag
                icon={result.is_dag ? <CheckCircleFilled /> : <CloseCircleFilled />}
                color={result.is_dag ? 'success' : 'error'}
              >
                {result.is_dag ? 'Yes' : 'No — cycle detected'}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </>
  );
};
