import _, { floor } from 'lodash';
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
import { useQuillEditor } from '../Hooks/Quill.hook';
import { findClosestParent, findUniqueIdentifier } from '../Utils/closestParent';
import { detectEmptyElement } from '../Utils/detectEmptyBody';
import { closeToTopOrBottom, isEventWithTargetElement } from '../Utils/eventElementRelation';
import { findElementInJson } from '../Utils/findElementInMjmlJson';
import { findColumnOfElement } from '../Utils/findElementsColumn';

interface HtmlWrapperProps {
  // children: React.DOMElement<React.DOMAttributes<Element>, Element>;
  uniqueKey: string | number;
  originalNode: any;
}

export const HtmlWrapper = memo(({ uniqueKey, originalNode }: HtmlWrapperProps) => {
  const { setUIWrapperList, setActive, setActiveHover, active, activeHover, id, setId, getId, uiList } =
    useHtmlWrapper();
  const { setX, setY, setDelActive, setDelX, setDelY } = useCkeditor();
  const { setQuillActive, setQuillX, setQuillY } = useQuillEditor();
  const { mjmlJson, setMjmlJson } = useEditor();
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
    () => (e: any) => {
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

              // activate editor only for text elements, todo: extend for btn later
              const identifier = findUniqueIdentifier(mjmlTarget, mjmlTarget.classList);
              if (identifier?.includes('text')) {
                const yoffset = mjmlTarget.offsetHeight;
                const x = pos.x;
                const y = pos.y - yoffset + 13;

                // ckeditor
                if (pos) {
                  setX(x);
                  setY(y);
                }

                //quilleditor
                setQuillActive(true);
                setQuillX(x);
                setQuillY(y);
              } else {
                setQuillActive(false);
              }

              // moving the delete positon to currently selected elements right
              setDelActive(true);
              if (pos) {
                setDelX(pos.right + 4);
                const middle = floor((pos.bottom - pos.top) / 2) - 32 / 2;
                setDelY(pos.top + middle);
              }
            }
          }
        : null,
    [idRef, activeHover]
  );
  const draggable = activeHover === idRef.current;
  const dropTarget = activeHover === idRef.current;
  const cursetStyle = useMemo(() => (activeHover === idRef.current ? 'pointer' : 'default'), [activeHover, idRef]);
  const outline = activeHover === idRef.current ? '2px dotted rgb(121, 202, 182)' : 'unset';
  const outlineClick = active === idRef.current ? '2px solid rgb(121, 202, 182)' : 'unset';

  // detect empty body
  if (detectEmptyElement(originalNode, 'body')) {
    console.info('empty body detected');
  }
  // detect empty section
  if (detectEmptyElement(originalNode, 'section')) {
    console.info('empty section detected');
  }

  const onDragEnter = (e: any) => {
    // console.log('on drag enter', e.currentTarget);
  };

  const onDragLeave = (e: any) => {
    // console.log('on drag leave', e.currentTarget);
  };

  const memoFind = useCallback((e: HTMLElement) => findColumnOfElement(e), []);

  const onDragOver = useCallback((e: any) => {
    const currentTarget = e.nativeEvent.target;
    const nearestTag = findClosestParent(currentTarget);
    console.log('nearest tag', nearestTag);
    // only show place item sign for column's children
    if (nearestTag?.includes('mj-column') || nearestTag?.includes('mj-section')) {
      return;
    }
    const columnElement = memoFind(currentTarget);
    if (columnElement && nearestTag) {
      const nearestElement = currentTarget.closest(`.${nearestTag}`);
      if (nearestElement && columnElement) {
        if (isEventWithTargetElement(e, columnElement)) {
          const suggestionDirection = closeToTopOrBottom(e, nearestElement);
          if (suggestionDirection) {
            let item = findElementInJson(mjmlJson, nearestTag);
            if (item) {
              const [, path]: [any, string] = item;
              // omit the last .child.. index, cuz parent is needed
              const parent = path.slice(1, path.lastIndexOf('.children'));
              let parentObj = _.get(mjmlJson, parent);
              let newOrder = [];
              for (var i = 0; parentObj && parentObj.children && i < parentObj.children.length; i++) {
                let childItem = parentObj['children'][i];
                console.log(childItem);
                const cssClass = childItem.attributes && childItem['attributes']['css-class'];
                // if there is existing placeholders, removing them
                if (cssClass && cssClass.includes('placeitem-placeholder')) {
                  continue;
                }
                if (cssClass && cssClass.includes(nearestTag)) {
                  if (suggestionDirection === 'top') {
                    newOrder.push(placeItemPlaceHolder, childItem);
                  } else if (suggestionDirection === 'bottom') {
                    newOrder.push(childItem, placeItemPlaceHolder);
                  }
                  continue;
                }
                newOrder.push(childItem);
              }

              if (parentObj && newOrder.length > 0) {
                // replace with new order
                console.log('old vs new order', parentObj.children, newOrder);
                parentObj.children = newOrder;
                const updated = _.set(mjmlJson, parent, parentObj);
                setMjmlJson({ ...updated });
              }
            }
          }
        }
      }
    }
  }, []);

  return useMemo(
    () =>
      createElement(
        originalNode.nodeName as string,
        {
          ...originalNode.props,
          onMouseEnter: onHover,
          onMouseLeave: onHover,
          onDragEnter: onDragEnter,
          onDragLeave: onDragLeave,
          onDragOver: _.debounce(onDragOver, 100),
          draggable,
          ref: idRef,
          id: uniqueId.current,
          onClick,
          key: uniqueKey,
          style: {
            ...originalNode.props.style,
            cursor: 'pointer',
            outline: active === idRef.current ? outlineClick : outline,
          },
        },
        originalNode.children
      ),
    [idRef, draggable, onHover, onClick, originalNode, outline, outlineClick, active, uniqueId, activeHover]
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

const placeItemPlaceHolder = {
  tagName: 'mj-text',
  attributes: {
    align: 'center',
    'css-class': 'placeitem-placeholder',
  },
  content: '<h1>+</h1>',
};
