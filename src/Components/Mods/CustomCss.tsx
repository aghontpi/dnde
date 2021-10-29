import { Form, Row, Col, Input } from 'antd';
import { useState } from 'react';

const CustomCss = () => {
  const [value, setValue] = useState('');
  const handleChange = (e) => {};

  <Form.Item>
    <Row gutter={[0, 8]}>
      <Col span={24}>
        <span className="ant-form-item-label">Content:</span>
      </Col>
      <Col span={24}>
        <Input.TextArea rows={3} onChange={handleChange} value={value} />
      </Col>
    </Row>
  </Form.Item>;
};

export { CustomCss };
