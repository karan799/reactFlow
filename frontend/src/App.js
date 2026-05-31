import { ConfigProvider, Layout, Space, theme, Typography } from 'antd';
import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';
import { NODE_TOKENS } from './nodes/core/nodeStyles';

const { Header, Content, Sider } = Layout;

const antdTheme = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: '#3B82F6',
    colorBgBase: '#FFFFFF',
    colorTextBase: NODE_TOKENS.textColor,
    borderRadius: 8,
    fontFamily: NODE_TOKENS.fontFamily,
  },
  components: {
    Layout: {
      headerBg: '#0F172A',
      siderBg: NODE_TOKENS.paletteBackground,
    },
  },
};

function App() {
  return (
    <ConfigProvider theme={antdTheme}>
      <Layout
        style={{
          height: '100vh',
          overflow: 'hidden',
          background: NODE_TOKENS.canvasBackground,
        }}
      >
        <Header
          style={{
            padding: '0 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(148, 163, 184, 0.16)',
          }}
        >
          <Space size={12} align="center">
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 7,
                background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
                boxShadow: '0 0 0 1px rgba(255,255,255,0.08)',
              }}
            />
            <Typography.Text style={{ color: '#fff', fontSize: 15, fontWeight: 600 }}>
              VectorShift
            </Typography.Text>
            <Typography.Text style={{ color: NODE_TOKENS.invertedMutedColor, fontSize: 12 }}>
              · Pipeline Editor
            </Typography.Text>
          </Space>
          <Space size={10} align="center">
            <Typography.Text style={{ color: NODE_TOKENS.invertedMutedColor, fontSize: 12 }}>
              Untitled pipeline
            </Typography.Text>
            <SubmitButton />
          </Space>
        </Header>

        <Layout style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <Sider
            width={260}
            style={{
              borderRight: '1px solid rgba(148, 163, 184, 0.12)',
              overflow: 'hidden',
              height: '100%',
            }}
          >
            <PipelineToolbar />
          </Sider>

          <Content
            style={{
              padding: 16,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              minHeight: 0,
            }}
          >
            <PipelineUI />
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
