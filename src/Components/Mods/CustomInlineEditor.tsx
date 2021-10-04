import { Button, Select } from 'antd';
import _ from 'lodash';
import { useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useCustomEditorPosition, useCustomEditorStatus } from '../../Hooks/CustomEditor.hook';
import { useEditor, useEditorUpdater } from '../../Hooks/Editor.hook';
import { useHtmlWrapper } from '../../Hooks/Htmlwrapper.hook';

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
      console.log(e.target.innerHTML, item);
      if (item && item.content) {
        let updateToSend = _.cloneDeep(item);
        updateToSend.content = e.target.innerHTML;
        update(updateToSend);
      }
    },
    [item]
  );

  useEffect(() => {
    if (activeElement && active) {
      console.info('attaching input listender for state sync on active ref');
      activeElement.addEventListener('focusout', inputChange);
      activeElement.children[0].setAttribute('contentEditable', 'true');
      return () => {
        console.log('removing input listender on active ref');

        activeElement.children[0].setAttribute('contentEditable', 'false');
        activeElement.removeEventListener('focusout', inputChange);
      };
    }
  }, [activeElement, item, active]);

  const performAction = useCallback((type: string) => {
    switch (type) {
      case 'bold':
        document.execCommand('bold');
        break;
      default:
        console.info(`unhandled action ${type}`);
    }
  }, []);

  return (
    <div
      suppressContentEditableWarning
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
      >
        {Array.from(Array(50).keys()).map((i) => (
          <Select.Option style={{ fontSize: '12px' }} value={i + 8}>
            {i + 8}
          </Select.Option>
        ))}
      </CustomSelect>

      <Button style={{ fontSize: '12px' }} size="small">
        C
      </Button>
      <Button style={{ fontSize: '12px' }} size="small">
        B
      </Button>
      <Button onClick={() => performAction('bold')} style={{ fontSize: '12px' }} size="small">
        <strong>B</strong>
      </Button>
      <Button style={{ fontSize: '12px' }} size="small">
        <i>I</i>
      </Button>
      <Button style={{ fontSize: '12px' }} size="small">
        <u>U</u>
      </Button>
    </div>
  );
};

export { InlineEditor };
