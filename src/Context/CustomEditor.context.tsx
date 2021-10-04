import { createContext, FC, useState } from 'react';

type Set<T> = React.Dispatch<React.SetStateAction<T>>;

export const CustomEditorContext = createContext<{
  position: { x: number; y: number; setX: Set<number>; setY: Set<number> };
  status: { active: boolean; setActive: Set<boolean> };
}>({ position: { x: 0, y: 0, setX: () => {}, setY: () => {} }, status: { active: false, setActive: () => {} } });

export const CustomEditorProvider: FC = (props) => {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [active, setActive] = useState(false);
  return (
    <CustomEditorContext.Provider value={{ position: { x, y, setX, setY }, status: { active, setActive } }}>
      {props.children}
    </CustomEditorContext.Provider>
  );
};
