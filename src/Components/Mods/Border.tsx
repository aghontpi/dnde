import _ from 'lodash';
import { useEditor } from '../../Hooks/Editor.hook';
import { Form, Select } from 'antd';
import { useValue, useVisibility } from '../../Hooks/Attribute.hook';
import { useEffect, useState } from 'react';
import { BORDER_CONFIG } from './BorderConfig';

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

  const handleChange = (inputValue: string) => {
    setValue(inputValue);
    if (visible && path && inputValue) {
      let json = {};
      let element = _.get(mjmlJson, path);
      element.attributes[attributeName] = inputValue;
      json = _.set(mjmlJson, path, element);
      setMjmlJson({ ...json });
    }
  };

  return visible ? (
    <Form.Item label={label ? label : 'Border'}>
      <Select value={value} style={{ width: 120 }} options={BORDER_CONFIG} onChange={handleChange} />
    </Form.Item>
  ) : null;
};
