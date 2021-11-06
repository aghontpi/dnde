import _ from 'lodash';
import { Col, Form, Input, Row, Typography } from 'antd';
import { useVisibility } from '../../Hooks/Attribute.hook';
import { BorderCollection, BorderDirection } from './BorderCollection';
import { useState } from 'react';

const ATTRIBUTE = 'border';

interface BorderProps {
  activePath?: string;
  label?: string;
  attribute_name?: string;
}

export const Border = ({ activePath, label, attribute_name }: BorderProps) => {
  let attributeName = attribute_name || ATTRIBUTE;
  const [isAdvanced, setIsAdvanced] = useState<boolean>(false);

  // CHANGES FOR ADVANCED OPTION UI CHANGE
  // possibility of 'border' be not present, but one-of 'border-left' 'right' 'bottom' 'right' be present
  // change this to 'onMount' nd check.
  const [visible, _path] = useVisibility({ attribute: attributeName, customPath: activePath });

  return visible ? (
    <Form.Item>
      <Row>
        <Col span={24}>
          <Typography.Text>{label ? label : 'Border Control :'}</Typography.Text>
        </Col>
      </Row>
      <Row style={{ paddingTop: '8px' }}>
        <Col span={12}>
          <BorderCollection direction={BorderDirection.All} activePath={activePath} />
        </Col>
      </Row>
    </Form.Item>
  ) : null;
};
