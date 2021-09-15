import { useContext } from 'react';
import { HtmlContext } from '../Context/Htmlwrapper.context';

export const useHtmlWrapper = () => {
  const htmlContext = useContext(HtmlContext);
  return htmlContext as unknown as {
    uiWrapperList: any[];
    setUIWrapperList: (prev?: any) => void;
    activeHover: any;
    setActiveHover: (id: string) => void;
    active: any;
    setActive: (id: string) => void;
    id: any;
    setId: (prev?: any) => void;
  };
};
