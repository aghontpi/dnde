import _ from 'lodash';
import { useEditor } from '../../Hooks/Editor.hook';
import { Form, Input, Row, Col, Select } from 'antd';
import { useVisibility } from '../../Hooks/Attribute.hook';
import { BORDER_CONFIG } from './BorderConfig'

interface CordinalBorderProps {
  activePath?: string;
}
export const CordinalBorder = ({ activePath }: CordinalBorderProps) => {
  const { mjmlJson, setMjmlJson } = useEditor();
  const [visible, path] = useVisibility({ attribute: 'border-top', customPath: activePath });

  const handleChange = (inputValue: string, direction: string) => {
    if (visible && path && inputValue) {
      setValue(direction, inputValue);
    }
  };

  const setValue = (direction: string, value: string) => {
    if (path) {
      if (value === '') {
        value = 'none';
      }
      let element = _.get(mjmlJson, path);
      element.attributes[`border-${direction}`] = value;
      const json = _.set(mjmlJson, path, element);
      setMjmlJson({ ...json });
    }
  };

  let [valuel, valuer, valueb, valuet] = ['', '', '', ''];
  if (visible) {
    valuel = _.get(mjmlJson, path + 'attributes.border-left');
    valuer = _.get(mjmlJson, path + 'attributes.border-right');
    valuet = _.get(mjmlJson, path + 'attributes.border-top');
    valueb = _.get(mjmlJson, path + 'attributes.border-bottom');
  }

  return visible ? (
    <Form.Item label="Border Directions">
      <Input.Group style={{ marginBottom: '6px' }}>
        <Row>
          <Col span={10}>
            <Form.Item label="Top">
              <Select
                value={valuet}
                style={{ width: 120 }}
                options={BORDER_CONFIG}
                onChange={(e) => handleChange(e, 'top')}
              />
            </Form.Item>
          </Col>
          <Col span={10} offset={1}>
            <Form.Item label="Right">
              <Select
                value={valuer}
                style={{ width: 120 }}
                options={BORDER_CONFIG}
                onChange={(e) => handleChange(e, 'right')}
              />
            </Form.Item>
         </Col>
        </Row>
      </Input.Group>
      <Input.Group>
        <Row>
          <Col span={10}>
            <Form.Item label="Bottom">
              <Select
                value={valueb}
                style={{ width: 120 }}
                options={BORDER_CONFIG}
                onChange={(e) => handleChange(e, 'bottom')}
              />
            </Form.Item>
          </Col>
          <Col span={10} offset={1}>
            <Form.Item label="Left">
              <Select
                value={valuel}
                style={{ width: 120 }}
                options={BORDER_CONFIG}
                onChange={(e) => handleChange(e, 'left')}
              />
            </Form.Item>
          </Col>
        </Row>
      </Input.Group>
    </Form.Item>
  ) : null;
};
