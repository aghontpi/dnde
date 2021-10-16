import { useVisibility } from '../../Hooks/Attribute.hook';
import { Form, Input } from 'antd';
import { useEditor } from '../../Hooks/Editor.hook';
import { ChangeEvent, useEffect, useState } from 'react';
import _ from 'lodash';
import { useHtmlWrapper } from '../../Hooks/Htmlwrapper.hook';

const PROPERTY = 'content';

export const Content = () => {
  const [visible, path] = useVisibility({ property: PROPERTY });
  const { mjmlJson, setMjmlJson } = useEditor();
  const [value, setValue] = useState('');
  const [isReadOnly, setIsReadOnly] = useState<boolean | null>(null);
  const [htmlBlock, setHtmlBlock] = useState(false);
  const { active } = useHtmlWrapper();

  useEffect(() => {
    if (visible && path) {
      let item = _.get(mjmlJson, path);
      if (item) {
        setValue(item.content ? item.content : '');

        // maintain read only state for some attributes
        if (item.tagName === 'mj-text') {
          if (item.attributes && item.attributes['css-class'] && item.attributes['css-class'].includes('html-block')) {
            setIsReadOnly(false);
            setHtmlBlock(true);
            return;
          }
          setIsReadOnly(true);
        } else {
          setIsReadOnly(false);
        }
        setHtmlBlock(false);
      }
    }
  }, [visible, path]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    let value = e.currentTarget.value;
    setValue(value);
    if (path && visible) {
      let element = _.get(mjmlJson, path);
      // while in middle of editing, if the element is removed.
      if (element) {
        if (element[PROPERTY] !== value) {
          element[PROPERTY] = value;
          const updated = _.set(mjmlJson, path, element);
          setMjmlJson({ ...updated });
        }
      }
    }
  };

  return visible ? (
    <Form.Item label="Content">
      {htmlBlock ? (
        <Input.TextArea rows={28} onChange={handleChange} value={value} />
      ) : (
        <Input.TextArea
          disabled={isReadOnly ? isReadOnly : false}
          readOnly={isReadOnly ? isReadOnly : false}
          rows={3}
          onChange={handleChange}
          value={value}
        />
      )}
    </Form.Item>
  ) : null;
};
