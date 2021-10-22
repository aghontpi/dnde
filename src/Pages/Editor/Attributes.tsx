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
import { Tabs } from 'antd';
import { ColumnSelector } from '../../Components/ColumnSelector';
import { FontFamily } from '../../Components/Mods/FontFamily';
import { UNDOREDO } from '../../Utils/undoRedo';
import { useEditor } from '../../Hooks/Editor.hook';
import { VerticalAlign } from '../../Components/Mods/VerticalAlign';
import { BackgroundImage } from '../../Components/Mods/BackgroundImage';
import { ColumnAttributes } from '../../Components/ColumnAttributes';
import { useHtmlWrapper } from '../../Hooks/Htmlwrapper.hook';
import { useEffect, useState } from 'react';
import { LineHeight } from '../../Components/Mods/LineHeight';

const { TabPane } = Tabs;

const CustomTabs = styled(Tabs)`
  .ant-tabs-content {
    height: 100%;
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
    <CustomTabs defaultActiveKey="1" centered style={{ height: '100%' }} destroyInactiveTabPane={true}>
      <TabPane tab="Attributes" key="1">
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
      </TabPane>
      <TabPane tab="Column Layout" key="2">
        <Scrollbars style={{ height: '100%' }} autoHide={true}>
          <div className={css.columns}>
            <ColumnSelector />
          </div>
        </Scrollbars>
      </TabPane>
      <TabPane tab="Column Properties" key="3">
        <Scrollbars style={{ height: '100%' }} autoHide={true}>
          <ColumnAttributes />
        </Scrollbars>
      </TabPane>
    </CustomTabs>
  );
};
