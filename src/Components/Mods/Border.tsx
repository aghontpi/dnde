import _ from 'lodash';
import { Col, Form, Input, Row, Space, Switch, Typography } from 'antd';
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
      <Row justify="space-between">
        <Col flex="none">
          <Typography.Text>{label ? label : 'Border Control :'}</Typography.Text>
        </Col>
        <Col flex="none">
          <Typography.Text style={{ paddingRight: '8px', fontSize: '12px' }}>Advanced</Typography.Text>
          <Switch size="small" checked={isAdvanced} onChange={() => setIsAdvanced(!isAdvanced)} />
        </Col>
      </Row>

      <Row style={{ paddingTop: '8px' }} gutter={[24, 16]}>
        <Col span={24} style={{ display: !isAdvanced ? 'block' : 'none' }}>
          <Typography.Text style={{ fontSize: '12px' }}>All Directions </Typography.Text>
          <BorderCollection direction={BorderDirection.All} activePath={activePath} />
        </Col>
        <Col span={12} style={{ display: isAdvanced ? 'block' : 'none' }}>
          <Typography.Text style={{ fontSize: '12px' }}>Top</Typography.Text>
          <BorderCollection direction={BorderDirection.Top} activePath={activePath} />
        </Col>

        <Col span={12} style={{ display: isAdvanced ? 'block' : 'none' }}>
          <Typography.Text style={{ fontSize: '12px' }}>Right</Typography.Text>
          <BorderCollection direction={BorderDirection.Right} activePath={activePath} />
        </Col>

        <Col span={12} style={{ display: isAdvanced ? 'block' : 'none' }}>
          <Typography.Text style={{ fontSize: '12px' }}>Left</Typography.Text>
          <BorderCollection direction={BorderDirection.Left} activePath={activePath} />
        </Col>

        <Col span={12} style={{ display: isAdvanced ? 'block' : 'none' }}>
          <Typography.Text style={{ fontSize: '12px' }}>Bottom</Typography.Text>
          <BorderCollection direction={BorderDirection.Bottom} activePath={activePath} />
        </Col>
      </Row>
    </Form.Item>
  ) : null;
};
