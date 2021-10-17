import _ from 'lodash';
import { useEditor } from '../../Hooks/Editor.hook';
import { Form, Input } from 'antd';
import { useValue, useVisibility } from '../../Hooks/Attribute.hook';
import { useCallback, useEffect, useState } from 'react';

const ATTRIBUTE = 'width';

interface WidthHeightProps {
  activePath?: string;
}

export const Width = ({ activePath }: WidthHeightProps) => {
  const [visible, path] = useVisibility({ attribute: ATTRIBUTE, customPath: activePath });

  const { mjmlJson, setMjmlJson } = useEditor();
  const [value, setValue] = useState<string>('');
  const { getValue } = useValue({ path, visible, attribute: ATTRIBUTE });

  useEffect(() => {
    if (visible) {
      setValue(getValue());
    }
  }, [visible]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (e.target.value === '' || e.target.value === '%') {
      e.target.value = '0';
    }
    if (visible && path && e.target.value) {
      let json = {};
      let element = _.get(mjmlJson, path);
      element.attributes[ATTRIBUTE] = e.target.value;
      json = _.set(mjmlJson, path, element);
      setMjmlJson({ ...json });
    }
  };
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.currentTarget.value.length === 1 && e.key === 'Backspace') {
      e.currentTarget.value = '';
    }
  };

  return visible ? (
    <Form.Item label="Width">
      <Input onChange={handleChange} value={value} onKeyDown={onKeyDown} />
    </Form.Item>
  ) : null;
};

const ATTRIBUTE_HEIGHT = 'height';

export const Height = () => {
  const [visible, path] = useVisibility({ attribute: ATTRIBUTE_HEIGHT });
  const { mjmlJson, setMjmlJson } = useEditor();
  const { getValue } = useValue({ path, visible, attribute: ATTRIBUTE_HEIGHT });
  const [value, setValue] = useState('');

  useEffect(() => {
    if (visible) {
      setValue(getValue());
    }
  }, [visible]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (e.target.value === '' || e.target.value === '%') {
      e.target.value = '';
    }
    if (visible && path && e.target.value) {
      let json = {};
      let element = _.get(mjmlJson, path);
      element.attributes[ATTRIBUTE_HEIGHT] = e.target.value;
      json = _.set(mjmlJson, path, element);
      setMjmlJson({ ...json });
    }
  };
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.currentTarget.value.length === 1 && e.key === 'Backspace') {
      e.currentTarget.value = '';
    }
  };

  return visible ? (
    <Form.Item label="Height">
      <Input onChange={handleChange} value={value} onKeyDown={onKeyDown} />
    </Form.Item>
  ) : null;
};
