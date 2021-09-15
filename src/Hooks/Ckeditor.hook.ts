import { useContext, useRef } from 'react';
import { CkeditorContext } from '../Context/Ckeditor.context';

export const useCkeditor = () => {
  const Ckeditor = useContext(CkeditorContext);
  return Ckeditor as unknown as {
    ref: any;
    isActive: boolean;
    setActive: () => void;
    x: number;
    y: number;
    setX: () => void;
    setY: () => void;
  };
};
