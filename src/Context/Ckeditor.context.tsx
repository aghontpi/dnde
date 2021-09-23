import { createContext, FC, useRef, useState } from 'react';

export const CkeditorContext = createContext<any>(null);

export const Ckeditor: FC = (props) => {
  const editorRef = useRef(null);
  const [editorActive, setActive] = useState(false);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [delActive, setDelActive] = useState(false);
  const [delX, setDelX] = useState(0);
  const [delY, setDelY] = useState(0);

  // should only be one instance, only manipulate the locations
  return (
    <CkeditorContext.Provider
      value={{
        ref: editorRef,
        isActive: editorActive,
        setActive,
        x,
        y,
        setX,
        setY,
        delX,
        delY,
        setDelX,
        setDelY,
        delActive,
        setDelActive,
      }}
    >
      {props.children}
    </CkeditorContext.Provider>
  );
};
