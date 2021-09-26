import { createContext, FC, useState } from 'react';

export const QuillContext = createContext<any>(null);

export const QuillEditor: FC = (props) => {
  const [QuillActive, setQuillActive] = useState(false);
  const [quillEditor, setQuillEditor] = useState<any>(null);
  const [quillX, setQuillX] = useState(0);
  const [quillY, setQuillY] = useState(0);

  return (
    <QuillContext.Provider
      value={{
        QuillActive,
        setQuillActive,
        quillEditor,
        setQuillEditor,
        quillX,
        quillY,
        setQuillX,
        setQuillY,
      }}
    >
      {props.children}
    </QuillContext.Provider>
  );
};
