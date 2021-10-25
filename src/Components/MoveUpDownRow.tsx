import { VerticalAlignTopOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useEffect, useState } from 'react';
import { useEditor } from '../Hooks/Editor.hook';
import { findUniqueIdentifierFromString } from '../Utils/closestParent';
import { findElementInJson } from '../Utils/findElementInMjmlJson';
import { moveSectionDown, moveSectionUp } from '../Utils/reorderSections';
import { ResetEventBehaviour } from './Mods/CustomInlineEditor';

interface MoveUpDownProps {
  idRef: any;
  active: any;
  className: string;
}

const MoveUpDown = ({ className, idRef, active }: MoveUpDownProps) => {
  const { mjmlJson, setMjmlJson } = useEditor();
  const [upActive, setUpActive] = useState(true);
  const [downActive, setDownActive] = useState(true);

  useEffect(() => {
    if (idRef.current === active) {
      const uniqueClassName = findUniqueIdentifierFromString(className);
      if (uniqueClassName) {
        const child = findElementInJson(mjmlJson, findUniqueIdentifierFromString(className));
        const parent = findElementInJson(mjmlJson, 'identifier-mj-body');
        if (child && parent) {
          const [parentItem] = parent;
          const [childItem] = child;

          // if section element is the first element
          if (parentItem && parentItem.children && parentItem.children.length === 1) {
            setUpActive(false);
            setDownActive(false);
            return;
          } else if (parentItem && parentItem.children && parentItem.children.length > 1) {
            const lastItem = parentItem.children.length - 1;
            for (let i = 0; i < parentItem.children.length; i++) {
              const childSection = parentItem.children[i];
              if (
                childSection &&
                childSection.attributes &&
                childSection.attributes['css-class'] &&
                childSection.attributes['css-class'].includes(uniqueClassName)
              ) {
                if (i === lastItem) {
                  setDownActive(false);
                  setUpActive(true);
                  break;
                } else if (i === 0) {
                  setUpActive(false);
                  setDownActive(true);
                  break;
                }
              }
            }
          }
        }
      }
    }
  }, [mjmlJson, idRef, active]);

  const MoveUp = (e: any) => {
    ResetEventBehaviour(e);
    moveSectionUp(className, mjmlJson, setMjmlJson);
  };

  const MoveDown = (e: any) => {
    ResetEventBehaviour(e);
    moveSectionDown(className, mjmlJson, setMjmlJson);
  };

  return (
    <div onMouseDown={ResetEventBehaviour} style={{ display: active === idRef.current ? 'block' : 'none' }}>
      <div
        style={{
          zIndex: 200,
          position: 'absolute',
          left: -38,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          rowGap: '4px',
        }}
      >
        <Button
          type="primary"
          disabled={!upActive}
          onClick={MoveUp}
          icon={<VerticalAlignTopOutlined style={{ fontSize: '20px' }} />}
        />
        <Button
          type="primary"
          disabled={!downActive}
          onClick={MoveDown}
          icon={<VerticalAlignBottomOutlined style={{ fontSize: '20px' }} />}
        />
      </div>
    </div>
  );
};

export { MoveUpDown };
