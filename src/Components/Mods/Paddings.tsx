import { Form, Input, Row, Col } from 'antd';
import _ from 'lodash';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useEditor } from '../../Hooks/Editor.hook';
import { useHtmlWrapper } from '../../Hooks/Htmlwrapper.hook';
import { findUniqueIdentifier } from '../../Utils/closestParent';
import { findElementInJson } from '../../Utils/findElementInMjmlJson';

const Padding = () => {
  const [visible, setVisible] = useState(false);
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(0);
  const [top, setTop] = useState(0);
  const [bottom, setBottom] = useState(0);
  const { active } = useHtmlWrapper();
  const { mjmlJson, setMjmlJson } = useEditor();
  const [path, setPath] = useState('');
  useEffect(() => {
    console.log(left, right, top, bottom);
  }, [left, top, bottom, right]);

  useEffect(() => {
    if (active) {
      const uniqueIdentifier = findUniqueIdentifier(active, active.classList);
      if (uniqueIdentifier) {
        let path = findElementInJson(mjmlJson, uniqueIdentifier);
        if (path) {
          const [, pathToElement] = path;
          if (pathToElement.length > 0) {
            setPath(pathToElement);
          }
          const item = _.get(mjmlJson, pathToElement.slice(1));
          if (item.mutableProperties.includes('padding')) {
            setVisible(true);
            setLeft(item.attributes['padding-left']);
            setRight(item.attributes['padding-right']);
            setTop(item.attributes['padding-top']);
            setBottom(item.attributes['padding-bottom']);
          }
        }
      }
    }
  }, [active]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, direction: string) => {
    const value = e.currentTarget.value;
    // if (value === '') {
    //   e.currentTarget.value = '0px';
    // }
    // if (!value.includes('px')) {
    //   e.currentTarget.value = `${value}px`;
    // }
    setPadding(direction, e.currentTarget.value);
  };

  const setPadding = useMemo(
    () => (direction: string, value: string) => {
      //   if (value === '') {
      //     value = '0px';
      //   }
      if (path && visible) {
        let json = {};

        if (direction) {
          let element = _.get(mjmlJson, path.slice(1));
          element.attributes[`padding-${direction}`] = value;
          json = _.set(mjmlJson, path, element);
          setMjmlJson({ ...json });
        }
      }
    },
    [left, right, top, bottom]
  );

  const getValue = (direction: string) => {
    let value = '';
    if (path && visible) {
      let element = _.get(mjmlJson, path.slice(1));
      value = element.attributes[`padding-${direction}`];
    }
    return value;
  };

  return (
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
  );
};

export { Padding };
