import { Modal } from 'antd';
import styled from 'styled-components';
import './Preview.module.css';

const FullscreenModal = styled(Modal).attrs({ title: 'Preview' })`
  .ant-modal {
    max-width: unset !important;
    margin: unset !important;
  }
  .ant-modal-centered::before {
    content: unset !important;
  }
  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .ant-modal-body {
    margin: 0px auto;
  }
`;

interface PreviewProps {
  visible: boolean;
  visibleChange: (visible: boolean) => void;
  inframeContent: string;
}

export const Preview = ({ visible, visibleChange, inframeContent }: PreviewProps) => {
  return (
    <FullscreenModal
      visible={visible}
      onCancel={() => visibleChange(false)}
      onOk={() => visibleChange(false)}
      width={'unset'}
      style={{ top: '0px', maxWidth: 'unset', paddingBottom: '0px', height: '100%' }}
      bodyStyle={{ height: '100%' }}
      maskStyle={{ height: '100%' }}
      destroyOnClose={true}
      footer={null}
    >
      {inframeContent ? (
        <iframe
          title="preview computer"
          style={{ margin: '0px auto' }}
          width="800px"
          height="100%"
          srcDoc={inframeContent}
        />
      ) : null}
    </FullscreenModal>
  );
};
