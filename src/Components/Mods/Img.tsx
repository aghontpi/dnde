import _ from 'lodash';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useEditor } from '../../Hooks/Editor.hook';
import { useHtmlWrapper } from '../../Hooks/Htmlwrapper.hook';
import { findUniqueIdentifier } from '../../Utils/closestParent';
import { findElementInJson } from '../../Utils/findElementInMjmlJson';
import { Col, Form, Input, Row } from 'antd';

const Img = () => {
  const [visible, setVisible] = useState(false);
  const [path, setPath] = useState('');
  const { mjmlJson, setMjmlJson } = useEditor();

  const { active } = useHtmlWrapper();

  useEffect(() => {
    if (active) {
      const uniqueIdentifier = findUniqueIdentifier(active, active.classList);
      if (uniqueIdentifier) {
        let path = findElementInJson(mjmlJson, uniqueIdentifier);
        if (path) {
          const [, pathToElement] = path;
          if (pathToElement.length > 0) {
            setPath(pathToElement.slice(1));
          }

          const item = _.get(mjmlJson, pathToElement.slice(1));
          if (item.mutableProperties && item.mutableProperties.includes('src')) {
            setVisible(true);
            return;
          }
        }
      }
    }
    setVisible(false);
  }, [active, mjmlJson]);

  //todo: check if changing directly to mjmlJson causes perfomance impact
  //   if so, then maintain a local state, then on change change the value first,
  //   then by using useeffect listen for the in localvalue, then update the mjmlJson.
  const handleChange = useMemo(
    () => (e: ChangeEvent<HTMLInputElement>) => {
      let value = e.currentTarget.value;
      if (path && visible) {
        let json = {};
        let element = _.get(mjmlJson, path);
        element.attributes['src'] = value;
        json = _.set(mjmlJson, path, element);
        setMjmlJson({ ...json });
      }
    },
    [mjmlJson]
  );

  const getValue = useMemo(
    () => () => {
      let value = '';
      if (path && visible) {
        let element = _.get(mjmlJson, path);
        if (element && element.attributes) value = element.attributes['src'];
      }
      return value;
    },
    [path, visible, mjmlJson]
  );

  return visible ? (
    <Row>
      <Col span={24}>
        <Input addonBefore="src" onChange={(e) => handleChange(e)} value={getValue()} />
      </Col>
    </Row>
  ) : null;
};

export { Img };
