import { createContext, FC, useEffect, useRef, useState } from 'react';

export const CkeditorContext = createContext<any>(null);

export const Ckeditor: FC = (props) => {
  const editorRef = useRef(null);
  const [editorActive, setActive] = useState(false);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  // should only be one instance, only manipulate the locations
  return (
    <CkeditorContext.Provider value={{ ref: editorRef, isActive: editorActive, setActive, x, y, setX, setY }}>
      {props.children}
    </CkeditorContext.Provider>
  );
};
