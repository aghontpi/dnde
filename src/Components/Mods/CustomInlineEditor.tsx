import { Button, Popover, Select } from 'antd';
import _ from 'lodash';
import React, { Children, cloneElement, useEffect, useRef, useState } from 'react';
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
import { FontFamily } from './FontFamily';
import { FONTS_CONFIG } from './FontConfig';
import { useFonts } from '../../Hooks/useFonts';

const CustomSelect = styled(Select)`
  .ant-select-selection-item {
    padding-right: 8px !important;
  }
`;
let r: any;

const InlineEditor = () => {
  const ref = useRef<any>(null);
  const { x, y } = useCustomEditorPosition();
  const { active } = useCustomEditorStatus();
  const { active: activeElement }: { active: HTMLDivElement } = useHtmlWrapper();
  const { mjmlJson, setMjmlJson } = useEditor();
  const [fontSelection, setFontSelection] = useState<boolean>(false);
  const selectionRef = useRef<any>(null);
  const [fontlist] = useFonts();
  const [fontFamily, setFontFamily] = useState(false);

  const fontFamilyFef = useRef<any>(null);

  useEffect(() => {
    if (selectionRef.current) {
      const toolbar = document.querySelectorAll('#customtoolbar .ant-select-selector');
      if (toolbar) {
        toolbar.forEach((item) => {
          item.addEventListener('click', onFocus);
        });
        return () =>
          toolbar.forEach((item) => {
            item.removeEventListener('click', onFocus);
          });
      }
    }
  }, [selectionRef.current]);

  useEffect(() => {
    if (active && activeElement) {
      const uniqueIdentifier = findUniqueIdentifier(activeElement, activeElement.classList);
      if (uniqueIdentifier?.includes('mj-text')) {
        let editor: any = activeElement.children[0];

        const Event = (e: any) => {
          stateChangeCallback(editor, mjmlJson, setMjmlJson);

          e.stopPropagation();
          e.preventDefault();
          e.target.focus();
          return false;
        };

        const restoreSelection = () => {
          let restoreSel = window.getSelection();
          if (!restoreSel) {
            return;
          }
          const temp = r;
          restoreSel?.removeAllRanges();
          restoreSel.addRange(r);
          r = temp;
        };

        const onKeyUp = () => {
          r = window.getSelection()?.getRangeAt(0);
        };

        editor.addEventListener('focusout', Event, true);
        editor.addEventListener('keyup', onKeyUp, false);
        editor.addEventListener('click', onKeyUp, false);

        editor.classList.add('editor-active');
        editor.setAttribute('contentEditable', 'true');
        editor.setAttribute('spellcheck', 'false');

        if (r) {
          restoreSelection();
        }

        return () => {
          console.log('custom editor: cleaning up dynamic attributes');
          editor.removeEventListener('focusout', Event, true);
          editor.removeEventListener('keyup', onKeyUp, false);
          editor.removeEventListener('click', onKeyUp, false);
        };
      }
    }
  }, [activeElement, mjmlJson]);

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
      id="customtoolbar"
      ref={ref}
      onMouseDown={onFocus}
      onClick={onFocus}
      onDoubleClick={onFocus}
    >
      <CustomSelect
        size="small"
        ref={selectionRef}
        dropdownStyle={{ minWidth: '18px' }}
        defaultValue={'size'}
        style={{ fontSize: '12px' }}
        getPopupContainer={(triggerNode: any) => {
          triggerNode.addEventListener('focus', onFocus);
          triggerNode.addEventListener('onmousedown', onFocus);
          return triggerNode;
        }}
        dropdownRender={(original) => {
          React.Children.map(original, (child: any) => {
            return cloneElement(child, { onMouseDown: onFocus, onFocus });
          });
          return cloneElement(original, {
            onMouseDown: onFocus,
            onFocus,
          });
        }}
        // onMouseDown={onFocus}
        // onFocus={onFocus}
        // onClick={(e) => {
        //   onFocus(e);
        //   //   setFontSelection(!fontSelection);
        // }}
        onMouseEnter={(e) => {
          //   setFontSelection(true);
        }}
        // onBlur={onFocus}
        // open={fontSelection}
        suffixIcon={null}
        onChange={(value: any) => {
          InlineEditorActions(null, 'size', value);
        }}
      >
        {Array.from(Array(7).keys()).map((i) => (
          <Select.Option onMouseDown={onFocus} onFocus={onFocus} style={{ fontSize: '12px' }} value={i + 1}>
            <span onMouseDown={onFocus} onFocus={onFocus}>
              {i + 1}
            </span>
          </Select.Option>
        ))}
      </CustomSelect>

      <Popover
        overlayClassName="inline-editor-popover-color-picker"
        trigger="click"
        placement="bottom"
        content={
          <ColorPicker
            handleChange={(color) => {
              InlineEditorActions(null, 'fontColor', color);
            }}
            mouseDown={false}
          />
        }
        destroyTooltipOnHide={true}
      >
        <Button icon={<FontColorsOutlined />} style={{ fontSize: '12px' }} size="small"></Button>
      </Popover>
      <Popover
        overlayClassName="inline-editor-popover-color-picker"
        trigger="click"
        placement="bottom"
        content={
          <ColorPicker
            handleChange={(color) => {
              InlineEditorActions(null, 'color', color);
            }}
            mouseDown={false}
          />
        }
        destroyTooltipOnHide={true}
      >
        <Button icon={<BgColorsOutlined />} style={{ fontSize: '12px' }} size="small"></Button>
      </Popover>
      <Button
        icon={<BoldOutlined />}
        onClick={(e) => InlineEditorActions(e, 'bold')}
        style={{ fontSize: '12px' }}
        size="small"
      ></Button>
      <Button
        icon={<ItalicOutlined />}
        onClick={(e) => InlineEditorActions(e, 'italics')}
        style={{ fontSize: '12px' }}
        size="small"
      ></Button>
      <Button
        icon={<UnderlineOutlined />}
        onClick={(e) => InlineEditorActions(e, 'underline')}
        style={{ fontSize: '12px' }}
        size="small"
      ></Button>

      <Select
        size="small"
        defaultValue={'Ubuntu'}
        dropdownStyle={{ minWidth: '18px' }}
        style={{ fontSize: '12px' }}
        getPopupContainer={(triggerNode: any) => {
          triggerNode.addEventListener('focus', onFocus);
          triggerNode.addEventListener('onmousedown', onFocus);
          return triggerNode;
        }}
        dropdownRender={(original) => {
          React.Children.map(original, (child: any) => {
            return cloneElement(child, { onMouseDown: onFocus, onFocus });
          });
          return cloneElement(original, {
            onMouseDown: onFocus,
            onFocus,
          });
        }}
        ref={fontFamilyFef}
        // onMouseDown={onFocus}
        // onFocus={onFocus}
        // onClick={(e) => {
        //   onFocus(e);
        //   //   setFontFamily(!fontFamily);
        // }}
        onMouseEnter={(e) => {
          //   setFontFamily(true);
          onFocus(e);
        }}
        // onBlur={onFocus}
        // open={fontFamily}
        suffixIcon={null}
        onChange={(value: any) => {
          InlineEditorActions(null, 'fontFamily', value);
        }}
      >
        {fontlist.map((font) => (
          <Select.Option onMouseDown={onFocus} onFocus={onFocus} style={{ fontSize: '12px' }} value={font}>
            <span onMouseDown={onFocus} onFocus={onFocus}>
              {font}
            </span>
          </Select.Option>
        ))}
      </Select>
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

const onFocus = (e: any) => {
  e.preventDefault();
  e.stopPropagation();
  return false;
};

export { InlineEditor };
