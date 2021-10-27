import { Scrollbars } from 'react-custom-scrollbars-2';
import { Align } from '../../Components/Mods/Align';
import { Background } from '../../Components/Mods/Background';
import { Border } from '../../Components/Mods/Border';
import { BorderRadius } from '../../Components/Mods/BorderRadius';
import { ContainerBackground } from '../../Components/Mods/ContainerBackground';
import { Content } from '../../Components/Mods/Content';
import { CordinalBorder } from '../../Components/Mods/CordinalBorder';
import { FontSize } from '../../Components/Mods/FontSize';
import { Img } from '../../Components/Mods/Img';
import { InnerPadding } from '../../Components/Mods/InnerPadding';
import { Link } from '../../Components/Mods/Link';
import { Padding } from '../../Components/Mods/Paddings';
import { Height, Width } from '../../Components/Mods/WidthHeight';
import styled from 'styled-components';
import css from './Editor.module.scss';
import { Drawer, Tabs } from 'antd';
import { ColumnSelector } from '../../Components/ColumnSelector';
import { FontFamily } from '../../Components/Mods/FontFamily';
import { UNDOREDO } from '../../Utils/undoRedo';
import { useEditor } from '../../Hooks/Editor.hook';
import { VerticalAlign } from '../../Components/Mods/VerticalAlign';
import { BackgroundImage } from '../../Components/Mods/BackgroundImage';
import { ColumnAttributes } from '../../Components/ColumnAttributes';
import { useHtmlWrapper } from '../../Hooks/Htmlwrapper.hook';
import { useEffect, useRef, useState } from 'react';
import { LineHeight } from '../../Components/Mods/LineHeight';
import { BodyAttributes } from '../../Components/BodyAttributes';

const { TabPane } = Tabs;

const CustomTabs = styled(Tabs)`
  .ant-tabs-content {
    height: 100%;
  }
  .ant-tabs-tab {
    padding: 8px 16px !important;
  }
  .ant-tabs-tabpane {
    padding-right: 0px !important;
  }
`;

export const Attributes = () => {
  const { mjmlJson } = useEditor();
  const { active } = useHtmlWrapper();
  const [isColumn, setIsColumn] = useState(false);

  useEffect(() => {
    if (active && active.classList && active.className.includes('mj-column')) {
      setIsColumn(true);
    }
    isColumn && setIsColumn(false);
  }, [active]);

  return (
    <CustomTabs
      tabPosition="right"
      defaultActiveKey="2"
      style={{ height: '100%' }}
      destroyInactiveTabPane={true}
      title={'Attributes'}
      size="small"
      tabBarGutter={1}
    >
      {/* <TabPane tab="Attributes" key="1">
        <Scrollbars style={{ height: '100%' }} autoHide={true}>
          <div
            className={css.mods}
            onMouseDown={(e) => {
              UNDOREDO.newAction(mjmlJson);
            }}
            onBlur={(e) => {
              UNDOREDO.newAction(mjmlJson);
            }}
          >
            {isColumn ? (
              <div style={{ textAlign: 'center' }}>
                The selected Item is a Column, to modify properties <h2> check "Column Properties" Tab</h2>
              </div>
            ) : (
              <>
                <Width />
                <Height />
                <Align />
                <VerticalAlign />
                <Content />
                <LineHeight />
                <FontSize />
                <FontFamily />
                <Padding />
                <InnerPadding />
                <ContainerBackground />
                <Background />
                <BackgroundImage />
                <Border />
                <Border label="Border Width" attribute_name="border-width" />
                <Border label="Border Style" attribute_name="border-style" />
                <Background label="Border Color" overrideAttribute="border-color" />
                <CordinalBorder />
                <BorderRadius />
                <Link />
                <Img />
              </>
            )}
          </div>
        </Scrollbars>
      </TabPane> */}

      <TabPane tab={<span style={{ fontSize: '12px' }}>layout</span>} key="2">
        <Scrollbars style={{ height: '100%' }} autoHide={true}>
          <div className={css.columns}>
            <ColumnSelector />
          </div>
        </Scrollbars>
      </TabPane>
      <TabPane
        tab={
          <>
            <span style={{ fontSize: '12px' }}>layout</span>
            <br />
            <span style={{ fontSize: '12px' }}>config</span>
          </>
        }
        key="3"
      >
        <Scrollbars style={{ height: '100%' }} autoHide={true}>
          <ColumnAttributes />
        </Scrollbars>
      </TabPane>
      <TabPane
        tab={
          <>
            <span style={{ fontSize: '12px' }}>body</span>
            <br />
            <span style={{ fontSize: '12px' }}>config</span>
          </>
        }
        key="4"
      >
        <Scrollbars style={{ height: '100%' }} autoHide={true}>
          <BodyAttributes />
        </Scrollbars>
      </TabPane>
    </CustomTabs>
  );
};

export const OnlyAttributesDrawer = () => {
  const { mjmlJson } = useEditor();
  const { active, setActive } = useHtmlWrapper();
  const [isDisabled, setIsDisabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [init, setInit] = useState(false);

  const onClose = () => {
    setVisible(false);
  };

  useEffect(() => {
    // wierd bug in antd
    if (active && !init) {
      setInit(true);
    }

    if (
      active &&
      ((active.classList && active.className.includes('mj-column')) ||
        (active.classList && active.className.includes('mj-body')))
    ) {
      setIsDisabled(true);
    } else {
      isDisabled && setIsDisabled(false);
    }
  }, [active]);

  useEffect(() => {
    if (!isDisabled && active) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [isDisabled, active]);

  return init ? (
    <Drawer
      destroyOnClose={true}
      width={'100%'}
      getContainer={false}
      title={
        <div style={{ textAlign: 'center' }}>
          <span>Attributes</span>
        </div>
      }
      style={{ position: 'absolute', height: '100%' }}
      onClose={onClose}
      visible={visible}
      maskClosable={false}
      mask={false}
      bodyStyle={{
        padding: '8px 0px',
      }}
    >
      <Scrollbars style={{ height: '100%' }} autoHide={true}>
        <div
          className={css.mods}
          onMouseDown={(e) => {
            UNDOREDO.newAction(mjmlJson);
          }}
          onBlur={(e) => {
            UNDOREDO.newAction(mjmlJson);
          }}
        >
          <Width />
          <Height />
          <Align />
          <VerticalAlign />
          <Content />
          <LineHeight />
          <FontSize />
          <FontFamily />
          <Padding />
          <InnerPadding />
          <ContainerBackground />
          <Background />
          <BackgroundImage />
          <Border />
          <Border label="Border Width" attribute_name="border-width" />
          <Border label="Border Style" attribute_name="border-style" />
          <Background label="Border Color" overrideAttribute="border-color" />
          <CordinalBorder />
          <BorderRadius />
          <Link />
          <Img />
        </div>
      </Scrollbars>
    </Drawer>
  ) : null;
};
