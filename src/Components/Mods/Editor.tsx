import { Button, Popconfirm } from 'antd';
import { useMemo } from 'react';
import { useCkeditor } from '../../Hooks/Ckeditor.hook';
import { useEditor } from '../../Hooks/Editor.hook';
import { useHtmlWrapper } from '../../Hooks/Htmlwrapper.hook';
import { Remove, Copy as CopyOperation } from '../../Utils/operations';
import _ from 'lodash';
import CopyFilled from '@ant-design/icons/lib/icons/CopyFilled';
import DeleteFilled from '@ant-design/icons/lib/icons/DeleteFilled';
import { useUniqueIdGenerator } from '../../Hooks/Drag.hook';

export const Editor = () => {
  const { ref, isActive, x, y, delActive, delX, delY, setDelActive, copy } = useCkeditor();
  const { mjmlJson, setMjmlJson } = useEditor();
  const { active, setActive } = useHtmlWrapper();
  const { copyActive, setCopyActive, copyX, copyY } = copy;
  const { getId } = useUniqueIdGenerator();

  const deleteConfirm = useMemo(
    () => () => {
      if (active) {
        Remove({ target: active, mjmlJson, setMjmlJson, setDelActive, setActive, setCopyActive });
      }
    },
    [active]
  );

  const copyAction = () => {
    if (active) {
      CopyOperation({
        mjmlJson,
        setActive,
        setMjmlJson,
        setCopyActive,
        setDelActive,
        target: active,
        uidGenerator: getId,
      });
    }
  };

  return (
    <>
      <Delete
        style={{
          zIndex: 200,
          display: delActive ? 'block' : 'none',
          position: 'fixed',
          left: `${delX}px`,
          top: `${delY}px`,
        }}
        deleteConfirm={deleteConfirm}
      />
      <Copy
        onClick={copyAction}
        style={{
          zIndex: 200,
          display: copyActive ? 'block' : 'none',
          position: 'fixed',
          left: `${copyX}px`,
          top: `${copyY}px`,
        }}
      />
    </>
  );
};

interface DeleteProps {
  style: any;
  deleteConfirm: () => void;
}

const Delete = ({ style, deleteConfirm }: DeleteProps) => {
  return (
    <Popconfirm placement="right" title="Are you sure ?" okText="Delete" cancelText="Cancel" onConfirm={deleteConfirm}>
      <Button style={style} type="primary" icon={<DeleteFilled />} />
    </Popconfirm>
  );
};

interface CopyProps {
  style: any;
  onClick: () => void;
}

const Copy = ({ style, onClick }: CopyProps) => {
  return <Button style={style} onClick={onClick} type="primary" icon={<CopyFilled />} />;
};
