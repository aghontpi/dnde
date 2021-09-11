import { useContext } from 'react';
import { EditorContext } from '../Context/Editor.context';

export const useEditor = () => {
  const context = useContext(EditorContext);
  return context as unknown as {
    mjmlJson: any;
    setMjmlJson: (v: any) => void;
    attributes: any;
    setAttributes: (v: any) => void;
    active: any;
    setActive: (v: any) => void;
    mjmlstring: any;
    setMjmlString: (v: any) => void;
  };
};
