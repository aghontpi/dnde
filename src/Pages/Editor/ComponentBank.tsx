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
import { floor } from 'lodash';
import { BorderRadius } from '../../Components/Mods/BorderRadius';

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
        defaultActiveKey={['2']}
        style={{ backgroundColor: 'rgb(255,255,255)' }}
        expandIcon={({ isActive }) => <CaretDownOutlined rotate={isActive ? 0 : 180} />}
      >
        <Panel header={<Header title="Drag & Drop Section" />} key="1">
          {[1, 2, 3, 4, 5, 6].map((value, index) => {
            return (
              <>
                <Row className={css.sectionTitle}>
                  <p>{value} Column</p>
                </Row>
                <Row className={css.rows} draggable={true}>
                  <div className={css.singleColumnWrapper}>
                    <div className={css.child1}>
                      <Generator length={value} />
                    </div>
                  </div>
                </Row>
              </>
            );
          })}
        </Panel>
        <Panel header={<Header title="Drag & Drop Content" />} key="2">
          <div className={css.components}>
            <Button />
            <Text />
            <Image />
            <Spacer />
            <Divider />
            <Html />
          </div>
        </Panel>
      </Collapse>
    </Scrollbars>
  );
};

const Generator = ({ length }: { length: number }) => {
  let content = [];
  const flexGrow = floor(100 / length);

  for (let i = 0; i < length; i++) {
    content.push(
      <div
        style={{
          display: 'flex',
          flexGrow,
          height: '16px',
          borderRight: i === length - 1 ? '' : '1px solid rgb(85, 85, 85)',
          borderRadius: '0px',
        }}
      ></div>
    );
  }
  return <>{content}</>;
};
