import _ from 'lodash';
import { useEditor } from '../../Hooks/Editor.hook';
import { Form, Input } from 'antd';
import { useValue, useVisibility } from '../../Hooks/Attribute.hook';

const ATTRIBUTE = 'border';

export const Border = () => {
  const [visible, path] = useVisibility();
  const { mjmlJson, setMjmlJson } = useEditor();
  const { getValue } = useValue({ path, visible, attribute: ATTRIBUTE });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    <Form.Item label="Border">
      <Input onChange={handleChange} value={getValue()} onKeyDown={onKeyDown} />
    </Form.Item>
  ) : null;
};
