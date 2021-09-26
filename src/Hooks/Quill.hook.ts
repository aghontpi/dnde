import { useContext } from 'react';
import { QuillContext } from '../Context/Quill.context';

export const useQuillEditor = () => {
  const Quill = useContext(QuillContext);
  return Quill as unknown as {
    QuillActive: boolean;
    setQuillActive: (args: boolean) => void;
    quillEditor: any;
    setQuillEditor: (args: any) => void;
    quillX: number;
    quillY: number;
    setQuillX: (args: number) => void;
    setQuillY: (args: number) => void;
  };
};
