import _ from 'lodash';
import { cloneElement, createElement, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useCkeditor } from '../Hooks/Ckeditor.hook';
import { useCustomEditorPosition, useCustomEditorStatus } from '../Hooks/CustomEditor.hook';
import { useEditor } from '../Hooks/Editor.hook';
import { useHtmlWrapper } from '../Hooks/Htmlwrapper.hook';
import { findClosestParent, findUniqueIdentifier } from '../Utils/closestParent';
import { detectEmptyElement } from '../Utils/detectEmptyBody';
import { findElementInJson } from '../Utils/findElementInMjmlJson';
import { findColumnOfElement } from '../Utils/findElementsParent';
import {
  generateDropItemPlaceholder,
  genereateDropItemPlaceholderForColumn,
} from '../Utils/generateDropItemPlaceholder';
import { logger } from '../Utils/logger';
import { setToolBars } from '../Utils/setToolbarPositions';
import { typeoftag } from '../Utils/typeoftag';
import { MoveUpDown } from './MoveUpDownRow';

interface HtmlWrapperProps {
  // children: React.DOMElement<React.DOMAttributes<Element>, Element>;
  uniqueKey: string | number;
  originalNode: any;
}

export const HtmlWrapper = memo(({ uniqueKey, originalNode }: HtmlWrapperProps) => {
  const { setActive, setActiveHover, active, activeHover, id, setId, getId } = useHtmlWrapper();
  const {
    setDelActive,
    setDelX,
    setDelY,
    copy,
    drag: { isColumn },
  } = useCkeditor();
  const { mjmlJson, setMjmlJson } = useEditor();
  const { setX: customEditorSetX, setY: customEditorSetY } = useCustomEditorPosition();
  const { setActive: setCustomEditorStatus } = useCustomEditorStatus();
  const idRef = useRef(id);
  const uniqueId = useRef(id);

  const { setCopyX, setCopyActive, setCopyY } = copy;

  useEffect(() => {
    getId();
  }, []);

  // while move items in editor, hide these
  useEffect(() => {
    if (active === null) {
      setCopyActive(false);
      setDelActive(false);
      setCustomEditorStatus(false);
    }
  }, [active]);

  const onHover = (e: any) => {
    e.stopPropagation();
    activeHover !== idRef.current && setActiveHover(idRef.current);
  };

  const onClick = useMemo(
    () =>
      idRef.current === activeHover
        ? (e: any) => {
            // text element with links in editor mode, should not trigger clicks
            if (e && e.target && e.target.tagName === 'A') {
              e.preventDefault();
            }
            setActive(idRef.current);
            const clickTarget = e.target;
            const mjmlTarget = clickTarget.closest('.mjml-tag');
            if (mjmlTarget) {
              const pos = mjmlTarget.getBoundingClientRect();

              // activate editor only for text elements,
              const identifier = findUniqueIdentifier(mjmlTarget, mjmlTarget.classList);

              // if its body, dont show copy or delte.
              if (identifier?.includes('body')) {
                setDelActive(false);
                setCopyActive(false);
                return;
              }

              if (identifier?.includes('text')) {
                const x = pos.left;
                const y = pos.top - 38;

                setCustomEditorStatus(true);
                customEditorSetX(x);
                customEditorSetY(y);
              } else {
                setCustomEditorStatus(false);
              }

              // moving the delete positon to currently selected elements right
              setDelActive(true);
              setCopyActive(true);

              setToolBars({ pos, delete: { setDelX, setDelY }, copy: { setCopyX, setCopyY } });
            }
          }
        : null,
    [idRef, activeHover]
  );
  const draggable = activeHover === idRef.current && !idRef.current.className.includes('section');
  const cursetStyle = useMemo(() => (activeHover === idRef.current ? 'pointer' : 'default'), [activeHover, idRef]);
  const outline = activeHover === idRef.current ? '2px dashed rgb(121, 202, 182)' : 'unset';
  const outlineClick = active === idRef.current ? '2px solid rgb(121, 202, 182)' : 'unset';

  // detect empty body
  if (detectEmptyElement(originalNode, 'body')) {
    logger.info('empty body detected');
  }
  // detect empty section
  if (detectEmptyElement(originalNode, 'section')) {
    logger.info('empty section detected');
  }

  const onDragStart = (e: any) => {
    if (active) {
      setActive(null);
    }
    e.dataTransfer.dropEffect = 'move';
    const uniqueClassName = findClosestParent(e.target);
    const find = findElementInJson(mjmlJson, uniqueClassName);
    if (find) {
      const [, path] = find;
      let item = _.get(mjmlJson, path.slice(1));
      item = { mode: 'move', uniqueClassName: uniqueClassName, config: _.cloneDeep(item) };
      let target = e.target;
      // const backup = target.children[1]?.cloneNode(true);
      // target.children[1].remove();
      // target.addEventListener('dragend', () => {
      //   target.appendChild(backup);
      // });
      // const dummyElement = document.createElement('div');

      e.dataTransfer.setDragImage(target, 0, 0);
      e.dataTransfer.setData('config', JSON.stringify(item));
    } else {
      logger.info(`move items: drag unable to find the config to transfer ${uniqueClassName}`);
    }
  };

  const memoFind = useCallback((e: HTMLElement) => findColumnOfElement(e), []);

  //todo: add removed perfomance optimization once functionality dev is complete.
  const onDragOver = (e: any) => {
    if (isColumn) {
      // column & section can not be nested,
      return;
    }
    const currentTarget = e.nativeEvent.target;
    const nearestTag = findClosestParent(currentTarget);
    // only show place item sign for column's children
    if (nearestTag?.includes('mj-column') || nearestTag?.includes('mj-section')) {
      logger.log('::indicator: trigger->column');
      if (nearestTag.includes('mj-column')) {
        const madeChange = genereateDropItemPlaceholderForColumn({ mjmlJson, nearestTag, setMjmlJson });
        if (madeChange === true) {
          logger.log('::indicator: trigger->column -> stopping further processing');
          return;
        }
        logger.log('::indicator: trigger->column -> no updates where done -> proceeding further processing');
      }
    }

    let columnElement = memoFind(currentTarget);
    // find column of element returns element and uniqueIdentifier
    if (columnElement) {
      [columnElement] = columnElement;
    }
    logger.log('::indicator: trigger->insideColumn');
    generateDropItemPlaceholder({
      mjmlJson,
      nearestTag,
      columnElement,
      currentTarget,
      setMjmlJson,
      event: e,
    });
  };

  const tag = typeoftag(originalNode.props.className);

  const ItemName = createElement(
    'div',
    {
      style: {
        position: 'absolute',
        right: -2,
        bottom: -24,
        zIndex: 100,
        display: tag !== 'social-element' ? 'block' : 'none',
        minWidth: 64,
        textAlign: 'right',
      },
      draggable: false,
    },

    activeHover === idRef.current || active === idRef.current
      ? createElement(
          'span',
          { style: { padding: '4px 6px', background: '#1890ff', color: 'white', fontSize: '14px' } },
          typeoftag(originalNode.props.className)
        )
      : null
  );

  let moveUpDown = null;

  // for sections show Indicators to show up and down.
  if (originalNode && originalNode.props.className.includes('mj-section')) {
    moveUpDown = <MoveUpDown className={originalNode.props.className} idRef={idRef} active={active} />;
  }

  const Element = createElement(
    originalNode.nodeName as string,
    {
      ...originalNode.props,
      onDragOver: _.debounce(onDragOver, 150),
      onMouseOver: onHover,
      onDragStart,
      draggable,
      ref: idRef,
      id: uniqueId.current,
      onClick,
      key: uniqueKey,
      style: {
        ...originalNode.props.style,
        cursor: 'pointer',
        outline: active === idRef.current ? outlineClick : outline,
        position: 'relative',
      },
    },
    originalNode.children ? [...originalNode.children, ItemName, moveUpDown] : null
  );

  return Element;
});
