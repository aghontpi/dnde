import { Form, Select } from 'antd';
import _ from 'lodash';
import { useValue, useVisibility } from '../../Hooks/Attribute.hook';
import { useEditor } from '../../Hooks/Editor.hook';
import { useFonts } from '../../Hooks/useFonts';

const ATTRIBUTE = 'font-family';

const { Option } = Select;

export const FontFamily = () => {
  const [visible, path] = useVisibility({ attribute: ATTRIBUTE });
  const { mjmlJson, setMjmlJson } = useEditor();
  const { getValue } = useValue({ path, visible, attribute: ATTRIBUTE });
  const [fontlist, fontvalue] = useFonts();

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

  let value = '';

  if (visible && path) {
    value = getValue();
    if (value && value.indexOf(',') > -1) {
      value = value.split(',')[0];
    }
  }

  return visible ? (
    <Form.Item label="Font Family">
      <Select value={fontvalue} onChange={handleChange}>
        {fontlist.map((name: string) => {
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
