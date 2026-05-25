import { ConfigProvider, Layout, theme } from 'antd';
import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';
import { NODE_TOKENS } from './nodes/nodeStyles';

const { Header, Content, Footer } = Layout;

const antdTheme = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: '#1C2536',
    colorBgBase: '#FFFFFF',
    colorTextBase: NODE_TOKENS.textColor,
    borderRadius: 8,
    fontFamily: NODE_TOKENS.fontFamily,
  },
};

function App() {
  return (
    <ConfigProvider theme={antdTheme}>
      <Layout style={{ minHeight: '100vh', background: '#F4F5F7' }}>
        <Header
          style={{
            background: '#1C2536',
            color: '#fff',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
            }}
          />
          <span style={{ fontSize: 16, fontWeight: 600 }}>VectorShift Pipeline</span>
        </Header>
        <Content style={{ padding: 16 }}>
          <PipelineToolbar />
          <PipelineUI />
          <SubmitButton />
        </Content>
        <Footer style={{ textAlign: 'center', background: 'transparent', color: NODE_TOKENS.mutedColor }}>
          Frontend Technical Assessment
        </Footer>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
