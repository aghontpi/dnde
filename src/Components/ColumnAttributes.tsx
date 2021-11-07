import styled from 'styled-components';
import { Tabs } from 'antd';
import { UNDOREDO } from '../Utils/undoRedo';
import { useEditor } from '../Hooks/Editor.hook';
import { useHtmlWrapper } from '../Hooks/Htmlwrapper.hook';
import { useEffect, useState } from 'react';
import { findSectionOfElement } from '../Utils/findElementsParent';
import { findElementInJson } from '../Utils/findElementInMjmlJson';
import { Background } from './Mods/Background';
import { Width } from './Mods/WidthHeight';
import { Padding } from './Mods/Paddings';
import { VerticalAlign } from './Mods/VerticalAlign';
import { Border } from './Mods/Border';
import { CordinalBorder } from './Mods/CordinalBorder';
import { BorderRadius } from './Mods/BorderRadius';
import Scrollbars from 'react-custom-scrollbars-2';
import _ from 'lodash';

const { TabPane } = Tabs;
const CustomTabs = styled(Tabs)`
  .ant-tabs-tab {
    padding-top: 0px;
  }
  .ant-tabs-content {
    height: 100%;
  }

  .mods {
    padding: 24px 16px;
    padding-top: 4px;
    display: flex;
    flex-direction: column;
  }

  .ant-row {
    margin-bottom: 8px;
  }
`;

const ColumnAttributes = () => {
  const { mjmlJson } = useEditor();
  const { active } = useHtmlWrapper();
  const [columns, setActiveColumns] = useState<any>([]);

  useEffect(() => {
    if (active) {
      const section = findSectionOfElement(active);
      if (section) {
        const [, uniqueSectionIdentifier] = section;
        const find = findElementInJson(mjmlJson, uniqueSectionIdentifier);
        if (find) {
          let [item, path] = find;
          path = path.slice(1);

          if (item && item.children && item.children.length > 0) {
            let _columns = [];
            for (var i = 0; i < item.children.length; i++) {
              if (item.children[i].tagName === 'mj-column') {
                _columns.push(`${path}.children[${i}]`);
              }
            }
            if (!_.isEqual(columns, _columns)) {
              setActiveColumns(_columns);
            }
            return;
          }
        }
      }
    }
    setActiveColumns([]);
  }, [active]);

  return active && columns.length > 0 ? (
    <CustomTabs
      centered
      tabBarGutter={2}
      defaultActiveKey="0"
      style={{ height: '100%' }}
      destroyInactiveTabPane={false}
    >
      {columns &&
        columns.map((column: any, index: number) => {
          return (
            <TabPane tab={`column ${index + 1}`} key={index}>
              <Scrollbars style={{ height: '100%' }} autoHide={true}>
                <div
                  className="mods"
                  onMouseDown={(e) => {
                    UNDOREDO.newAction(mjmlJson);
                  }}
                  onBlur={(e) => {
                    UNDOREDO.newAction(mjmlJson);
                  }}
                >
                  <Width activePath={column} />
                  <VerticalAlign activePath={column} />
                  <Padding activePath={column} />

                  <Background activePath={column} />
                  <Background
                    label={'Inner Background:'}
                    overrideAttribute="inner-background-color"
                    activePath={column}
                  />
                  <Border activePath={column} />
                  {/* <CordinalBorder activePath={column} /> */}
                  <BorderRadius activePath={column} />
                </div>
              </Scrollbars>
            </TabPane>
          );
        })}
    </CustomTabs>
  ) : (
    <div style={{ textAlign: 'center', marginTop: '24px' }}>Select an item inside the body</div>
  );
};

export { ColumnAttributes };
