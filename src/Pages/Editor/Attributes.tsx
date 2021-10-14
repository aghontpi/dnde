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

const { TabPane } = Tabs;

const CustomTabs = styled(Tabs)`
  .ant-tabs-content {
    height: 100%;
  }
`;

export const Attributes = () => {
  const { mjmlJson } = useEditor();
  return (
    <CustomTabs defaultActiveKey="1" centered style={{ height: '100%' }}>
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
            <Width />
            <Height />
            <Align />
            <Content />
            <FontSize />
            <FontFamily />
            <Padding />
            <InnerPadding />
            <ContainerBackground />
            <Background />
            <Border />
            <CordinalBorder />
            <BorderRadius />
            <Link />
            <Img />
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
    </CustomTabs>
  );
};
