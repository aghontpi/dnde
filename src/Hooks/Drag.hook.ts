import { useContext } from 'react';
import { DragAndCropContext } from '../Context/DragAndDrop.context';

const useDragAndDropUniqueId = () => {
  const { genId } = useContext(DragAndCropContext);
  return {
    getId: () => genId(),
  };
};

export { useDragAndDropUniqueId, useDragAndDropUniqueId as useUniqueIdGenerator };
