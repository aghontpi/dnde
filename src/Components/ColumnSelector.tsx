import { Row } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useCkeditor } from '../Hooks/Ckeditor.hook';
import { useCustomEditorStatus } from '../Hooks/CustomEditor.hook';
import { useDragAndDropUniqueId } from '../Hooks/Drag.hook';
import { useEditor } from '../Hooks/Editor.hook';
import { useHtmlWrapper } from '../Hooks/Htmlwrapper.hook';
import { generateUniqueIdRecursively } from '../Utils/closestParent';
import { findElementInJson } from '../Utils/findElementInMjmlJson';
import { findSectionOfElement } from '../Utils/findElementsParent';
import { logger } from '../Utils/logger';
import { UNDOREDO } from '../Utils/undoRedo';
import { COLUMN } from './Section';

const style = {
  display: 'flex',
  height: '16px',
  borderRadius: '0px',
};

const borderRight = '1px solid rgb(85, 85, 85)';

const ColumnSelector = () => {
  const { active } = useHtmlWrapper();
  const { mjmlJson, setMjmlJson } = useEditor();
  const {
    setDelActive,
    copy: { setCopyActive },
  } = useCkeditor();
  const { setActive: setCustomEditorActive } = useCustomEditorStatus();
  const { getId } = useDragAndDropUniqueId();
  const [visible, setVisible] = useState(false);
  const [sectionIdentifier, setSectionIdentifier] = useState();

  useEffect(() => {
    if (active) {
      const section = findSectionOfElement(active);
      if (section) {
        const [, uniqueIdentifier] = section;
        setVisible(true);
        setSectionIdentifier(uniqueIdentifier);
        return;
      }
    }
    setVisible(false);
  }, [active, visible]);

  const handleClick = (changeTo: string[]) => {
    if (visible && sectionIdentifier) {
      const find = findElementInJson(mjmlJson, sectionIdentifier);
      if (find) {
        const [item, path] = find;
        if (item && path && item.children && changeTo.length > 0) {
          const existingLength = item.children.length;
          const convertLength = changeTo.length;
          if (convertLength < existingLength) {
            // todo: implement getconfirmation, that user is about to delete a column
          }
          let newChildren = [];

          // iterate over existing children
          for (let i = 0; i < existingLength && i < convertLength; i++) {
            let child = _.cloneDeep(item.children[i]);
            if (child && child.attributes) {
              // modify width attribute, add it to newChildren
              child.attributes.width = changeTo[i];
              newChildren.push(child);
            }
          }

          //iterate over new children
          for (let i = existingLength; i < convertLength; i++) {
            let preProcessedColumn = generateUniqueIdRecursively(_.cloneDeep(COLUMN), getId);
            preProcessedColumn.attributes.width = changeTo[i];
            newChildren.push(preProcessedColumn);
          }

          // update children
          const updatedItem = { ...item, children: newChildren };

          //update json
          logger.log('column layout: ', updatedItem);

          const updated = _.set(mjmlJson, path.slice(1), updatedItem);

          if (updated) {
            UNDOREDO.newAction(updated);
            setDelActive(false);
            setCopyActive(false);
            setCustomEditorActive(false);
            setMjmlJson({ ...updated });
          }
        }
      }
    }
  };

  return visible ? (
    <>
      <div>
        <SectionTitle>
          <p>1 Columns</p>
        </SectionTitle>
        <Image click={() => handleClick(['100%'])} one={100} />
      </div>
      <div style={{ marginTop: '16px' }}>
        <SectionTitle>
          <p>2 Columns</p>
        </SectionTitle>
        <Image click={() => handleClick(['50%', '50%'])} one={50} two={50} />
        <Image click={() => handleClick(['39%', '59%'])} one={40} two={60} />
        <Image click={() => handleClick(['25%', '75%'])} one={25} two={75} />
        <Image click={() => handleClick(['60%', '40%'])} one={60} two={40} />
        <Image click={() => handleClick(['75%', '25%'])} one={75} two={25} />
      </div>
      <div style={{ marginTop: '16px' }}>
        <SectionTitle>
          <p>3 Columns</p>
        </SectionTitle>
        <Image click={() => handleClick(['33%', '33%', '33%'])} one={50} two={50} three={50} />
        <Image click={() => handleClick(['47.5%', '5%', '47.5%'])} one={47.5} two={5} three={47.5} />
        <Image click={() => handleClick(['25%', '25%', '50%'])} one={25} two={25} three={50} />
        <Image click={() => handleClick(['25%', '50%', '25%'])} one={25} two={50} three={25} />
        <Image click={() => handleClick(['50%', '25%', '25%'])} one={50} two={25} three={25} />
      </div>
      <div style={{ marginTop: '16px' }}>
        <SectionTitle>
          <p>4 Columns</p>
        </SectionTitle>
        <Image click={() => handleClick(['25%', '25%', '25%', '25%'])} one={50} two={50} three={50} four={50} />
      </div>
    </>
  ) : (
    <div style={{ textAlign: 'center' }}>Select an item inside the body</div>
  );
};

const Image = ({
  click,
  one,
  two,
  three,
  four,
}: {
  click?: (e: any) => void;
  one: number;
  two?: number;
  three?: number;
  four?: number;
}) => {
  return (
    <>
      <Row style={{ marginBottom: '12px' }}></Row>
      <SectionImage onClick={click ? click : undefined}>
        <div className="wrapper">
          <div className="border">
            <div style={{ ...style, flexGrow: one, borderRight: two ? borderRight : 'unset' }}></div>
            {two ? <div style={{ ...style, flexGrow: two, borderRight: three ? borderRight : 'unset' }}></div> : null}
            {three ? (
              <div style={{ ...style, flexGrow: three, borderRight: four ? borderRight : 'unset' }}></div>
            ) : null}
            {four ? <div style={{ ...style, flexGrow: two }}></div> : null}
          </div>
        </div>
      </SectionImage>
    </>
  );
};

const SectionTitle = styled(Row)`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  p {
    margin: 0px;
    text-align: inherit;
    color: rgb(85, 85, 85);
    font-size: 14px;
    font-weight: 600;
  }
`;

const SectionImage = styled(Row)`
  background-color: rgb(252, 252, 252);
  border: 1px solid rgb(229, 229, 229);
  border-radius: 3px;
  box-sizing: border-box;
  display: flex;
  box-shadow: none;
  cursor: grab;

  &:hover {
    background-color: rgb(255, 255, 255);
    box-shadow: rgb(0 0 0 / 20%) 0px 1px 4px;
    border-color: rgb(255, 255, 255);
  }

  .wrapper {
    margin: 10px;
    background-color: rgb(255, 255, 255);
    position: relative;
    width: 100%;
    display: flex;
    border-radius: 3px;
    box-sizing: border-box;

    .border {
      border: 1px solid rgb(85, 85, 85);
      border-radius: 3px;
      display: flex;
      -webkit-box-align: center;
      align-items: center;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
    }
  }
`;

export { ColumnSelector };
