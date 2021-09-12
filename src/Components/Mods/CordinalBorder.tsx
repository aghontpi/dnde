import _ from 'lodash';
import styled from 'styled-components';
import { useEditor } from '../../Hooks/Editor.hook';
import { Form, Input, Layout, Row, Col } from 'antd';

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  line-height: 2;
  label {
    font-size: 16px;
    font-weight: bold;
  }
  div {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    div {
      width: 50%;
      justify-content: space-between;

      label: {
        font-size: 16px;
        font-weight: bold;
      }
      input {
        border: 1px solid black;
        width: 60%;
        min-height: 26px;
        border-radius: 2px;
        :focus-visible {
          outline: unset;
        }
      }
    }
  }
`;

export const CordinalBorder = () => {
  const { active, setActive, mjmlJson } = useEditor();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, direction: string) => {
    if (active && e.target.value) {
      if (e.target.value === '') {
        e.target.value = 'none';
      }
      const attributes = _.get(mjmlJson, active.path.slice(1) + 'attributes');
      changeValue(active, attributes, direction, e, setActive);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, direction: string) => {
    if (e.currentTarget.value.length === 1 && e.key === 'Backspace') {
      e.currentTarget.value = '';
    }

    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      if (active.path) {
        const attributes = _.get(mjmlJson, active.path.slice(1) + 'attributes');
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
        changeValue(active, attributes, direction, e, setActive);
      }
    }
  };

  let [valuel, valuer, valueb, valuet] = ['', '', '', ''];
  if (active.path) {
    valuel = _.get(mjmlJson, active.path.slice(1) + 'attributes.border-left');
    valuer = _.get(mjmlJson, active.path.slice(1) + 'attributes.border-right');
    valuet = _.get(mjmlJson, active.path.slice(1) + 'attributes.border-top');
    valueb = _.get(mjmlJson, active.path.slice(1) + 'attributes.border-bottom');
  }

  return active.path ? (
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

const changeValue = (
  active: any,
  attributes: any,
  direction: string,
  e: React.KeyboardEvent<HTMLInputElement> | React.ChangeEvent<HTMLInputElement>,
  setActive: (v: any) => void
) => {
  switch (direction) {
    case 'left':
      setActive({ ...active, change: { ...attributes, 'border-left': e.currentTarget.value } });
      break;
    case 'right':
      setActive({ ...active, change: { ...attributes, 'border-right': e.currentTarget.value } });
      break;
    case 'top':
      setActive({ ...active, change: { ...attributes, 'border-top': e.currentTarget.value } });
      break;
    case 'bottom':
      setActive({ ...active, change: { ...attributes, 'border-bottom': e.currentTarget.value } });
      break;
    default:
      console.error(`unable to handle ${direction} `);
  }
};
