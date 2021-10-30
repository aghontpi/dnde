import _ from 'lodash';
import { Form } from 'antd';
import { useVisibility } from '../../Hooks/Attribute.hook';
import { BorderCollection, BorderDirection } from './BorderCollection';

const ATTRIBUTE = 'border';

interface BorderProps {
  activePath?: string;
  label?: string;
  attribute_name?: string;
}

export const Border = ({ activePath, label, attribute_name }: BorderProps) => {
  let attributeName = attribute_name || ATTRIBUTE;

  const [visible, _path] = useVisibility({ attribute: attributeName, customPath: activePath });

  return visible ? (
    <Form.Item label={label ? label : 'Border'}>
      <BorderCollection direction={BorderDirection.All} activePath={activePath} />
    </Form.Item>
  ) : null;
};
