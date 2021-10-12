import { createElement } from 'react';

interface WrapWithOutlineProps {
  nodeName: string;
  props: any;
  children: any;
  id: number;
}

const WrapWithOutline = ({ nodeName, props, children, id }: WrapWithOutlineProps) => {
  return createElement(
    nodeName,
    { ...props, key: id, style: { ...props.style, outline: '3px dotted rgb(121,202,182)' } },
    children
  );
};

export { WrapWithOutline };
