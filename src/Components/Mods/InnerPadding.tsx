import { Form, Input } from 'antd';
import _ from 'lodash';
import { ChangeEvent, useEffect, useState } from 'react';
import { useVisibility } from '../../Hooks/Attribute.hook';
import { useEditor } from '../../Hooks/Editor.hook';
import { logger } from '../../Utils/logger';
import { UpdateValue } from '../../Utils/operations';

const ATTRIBUTE = 'inner-padding';

const InnerPadding = () => {
  let [visible, path] = useVisibility({ attribute: ATTRIBUTE });
  const { mjmlJson, setMjmlJson } = useEditor();
  const [value, setValue] = useState<string>();

  useEffect(() => {
    if (visible && path) {
      const item = _.get(mjmlJson, path);
      if (item && item.attributes && item.attributes[ATTRIBUTE]) {
        setValue(item.attributes[ATTRIBUTE]);
      }
    }
  }, [visible, path]);

  useEffect(() => {
    value && UpdateValue({ visible, path, mjmlJson, setMjmlJson, value, attribute: ATTRIBUTE });
  }, [value]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    logger.log('inner padding value', value);
    if (path && visible) {
      setValue(value);
    }
  };

  return visible ? (
    <Form.Item label="Inner Padding :">
      <Input onChange={handleChange} type="text" value={value} />
    </Form.Item>
  ) : null;
};

export { InnerPadding };
