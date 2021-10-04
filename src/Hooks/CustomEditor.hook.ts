import { useContext } from 'react';
import { CustomEditorContext } from '../Context/CustomEditor.context';

const useCustomEditorPosition = () => {
  const { position } = useContext(CustomEditorContext);
  return position;
};

const useCustomEditorStatus = () => {
  const { status } = useContext(CustomEditorContext);
  return status;
};

export { useCustomEditorPosition, useCustomEditorStatus };
