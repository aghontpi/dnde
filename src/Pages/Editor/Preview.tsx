import { Modal, Radio } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import './Preview.module.css';

const DESKTOP_WIDTH = '800px';
const MOBILE_WIDTH = '323px';

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

const PreviewMode = styled.div`
  position: absolute;
  bottom: 24px;
  left: 24px;
`;

interface PreviewProps {
  visible: boolean;
  visibleChange: (visible: boolean) => void;
  inframeContent: string;
}

export const Preview = ({ visible, visibleChange, inframeContent }: PreviewProps) => {
  const [mode, setMode] = useState('desktop');

  const onChange = (e: RadioChangeEvent) => {
    if (e.target.value) {
      setMode(e.target.value);
    }
  };

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
      <PreviewMode>
        <ModeSelect onChange={onChange} value={mode} />
      </PreviewMode>
      {inframeContent ? (
        <iframe
          title="Preview"
          style={{ margin: '0px auto' }}
          width={mode === 'desktop' ? DESKTOP_WIDTH : MOBILE_WIDTH}
          height="100%"
          srcDoc={inframeContent}
        />
      ) : null}
    </FullscreenModal>
  );
};

interface ModeSelectProps {
  onChange: (e: RadioChangeEvent) => void;
  value: string;
}

const ModeSelect = ({ onChange, value }: ModeSelectProps) => {
  return (
    <>
      <Radio.Group
        onChange={onChange}
        value={value}
        options={[
          { label: 'desktop', value: 'desktop' },
          { label: 'mobile', value: 'mobile' },
        ]}
        buttonStyle="solid"
        optionType="button"
      />
    </>
  );
};
