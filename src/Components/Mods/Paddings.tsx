import { Form, Input, Row, Col } from 'antd';
import _ from 'lodash';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useEditor } from '../../Hooks/Editor.hook';
import { useHtmlWrapper } from '../../Hooks/Htmlwrapper.hook';
import { findUniqueIdentifier } from '../../Utils/closestParent';
import { findElementInJson } from '../../Utils/findElementInMjmlJson';

const Padding = () => {
  const [visible, setVisible] = useState(false);
  const { active } = useHtmlWrapper();
  const { mjmlJson, setMjmlJson } = useEditor();
  const [path, setPath] = useState('');

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
          if (item.mutableProperties && item.mutableProperties.includes('padding')) {
            setVisible(true);
            return;
          }
        }
      }
    }
    setVisible(false);
  }, [active]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, direction: string) => {
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
    [visible, path]
  );

  const getValue = (direction: string) => {
    let value = '';
    if (path && visible) {
      let element = _.get(mjmlJson, path.slice(1));
      value = element.attributes[`padding-${direction}`];
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
