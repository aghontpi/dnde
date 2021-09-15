import _ from 'lodash';
import React, {
  cloneElement,
  createElement,
  memo,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FC } from 'react';
import styled from 'styled-components';
import { useCkeditor } from '../Hooks/Ckeditor.hook';
import { useEditor } from '../Hooks/Editor.hook';
import { useHtmlWrapper } from '../Hooks/Htmlwrapper.hook';

interface HtmlWrapperProps {
  // children: React.DOMElement<React.DOMAttributes<Element>, Element>;
  key: string | number;
  originalNode: any;
}

export const HtmlWrapper = memo(({ key, originalNode }: HtmlWrapperProps) => {
  const { setUIWrapperList, setActive, setActiveHover, active, activeHover, id, setId, getId, uiList } =
    useHtmlWrapper();
  const { setX, setY } = useCkeditor();
  const idRef = useRef(id);
  const uniqueId = useRef(id);

  useEffect(() => {
    getId();
  }, []);

  useEffect(() => {
    if (idRef.current) {
      if (uiList && uiList.indexOf(idRef.current) === -1) {
        setUIWrapperList((prev: any) => {
          let newFilter = prev.map((item: any) => item);
          newFilter.push(idRef.current);
          return newFilter;
        });
      }
    }
  }, [idRef, uiList]);

  const onHover = useMemo(
    () => () => {
      // console.log(idRef.current, active, activeHover);
      setActiveHover(idRef.current);
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [idRef]
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onClick = useMemo(
    () =>
      idRef.current === activeHover
        ? (e: any) => {
            setActive(idRef.current);
            // console.log('onClick', e, idRef.current, active, activeHover);
            console.log('clickevent', e);
            const clickTarget = e.target;
            const mjmlTarget = clickTarget.closest('.mjml-tag');
            if (mjmlTarget) {
              const pos = mjmlTarget.getBoundingClientRect();
              const yoffset = mjmlTarget.offsetHeight;
              if (pos) {
                setX(pos.x);
                setY(pos.y - yoffset);
              }
            }
          }
        : null,
    [idRef, activeHover]
  );
  const draggable = activeHover === idRef.current;
  const cursetStyle = useMemo(() => (activeHover === idRef.current ? 'pointer' : 'default'), [activeHover, idRef]);
  const outline = activeHover === idRef.current ? '2px dotted green' : 'unset';
  const outlineClick = active === idRef.current ? '2px dotted red' : 'unset';

  return useMemo(
    () =>
      createElement(
        originalNode.nodeName as string,
        {
          ...originalNode.props,
          onMouseEnter: onHover,
          draggable,
          ref: idRef,
          id: uniqueId.current,
          onClick,
          style: {
            ...originalNode.props.style,
            cursor: cursetStyle,
            outline: active === idRef.current ? outlineClick : outline,
          },
        },
        originalNode.children
      ),
    [idRef, draggable, onHover, onClick, originalNode, outline, cursetStyle, outlineClick, active, uniqueId]
  );

  // breaks the ui, so trying a different approach above,
  // return (
  //   <div draggable={draggable}>
  //     <div
  //       key={key}
  //       id={idRef.current.toString()}
  //       onMouseEnter={onHover}
  //       onClick={onClick}
  //       className={idRef.current.toString()}
  //       // register
  //     >
  //       {/* todo: make it so, that only text editable fields are shown this,
  //       make sure to create only one instance of ckeditor and move the position relative to the position of the text */}
  //       {children}
  //     </div>
  //   </div>
  // );
});
