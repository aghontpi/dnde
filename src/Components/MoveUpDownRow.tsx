import { VerticalAlignTopOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons';
import { Button } from 'antd';

const MoveUp = () => {
  return <Button type="primary" icon={<VerticalAlignTopOutlined style={{ fontSize: '22px' }} />} />;
};

const MoveDown = () => {
  return <Button type="primary" icon={<VerticalAlignBottomOutlined style={{ fontSize: '22px' }} />} />;
};

export { MoveUp, MoveDown };
