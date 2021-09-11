import { createContext, FC } from 'react';

const def = {
  mutableAttributes: {},
  id: '',
  type: '',
};

const DragAndCropContext = createContext(def);

export const DNDContext: FC = (props) => {
  return <DragAndCropContext.Provider value={def}>{props.children}</DragAndCropContext.Provider>;
};
