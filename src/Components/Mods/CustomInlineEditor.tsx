import { Button, Popover, Select } from 'antd';
import _ from 'lodash';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useCustomEditorPosition, useCustomEditorStatus } from '../../Hooks/CustomEditor.hook';
import { useEditor } from '../../Hooks/Editor.hook';
import { useHtmlWrapper } from '../../Hooks/Htmlwrapper.hook';
import {
  FontColorsOutlined,
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  BgColorsOutlined,
} from '@ant-design/icons';
import { InlineEditorActions } from '../../Utils/inlineEditorActions';
import { ColorPicker } from '../ColorPicker';
import { findClosestParent, findUniqueIdentifier } from '../../Utils/closestParent';
import { findElementInJson } from '../../Utils/findElementInMjmlJson';

const CustomSelect = styled(Select)`
  .ant-select-selection-item {
    padding-right: 8px !important;
  }
`;

const InlineEditor = () => {
  const ref = useRef(null);
  const { x, y } = useCustomEditorPosition();
  const { active } = useCustomEditorStatus();
  const { active: activeElement }: { active: HTMLDivElement } = useHtmlWrapper();
  const { mjmlJson, setMjmlJson } = useEditor();

  useEffect(() => {
    if (active && activeElement) {
      const uniqueIdentifier = findUniqueIdentifier(activeElement, activeElement.classList);
      if (uniqueIdentifier?.includes('mj-text')) {
        let editor = activeElement.children[0];

        const focusOutEvent = (e: any) => {
          stateChangeCallback(editor, mjmlJson, setMjmlJson);
        };
        editor.addEventListener('focusout', focusOutEvent, false);
        editor.classList.add('editor-active');
        editor.setAttribute('contentEditable', 'true');
        editor.setAttribute('spellcheck', 'false');

        return () => {
          console.log('custom editor: cleaning up dynamic attributes');
          editor.removeEventListener('focusout', focusOutEvent, false);
        };
      }
    }
  }, [activeElement]);

  return (
    <div
      style={{
        display: active ? 'block' : 'none',
        position: 'fixed',
        top: `${y}px`,
        left: `${x}px`,
        padding: '4px 8px',
        border: '1px solid black',
        zIndex: 999,
        backgroundColor: '#fff',
        transition: 'all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)',
      }}
      ref={ref}
    >
      <CustomSelect
        size="small"
        dropdownStyle={{ minWidth: '18px' }}
        defaultValue={'size'}
        style={{ fontSize: '12px' }}
        suffixIcon={null}
        onChange={(value: any) => {
          InlineEditorActions('size', value);
        }}
      >
        {Array.from(Array(50).keys()).map((i) => (
          <Select.Option style={{ fontSize: '12px' }} value={i + 8}>
            {i + 8}
          </Select.Option>
        ))}
      </CustomSelect>

      <Popover
        overlayClassName="inline-editor-popover-color-picker"
        trigger="click"
        placement="bottom"
        content={<ColorPicker />}
        destroyTooltipOnHide={true}
      >
        <Button icon={<FontColorsOutlined />} style={{ fontSize: '12px' }} size="small"></Button>
      </Popover>
      <Popover
        overlayClassName="inline-editor-popover-color-picker"
        trigger="click"
        placement="bottom"
        content={<ColorPicker />}
        destroyTooltipOnHide={true}
      >
        <Button icon={<BgColorsOutlined />} style={{ fontSize: '12px' }} size="small"></Button>
      </Popover>
      <Button
        icon={<BoldOutlined />}
        onClick={() => InlineEditorActions('bold')}
        style={{ fontSize: '12px' }}
        size="small"
      ></Button>
      <Button
        icon={<ItalicOutlined />}
        onClick={() => InlineEditorActions('italics')}
        style={{ fontSize: '12px' }}
        size="small"
      ></Button>
      <Button
        icon={<UnderlineOutlined />}
        onClick={() => InlineEditorActions('underline')}
        style={{ fontSize: '12px' }}
        size="small"
      ></Button>
    </div>
  );
};

const stateChangeCallback = (item: any, mjmlJson: any, setMjmlJson: any) => {
  console.log(`custom Inline Editor: updating state callback`);
  const closestParent = findClosestParent(item);
  if (!closestParent) {
    return;
  }
  const uniqueIdentifier = closestParent;
  if (uniqueIdentifier?.includes('mj-text')) {
    const find = findElementInJson(mjmlJson, uniqueIdentifier);
    if (find) {
      const [, path] = find;
      let itemJson = _.get(mjmlJson, path.slice(1));
      if (itemJson) {
        let updateToSend = _.cloneDeep(itemJson);
        console.log('inline editor: updating', item);
        const html = item.innerHTML;
        updateToSend.content = html;
        const updated = _.set(mjmlJson, path.slice(1), updateToSend);
        setMjmlJson({ ...updated });
      }
    }
  }
};

export { InlineEditor };
