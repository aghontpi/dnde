import { Form, Select } from 'antd';
import _ from 'lodash';
import { useValue, useVisibility } from '../../Hooks/Attribute.hook';
import { useEditor } from '../../Hooks/Editor.hook';
import { FONTS_CONFIG } from './FontConfig';

const ATTRIBUTE = 'font-family';

const { Option } = Select;

export const FontFamily = () => {
  const [visible, path] = useVisibility({ attribute: ATTRIBUTE });
  const { mjmlJson, setMjmlJson } = useEditor();
  const { getValue } = useValue({ path, visible, attribute: ATTRIBUTE });

  const handleChange = (value: string) => {
    if (visible && path) {
      let item = _.get(mjmlJson, path);
      if (item) {
        item.attributes['font-family'] = value;
        const updated = _.set(mjmlJson, path, item);
        if (updated) {
          setMjmlJson({ ...updated });
        }
      }
    }
  };

  return visible ? (
    <Form.Item label="Font Family">
      <Select value={getValue()} onChange={handleChange}>
        {FONTS_CONFIG.map((font) => {
          const name = font.name.trim();
          return (
            <Option key={name} value={name}>
              {name}
            </Option>
          );
        })}
      </Select>
    </Form.Item>
  ) : null;
};
