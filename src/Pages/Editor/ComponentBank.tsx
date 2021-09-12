import { Collapse } from 'antd';
import { Button } from '../../Components/Button';
import { CaretDownOutlined } from '@ant-design/icons';
import css from './Editor.module.scss';
import '../../Assets/Css/antoveride.scss';

const { Panel } = Collapse;

const Header = ({ title }: { title: string }) => {
  return <p className={css.title}>{title}</p>;
};

export const ComponentBank = () => {
  return (
    <Collapse
      expandIconPosition={'right'}
      bordered={false}
      defaultActiveKey={['1']}
      style={{ backgroundColor: 'rgb(255,255,255)' }}
      expandIcon={({ isActive }) => <CaretDownOutlined rotate={isActive ? 0 : 180} />}
    >
      <Panel header={<Header title="Components" />} key="1">
        <div className={css.heading}></div>
        <div className={css.components}>
          <Button />
          <Button />
        </div>
      </Panel>
    </Collapse>
  );
};
