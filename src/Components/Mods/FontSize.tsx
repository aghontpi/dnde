import { useValue, useVisibility } from '../../Hooks/Attribute.hook';
import { Form, Input } from 'antd';
import { useEditor } from '../../Hooks/Editor.hook';
import { ChangeEvent } from 'react';
import _ from 'lodash';

const ATTRIBUTE = 'font-size';

export const FontSize = () => {
  const [visible, path] = useVisibility({ attribute: ATTRIBUTE });
  const { mjmlJson, setMjmlJson } = useEditor();
  const { getValue } = useValue({ path, visible, attribute: ATTRIBUTE });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.currentTarget.value;
    if (path && visible) {
      let json = {};
      let element = _.get(mjmlJson, path);
      element.attributes[ATTRIBUTE] = value;
      json = _.set(mjmlJson, path, element);
      setMjmlJson({ ...json });
    }
  };

  return visible ? (
    <Form.Item label="FontSize">
      <Input onChange={handleChange} value={getValue()} />
    </Form.Item>
  ) : null;
};
