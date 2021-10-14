import { useContext } from 'react';
import { CkeditorContext } from '../Context/Ckeditor.context';

export const useCkeditor = () => {
  const Ckeditor = useContext(CkeditorContext);
  return Ckeditor as unknown as {
    ref: any;
    isActive: boolean;
    setActive: (arg: boolean) => void;
    x: number;
    y: number;
    setX: (arg: number) => void;
    setY: (arg: number) => void;
    delX: number;
    delY: number;
    setDelX: (arg: number) => void;
    setDelY: (arg: number) => void;
    delActive: boolean;
    setDelActive: (arg: boolean) => void;
    ckeditorInstance: any;
    drag: {
      isColumn: boolean;
      setIsColumn: (arg: boolean) => void;
    };
    copy: {
      copyActive: boolean;
      setCopyActive: (arg: boolean) => void;
      copyX: number;
      copyY: number;
      setCopyX: (arg: number) => void;
      setCopyY: (arg: number) => void;
    };
  };
};
