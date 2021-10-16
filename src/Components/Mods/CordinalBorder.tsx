import _ from 'lodash';
import { useEditor } from '../../Hooks/Editor.hook';
import { Form, Input, Row, Col } from 'antd';
import { useVisibility } from '../../Hooks/Attribute.hook';

interface CordinalBorderProps {
  activePath?: string;
}
export const CordinalBorder = ({ activePath }: CordinalBorderProps) => {
  const { mjmlJson, setMjmlJson } = useEditor();
  const [visible, path] = useVisibility({ attribute: 'border-top', customPath: activePath });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, direction: string) => {
    if (visible && path && e.target.value) {
      if (e.target.value === '') {
        e.target.value = '';
      }
      setValue(direction, e.target.value);
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

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, direction: string) => {
    if (e.currentTarget.value.length === 1 && e.key === 'Backspace') {
      e.currentTarget.value = '';
    }

    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      if (visible) {
        const attributes = _.get(mjmlJson, path + 'attributes');
        let value = attributes['border-' + direction];
        const re = new RegExp(/^\d+/);
        const match = re.exec(value);
        let matchedValue = match ? parseInt(match[0]) : 0;
        if (e.key === 'ArrowUp') {
          value = value.replace(/^\d+/, matchedValue + 1);
        } else if (e.key === 'ArrowDown' && matchedValue > 0) {
          value = value.replace(/^\d+/, matchedValue - 1);
        }
        e.currentTarget.value = value;

        setValue(direction, e.currentTarget.value);
      }
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
          <Col span={11} offset={0}>
            <Input
              addonBefore="top"
              onKeyDown={(e) => onKeyDown(e, 'top')}
              onChange={(e) => handleChange(e, 'top')}
              value={valuet}
            />
          </Col>
          <Col span={11} offset={2}>
            <Input
              addonBefore="right"
              onKeyDown={(e) => onKeyDown(e, 'right')}
              onChange={(e) => handleChange(e, 'right')}
              value={valuer}
            />
          </Col>
        </Row>
      </Input.Group>
      <Input.Group>
        <Row>
          <Col span={11} offset={0}>
            <Input
              addonBefore="bottom"
              onKeyDown={(e) => onKeyDown(e, 'bottom')}
              onChange={(e) => handleChange(e, 'bottom')}
              value={valueb}
            />
          </Col>

          <Col span={11} offset={2}>
            <Input
              addonBefore="left"
              onKeyDown={(e) => onKeyDown(e, 'left')}
              onChange={(e) => handleChange(e, 'left')}
              value={valuel}
            />
          </Col>
        </Row>
      </Input.Group>
    </Form.Item>
  ) : null;
};
