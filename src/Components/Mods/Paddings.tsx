import { Form, Input, Row, Col } from 'antd';
import { useEffect, useState } from 'react';

const Padding = () => {
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(0);
  const [top] = useState(0);
  const [bottom] = useState(0);
  useEffect(() => {
    console.log(left, right, top, bottom);
  }, [left, top, bottom, right]);

  return (
    <Form.Item label="Padding :">
      <Input.Group style={{ marginBottom: '6px' }}>
        <Row>
          <Col span={11} offset={0}>
            <Input
              addonBefore="top"
              //   onKeyDown={(e) => onKeyDown(e, 'top')}
              //   onChange={(e) => handleChange(e, 'top')}
              //   value={state}
            />
          </Col>
          <Col span={11} offset={2}>
            <Input
              addonBefore="right"
              //   onKeyDown={(e) => onKeyDown(e, 'right')}
              //   onChange={(e) => handleChange(e, 'right')}
              //   value={valuer}
            />
          </Col>
        </Row>
      </Input.Group>
      <Input.Group>
        <Row>
          <Col span={11} offset={0}>
            <Input
              addonBefore="bottom"
              //   onKeyDown={(e) => onKeyDown(e, 'bottom')}
              //   onChange={(e) => handleChange(e, 'bottom')}
              //   value={valueb}
            />
          </Col>

          <Col span={11} offset={2}>
            <Input
              addonBefore="left"
              //   onKeyDown={(e) => onKeyDown(e, 'left')}
              //   onChange={(e) => handleChange(e, 'left')}
              //   value={valuel}
            />
          </Col>
        </Row>
      </Input.Group>
    </Form.Item>
  );
};

export { Padding };
