import { UndoOutlined, RedoOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { UNDOREDO } from '../Utils/undoRedo';

interface UndoRedoProps {
  undoCallback: () => void;
  redoCallback: () => void;
}

const UndoRedo = ({ undoCallback, redoCallback }: UndoRedoProps) => {
  return (
    <div style={{ position: 'absolute', padding: '8px', display: 'flex', flexDirection: 'column', rowGap: '4px' }}>
      <Tooltip color="cyan" title="undo" placement="right">
        <Button
          disabled={UNDOREDO.isUndoEmpty()}
          onClick={undoCallback}
          type="default"
          size="large"
          style={{ background: '#fff' }}
          icon={<UndoOutlined />}
        />
      </Tooltip>

      <Tooltip color="cyan" title="redo" placement="right">
        <Button
          disabled={UNDOREDO.isRedoEmpty()}
          onClick={redoCallback}
          type="default"
          style={{ background: '#fff' }}
          size="large"
          icon={<RedoOutlined />}
        />
      </Tooltip>
    </div>
  );
};

export { UndoRedo };
