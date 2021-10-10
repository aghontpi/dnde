import _, { floor } from 'lodash';
import { createElement, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useCkeditor } from '../Hooks/Ckeditor.hook';
import { useCustomEditorPosition, useCustomEditorStatus } from '../Hooks/CustomEditor.hook';
import { useEditor } from '../Hooks/Editor.hook';
import { useHtmlWrapper } from '../Hooks/Htmlwrapper.hook';
import { useQuillEditor } from '../Hooks/Quill.hook';
import { findClosestParent, findUniqueIdentifier } from '../Utils/closestParent';
import { detectEmptyElement } from '../Utils/detectEmptyBody';
import { findElementInJson } from '../Utils/findElementInMjmlJson';
import { findColumnOfElement } from '../Utils/findElementsParent';
import { generateDropItemPlaceholder } from '../Utils/generateDropItemPlaceholder';

interface HtmlWrapperProps {
  // children: React.DOMElement<React.DOMAttributes<Element>, Element>;
  uniqueKey: string | number;
  originalNode: any;
}

export const HtmlWrapper = memo(({ uniqueKey, originalNode }: HtmlWrapperProps) => {
  const { setUIWrapperList, setActive, setActiveHover, active, activeHover, id, setId, getId, uiList } =
    useHtmlWrapper();
  const { setX, setY, setDelActive, setDelX, setDelY, copy } = useCkeditor();
  const { setQuillActive, setQuillX, setQuillY } = useQuillEditor();
  const { mjmlJson, setMjmlJson } = useEditor();
  const { setX: customEditorSetX, setY: customEditorSetY } = useCustomEditorPosition();
  const { setActive: setCustomEditorStatus } = useCustomEditorStatus();
  const idRef = useRef(id);
  const uniqueId = useRef(id);
  const [contentEditable, setContentEditable] = useState(false);

  const { setCopyX, setCopyActive, setCopyY } = copy;

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
                const x = pos.left;
                const y = pos.top - 38;

                // ckeditor
                // if (pos) {
                //   setX(x);
                //   setY(y);
                // }

                //quilleditor
                // setQuillActive(true);
                // setQuillX(x);
                // setQuillY(y);

                // customEditor

                setCustomEditorStatus(true);
                customEditorSetX(x);
                customEditorSetY(y);
                setContentEditable(true);
              } else {
                // setQuillActive(false);
                setCustomEditorStatus(false);
              }

              // moving the delete positon to currently selected elements right
              setDelActive(true);
              setCopyActive(true);

              const IconSize = 32;
              const numberOfIcons = 2 * IconSize;
              if (pos) {
                setDelX(pos.right + 4);
                const middle = floor((pos.bottom - pos.top) / 2) - numberOfIcons / 2;
                setDelY(pos.top + middle);
                setCopyX(pos.right + 4);
                // below the delete icon, with a little offset
                setCopyY(pos.top + middle + IconSize + 4);
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

  const onDragStart = (e: any) => {
    e.dataTransfer.dropEffect = 'copy';
    const uniqueClassName = findClosestParent(e.target);
    const find = findElementInJson(mjmlJson, uniqueClassName);
    if (find) {
      const [, path] = find;
      let item = _.get(mjmlJson, path.slice(1));
      item = { mode: 'move', uniqueClassName: uniqueClassName, config: _.cloneDeep(item) };
      e.dataTransfer.setData('config', JSON.stringify(item));
    } else {
      console.info(`move items: drag unable to find the config to transfer ${uniqueClassName}`);
    }
  };

  const memoFind = useCallback((e: HTMLElement) => findColumnOfElement(e), []);

  const onDragOver = useCallback((e: any) => {
    const currentTarget = e.nativeEvent.target;
    const nearestTag = findClosestParent(currentTarget);
    // only show place item sign for column's children
    if (nearestTag?.includes('mj-column') || nearestTag?.includes('mj-section')) {
      return;
    }

    let columnElement = memoFind(currentTarget);
    // find column of element returns element and uniqueIdentifier
    if (columnElement) {
      [columnElement] = columnElement;
    }

    generateDropItemPlaceholder({
      mjmlJson,
      nearestTag,
      columnElement,
      currentTarget,
      setMjmlJson,
      event: e,
    });
  }, []);

  return useMemo(
    () =>
      createElement(
        originalNode.nodeName as string,
        {
          ...originalNode.props,
          onMouseEnter: onHover,
          onMouseLeave: onHover,
          onDragOver: _.debounce(onDragOver, 150),
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
          },
        },
        originalNode.children
      ),
    [idRef, draggable, onHover, onClick, originalNode, outline, outlineClick, active, uniqueId, activeHover]
  );
});
