import _ from 'lodash';
import { useEditor } from '../../Hooks/Editor.hook';
import { Form, Input } from 'antd';
import { useVisibility } from '../../Hooks/Attribute.hook';

const ATTRIBUTE = 'border-radius';

interface BorderRadiusProps {
  activePath?: string;
}

export const BorderRadius = ({ activePath }: BorderRadiusProps) => {
  const { mjmlJson, setMjmlJson } = useEditor();
  const [visible, path] = useVisibility({ attribute: ATTRIBUTE, customPath: activePath });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (visible && e.target.value) {
      if (e.target.value === '') {
        e.target.value = 'none';
      }
      setValue(e.currentTarget.value);
    }
  };

  const setValue = (value: string) => {
    if (path) {
      if (value === '') {
        value = 'none';
      }
      let element = _.get(mjmlJson, path);
      element.attributes[ATTRIBUTE] = value;
      const json = _.set(mjmlJson, path, element);
      setMjmlJson({ ...json });
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.currentTarget.value.length === 1 && e.key === 'Backspace') {
      e.currentTarget.value = '';
    }

    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      if (visible) {
        const attributes = _.get(mjmlJson, path + 'attributes');
        let value = attributes['border-radius'];
        const re = new RegExp(/^\d+/);
        const match = re.exec(value);
        let matchedValue = match ? parseInt(match[0]) : 0;
        if (e.key === 'ArrowUp') {
          value = value.replace(/^\d+/, matchedValue + 1);
        } else if (e.key === 'ArrowDown' && matchedValue > 0) {
          value = value.replace(/^\d+/, matchedValue - 1);
        }
        e.currentTarget.value = value;
        setValue(value);
      }
    }
  };

  let value = '';
  if (visible) {
    value = _.get(mjmlJson, path + 'attributes.border-radius');
  }

  return visible ? (
    <Form.Item label="Border Radius">
      <Input onChange={handleChange} value={value} onKeyDown={onKeyDown} />
    </Form.Item>
  ) : null;
};
