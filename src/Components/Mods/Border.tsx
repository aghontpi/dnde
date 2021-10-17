import _ from 'lodash';
import { useEditor } from '../../Hooks/Editor.hook';
import { Form, Input } from 'antd';
import { useValue, useVisibility } from '../../Hooks/Attribute.hook';
import { useEffect, useState } from 'react';

const ATTRIBUTE = 'border';

interface BorderProps {
  activePath?: string;
  label?: string;
  attribute_name?: string;
}

export const Border = ({ activePath, label, attribute_name }: BorderProps) => {
  let attributeName = attribute_name || ATTRIBUTE;
  const [visible, path] = useVisibility({ attribute: attributeName, customPath: activePath });
  const { mjmlJson, setMjmlJson } = useEditor();
  const { getValue } = useValue({ path, visible, attribute: attributeName });

  const [value, setValue] = useState('');

  useEffect(() => {
    if (visible) {
      setValue(getValue());
    }
  }, [visible]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (visible && path && e.target.value) {
      let json = {};
      let element = _.get(mjmlJson, path);
      element.attributes[attributeName] = e.target.value;
      json = _.set(mjmlJson, path, element);
      setMjmlJson({ ...json });
    }
  };

  return visible ? (
    <Form.Item label={label ? label : 'Border'}>
      <Input onChange={handleChange} value={value} onKeyDown={onKeyDown} />
    </Form.Item>
  ) : null;
};

const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.currentTarget.value.length === 1 && e.key === 'Backspace') {
    e.currentTarget.value = '';
  }
};
