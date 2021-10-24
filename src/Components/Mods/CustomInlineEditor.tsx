import { Button, Input, Popover, Select } from 'antd';
import _ from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { useCustomEditorPosition, useCustomEditorStatus } from '../../Hooks/CustomEditor.hook';
import { useEditor } from '../../Hooks/Editor.hook';
import { useHtmlWrapper } from '../../Hooks/Htmlwrapper.hook';
import {
  FontColorsOutlined,
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  BgColorsOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import { InlineEditorActions } from '../../Utils/inlineEditorActions';
import { ColorPicker } from '../ColorPicker';
import { findClosestParent, findUniqueIdentifier } from '../../Utils/closestParent';
import { findElementInJson } from '../../Utils/findElementInMjmlJson';
import { useFonts } from '../../Hooks/useFonts';
import { logger } from '../../Utils/logger';
import { addHttps } from './Link';

let r: any;

const restoreSelection = () => {
  let restoreSel = window.getSelection();
  if (!restoreSel) {
    return;
  }
  const temp = r;
  restoreSel?.removeAllRanges();
  restoreSel?.addRange(r);
  r = temp;
};

const InlineEditor = () => {
  const ref = useRef<any>(null);
  const { x, y } = useCustomEditorPosition();
  const { active } = useCustomEditorStatus();
  const { active: activeElement }: { active: HTMLDivElement } = useHtmlWrapper();
  const { mjmlJson, setMjmlJson } = useEditor();
  const [fontlist] = useFonts();

  // on mount, override the default behaviour of the antd dropdown select
  useEffect(() => {
    if (ref.current) {
      const toolbar = document.querySelectorAll('#customtoolbar .ant-select-selector');
      if (toolbar) {
        toolbar.forEach((item) => {
          logger.log('attaching click event listener to container');
          item.addEventListener('click', ResetEventBehaviour);
        });
        return () =>
          toolbar.forEach((item) => {
            logger.log('removing click event listener to container');
            item.removeEventListener('click', ResetEventBehaviour);
          });
      }
    }
  }, [ref]);

  useEffect(() => {
    if (active && activeElement) {
      const uniqueIdentifier = findUniqueIdentifier(activeElement, activeElement.classList);
      if (uniqueIdentifier?.includes('mj-text')) {
        let editor: any = activeElement.children[0].children[0];

        const Event = (e: any) => {
          stateChangeCallback(editor, mjmlJson, setMjmlJson);
          // e.stopPropagation();
          // e.preventDefault();
          // e.target.focus();
          // return false;
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
          // restoreSelection();
        }

        return () => {
          logger.log('custom editor: cleaning up dynamic attributes');
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
      onMouseDown={ResetEventBehaviour}
    >
      <Select
        size="small"
        dropdownStyle={{ minWidth: '18px' }}
        defaultValue={2}
        style={{ fontSize: '12px' }}
        onChange={(value: any) => {
          InlineEditorActions(null, 'size', value);
        }}
      >
        {Array.from(Array(7).keys()).map((i) => (
          <Select.Option
            onMouseDown={ResetEventBehaviour}
            onFocus={ResetEventBehaviour}
            style={{ fontSize: '12px' }}
            value={i + 1}
          >
            <span onMouseDown={ResetEventBehaviour} onFocus={ResetEventBehaviour}>
              {i + 1}
            </span>
          </Select.Option>
        ))}
      </Select>
      <Select
        size="small"
        defaultValue={'Ubuntu'}
        dropdownStyle={{ minWidth: '140px' }}
        style={{ fontSize: '12px' }}
        onChange={(value: any) => {
          InlineEditorActions(null, 'fontFamily', value);
        }}
        onMouseDown={ResetEventBehaviour}
      >
        {fontlist.map((font) => (
          <Select.Option
            onMouseDown={ResetEventBehaviour}
            onFocus={ResetEventBehaviour}
            style={{ fontSize: '12px' }}
            value={font}
          >
            <span onMouseDown={ResetEventBehaviour} onFocus={ResetEventBehaviour}>
              {font}
            </span>
          </Select.Option>
        ))}
      </Select>

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
      <LinkItem setLinkCallback={(e) => InlineEditorActions(e, 'link')} />
    </div>
  );
};

interface LinkItemProps {
  setLinkCallback: (e: any) => void;
}

const LinkItem = ({ setLinkCallback }: LinkItemProps) => {
  const [active, setActive] = useState(false);
  const [link, setLink] = useState('');
  const linkRef = useRef<any>(null);

  const onChange = (e: any) => {
    setLink(e.target.value);
  };

  const onMouseDown = (e: any) => {
    restoreSelection();
  };

  return (
    <Popover
      visible={active}
      content={
        <div style={{ display: 'flex', gap: '8px' }}>
          <Input
            className="inline-editor-link"
            ref={linkRef}
            value={link}
            onMouseDown={onMouseDown}
            onChange={onChange}
            placeholder="link"
          />
          <Button
            type="default"
            onMouseDown={ResetEventBehaviour}
            onClick={() => {
              setActive(false);
              restoreSelection();
              document.execCommand(
                'insertHTML',
                false,
                '<a href="' + addHttps(link) + '" target="_blank">' + document.getSelection() + '</a>'
              );
            }}
          >
            create
          </Button>
        </div>
      }
      trigger="click"
      placement="bottom"
    >
      <Button
        style={{ fontSize: '12px' }}
        onClick={(e) => {
          ResetEventBehaviour(e);
          setActive(!active);
          setLink('');
        }}
        size="small"
        icon={<LinkOutlined />}
      ></Button>
    </Popover>
  );
};

const stateChangeCallback = (item: any, mjmlJson: any, setMjmlJson: any) => {
  logger.log(`custom Inline Editor: updating state callback`);
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
        logger.log('inline editor: updating', item);
        const html = item.innerHTML;
        updateToSend.content = html;
        const updated = _.set(mjmlJson, path.slice(1), updateToSend);
        setMjmlJson({ ...updated });
      }
    }
  }
};

export const ResetEventBehaviour = (e: any) => {
  logger.log('::reset', e.target);
  if (
    e.target &&
    e.target.tagName === 'INPUT' &&
    e.target.className &&
    e.target.className.includes('inline-editor-link')
  ) {
    logger.log('::reset, returning');
    return;
  }
  logger.log('::reset->reset behaviour', e.target);
  e.preventDefault();
  e.stopPropagation();
  return false;
};

export { InlineEditor };
