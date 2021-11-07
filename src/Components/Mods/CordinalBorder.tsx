import _ from 'lodash';
import { Form } from 'antd';
import { useVisibility } from '../../Hooks/Attribute.hook';
import { BorderCollection, BorderDirection } from './BorderCollection';

interface CordinalBorderProps {
  activePath?: string;
}
export const CordinalBorder = ({ activePath }: CordinalBorderProps) => {
  const [visible, _path] = useVisibility({ attribute: 'border-top', customPath: activePath });

  return visible ? (
    <Form.Item label="Border Directions">
      <Form.Item label="Top">
        <BorderCollection activePath={activePath} direction={BorderDirection.Top} />
      </Form.Item>
      <Form.Item label="Bottom">
        <BorderCollection activePath={activePath} direction={BorderDirection.Bottom} />
      </Form.Item>
      <Form.Item label="Left">
        <BorderCollection activePath={activePath} direction={BorderDirection.Left} />
      </Form.Item>
      <Form.Item label="Right">
        <BorderCollection activePath={activePath} direction={BorderDirection.Right} />
      </Form.Item>
    </Form.Item>
  ) : null;
};
