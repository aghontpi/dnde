import _ from 'lodash';
import { ChangeEvent, useEffect, useState } from 'react';
import { useEditor } from '../../Hooks/Editor.hook';
import { Col, Input, Row } from 'antd';
import { useValue, useVisibility } from '../../Hooks/Attribute.hook';
import FormItem from 'antd/lib/form/FormItem';

const ATTRIBUTE = 'href';

const Link = () => {
  const [visible, path] = useVisibility({ attribute: ATTRIBUTE });
  const { mjmlJson, setMjmlJson } = useEditor();
  const { getValue } = useValue({ path, visible, attribute: ATTRIBUTE });
  const [value, setValue] = useState('');

  useEffect(() => {
    if (visible) {
      setValue(getValue());
    }
  }, [visible, path]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (path && visible) {
      setValueInState(e.target.value);
    }
  };

  const setValueInState = (userValue: string) => {
    let json = {};
    let element = _.get(mjmlJson, path);
    element.attributes[ATTRIBUTE] = userValue;
    json = _.set(mjmlJson, path, element);
    setMjmlJson({ ...json });
  };

  // if entered url does not contain 'https://' | 'http://' add it on blur event,
  // after the user finises typing.
  const onBlur = (e: any) => {
    if (e && e.target && e.target.value) {
      const url = addHttps(e.target.value);
      setValueInState(url);
      setValue(url);
    }
  };

  return visible ? (
    <FormItem>
      <Row>
        <Col span={24}>
          <Input addonBefore={ATTRIBUTE} onBlur={onBlur} onChange={handleChange} value={value} />
        </Col>
      </Row>
    </FormItem>
  ) : null;
};

const addHttps = (url: string) => {
  url = url.trim();
  if (url && !url.includes('https://') && !url.includes('http://')) {
    url = `https://${url}`;
  }
  return url;
};

export { Link, addHttps };
