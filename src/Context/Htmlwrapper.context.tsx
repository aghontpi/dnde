import { createContext, FC, memo, useRef, useState } from 'react';

export const HtmlContext = createContext<any>(null);

export const HtmlContextProvider: FC = memo((props) => {
  const [uiWrapperList, setUIWrapperList] = useState([]);

  const [activeHover, setActiveHover] = useState<any>();

  const [active, setActive] = useState<any>();

  const ref = useRef<any>(0);

  const [id, setId] = useState(0);

  //todo: fn remove id from the uiWrapperList, if possible upgrade list to map

  return (
    <HtmlContext.Provider
      value={{
        uiList: uiWrapperList,
        setUIWrapperList,
        activeHover,
        setActiveHover,
        active,
        setActive,
        id,
        setId,
      }}
    >
      <div>{<>{console.log('uiContextRerendering', ref.current++)} </>}</div>
      {props.children}
    </HtmlContext.Provider>
  );
});
