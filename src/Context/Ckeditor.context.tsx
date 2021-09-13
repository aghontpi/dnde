import { createContext, FC, useEffect, useRef, useState } from 'react';

export const CkeditorContext = createContext<any>(null);

export const Ckeditor: FC = (props) => {
  const editorRef = useRef(null);

  // should only be one instance, only manipulate the locations
  return <CkeditorContext.Provider value={{ ref: editorRef }}>{props.children}</CkeditorContext.Provider>;
};
