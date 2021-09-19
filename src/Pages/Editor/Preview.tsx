import { Modal } from 'antd';
import { useState } from 'react';

const Preview = () => {
  const [visible, setVisible] = useState(false);
  return <Modal title="Preview" visible={visible} width={1000}></Modal>;
};
