import { useVisibility } from '../../Hooks/Attribute.hook';
import { Form, Input } from 'antd';
import { useEditor } from '../../Hooks/Editor.hook';
import { ChangeEvent, useEffect, useState } from 'react';
import _ from 'lodash';

const PROPERTY = 'content';

export const Content = () => {
  const [visible, path] = useVisibility({ property: PROPERTY });
  const { mjmlJson, setMjmlJson } = useEditor();
  const [value, setValue] = useState('');
  const [isReadOnly, setIsReadOnly] = useState<boolean | null>(null);

  useEffect(() => {
    if (visible && path) {
      let item = _.get(mjmlJson, path);
      if (item && item.content) {
        setValue(item.content);

        // maintain read only state for some attributes
        if (item.tagName === 'mj-text') {
          setIsReadOnly(true);
        } else {
          setIsReadOnly(false);
        }
      }
    }
  }, [visible, path]);

  useEffect(() => {
    if (value) {
      let json = {};
      let element = _.get(mjmlJson, path);
      // while in middle of editing, if the element is removed.
      if (element) {
        element[PROPERTY] = value;
        if (element[PROPERTY] !== value) {
          json = _.set(mjmlJson, path, element);
          setMjmlJson({ ...json });
        }
      }
    }
  }, [value]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    let value = e.currentTarget.value;
    if (path && visible) {
      setValue(value);
    }
  };

  return visible ? (
    <Form.Item label="Content">
      <Input.TextArea
        disabled={isReadOnly ? isReadOnly : false}
        readOnly={isReadOnly ? isReadOnly : false}
        rows={3}
        onChange={handleChange}
        value={value}
      />
    </Form.Item>
  ) : null;
};
