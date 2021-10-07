import { Button, Popover, Select } from 'antd';
import _ from 'lodash';
import { useCallback, useRef } from 'react';
import styled from 'styled-components';
import { useContentEditableCallback } from '../../Hooks/ContentEditable.hook';
import { useCustomEditorPosition, useCustomEditorStatus } from '../../Hooks/CustomEditor.hook';
import { useEditorUpdater } from '../../Hooks/Editor.hook';
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
  const [item, update] = useEditorUpdater();

  const inputChange = useCallback(
    (e: any) => {
      console.log('inputchange', e.target.innerHTML, item);
      if (item && item.content) {
        let updateToSend = _.cloneDeep(item);
        const html = e.target.innerHTML;
        updateToSend.content = html;
        update(updateToSend);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [item]
  );

  useContentEditableCallback(activeElement, inputChange, active);

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

export { InlineEditor };
