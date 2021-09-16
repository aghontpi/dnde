import { Form, Input, Row, Col } from 'antd';
import _ from 'lodash';
import { useEffect, useMemo, useState } from 'react';
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
    [left, right, top, bottom]
  );

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
