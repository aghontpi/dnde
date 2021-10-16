import { Form, Input, Row, Col } from 'antd';
import _ from 'lodash';
import { ChangeEvent, useMemo } from 'react';
import { useVisibility } from '../../Hooks/Attribute.hook';
import { useEditor } from '../../Hooks/Editor.hook';

interface PaddingProps {
  activePath?: string;
}

const Padding = ({ activePath }: PaddingProps) => {
  let [visible, path, active] = useVisibility({ attribute: 'padding', customPath: activePath });
  const { mjmlJson, setMjmlJson } = useEditor();

  const handleChange = (e: ChangeEvent<HTMLInputElement>, direction: string) => {
    if (e.currentTarget.value === '') {
      e.currentTarget.value = '0';
    }
    // if (!value.includes('px')) {
    //   e.currentTarget.value = `${value}px`;
    // }
    setPadding(direction, e.currentTarget.value);
  };

  const setPadding = useMemo(
    () => (direction: string, value: string) => {
      if (path && visible) {
        let json = {};

        if (direction) {
          let element = _.get(mjmlJson, path);
          element.attributes[`padding-${direction}`] = value;
          json = _.set(mjmlJson, path, element);
          setMjmlJson({ ...json });
        }
      }
    },
    [visible, path]
  );

  //todo: optimize this function, move to useEffect, useState.
  // its being called on every hover event.
  const getValue = (direction: string) => {
    let value = '';
    //todo: debug why removing active causes crash  getValue:{@mods/pad..tsx}
    // move it to useeffect later
    if (path && visible && active) {
      let element = _.get(mjmlJson, path);
      if (!element) {
        return;
      }
      value = element.attributes ? element.attributes[`padding-${direction}`] : null;
      if (!value) {
        value = element.attributes['padding'];
        if (value) {
          const [vertical, horizontal] = value.split(' ');
          switch (direction) {
            case 'top':
            case 'bottom':
              return vertical;
            case 'left':
            case 'right':
              return horizontal;
          }
        }
      }
    }
    return value;
  };

  return visible ? (
    <Form.Item label="Padding :">
      <Input.Group style={{ marginBottom: '6px' }}>
        <Row>
          <Col span={11} offset={0}>
            <Input addonBefore="top" onChange={(e) => handleChange(e, 'top')} value={getValue('top')} />
          </Col>
          <Col span={11} offset={2}>
            <Input addonBefore="right" onChange={(e) => handleChange(e, 'right')} value={getValue('right')} />
          </Col>
        </Row>
      </Input.Group>
      <Input.Group>
        <Row>
          <Col span={11} offset={0}>
            <Input addonBefore="bottom" onChange={(e) => handleChange(e, 'bottom')} value={getValue('bottom')} />
          </Col>

          <Col span={11} offset={2}>
            <Input addonBefore="left" onChange={(e) => handleChange(e, 'left')} value={getValue('left')} />
          </Col>
        </Row>
      </Input.Group>
    </Form.Item>
  ) : null;
};

export { Padding };
