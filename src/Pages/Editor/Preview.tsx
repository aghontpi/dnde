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
`;

interface PreviewProps {
  visible: boolean;
  visibleChange: (visible: boolean) => void;
}

export const Preview = ({ visible, visibleChange }: PreviewProps) => {
  return (
    <FullscreenModal
      visible={visible}
      onCancel={() => visibleChange(false)}
      onOk={() => visibleChange(false)}
      width={1000}
      style={{ width: 'unset' }}
    >
      preview Content
    </FullscreenModal>
  );
};
