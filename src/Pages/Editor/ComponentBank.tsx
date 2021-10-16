import { Col, Collapse, Row } from 'antd';
import { Button } from '../../Components/Button';
import { Text } from '../../Components/Text';
import { CaretDownOutlined } from '@ant-design/icons';
import css from './Editor.module.scss';
import '../../Assets/Css/antoveride.scss';
import Scrollbars from 'react-custom-scrollbars-2';
import { Image } from '../../Components/Image';
import { Spacer } from '../../Components/Spacer';
import { Html } from '../../Components/Html';
import { Divider } from '../../Components/Divider';
import { Section } from '../../Components/Section';
import { Social } from '../../Components/Social';

const { Panel } = Collapse;

const Header = ({ title }: { title: string }) => {
  return <p className={css.title}>{title}</p>;
};

export const ComponentBank = () => {
  return (
    <Scrollbars style={{ height: '100%' }} autoHide={true}>
      <Collapse
        expandIconPosition={'right'}
        bordered={false}
        defaultActiveKey={['1', '2']}
        style={{ backgroundColor: 'rgb(255,255,255)' }}
        expandIcon={({ isActive }) => <CaretDownOutlined rotate={isActive ? 0 : 180} />}
      >
        <Panel header={<Header title="Drag & Drop Section" />} key="1">
          <Section />
        </Panel>
        <Panel header={<Header title="Drag & Drop Content" />} key="2">
          <div className={css.components}>
            <Button />
            <Text />
            <Image />
            <Spacer />
            <Divider />
            <Html />
            <Social />
          </div>
        </Panel>
      </Collapse>
    </Scrollbars>
  );
};
