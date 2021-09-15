import _ from 'lodash';
import React, { memo, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { FC } from 'react';
import styled from 'styled-components';
import { useHtmlWrapper } from '../Hooks/Htmlwrapper.hook';

interface HtmlWrapperProps {
  children: ReactNode;
  key: string | number;
}

export const HtmlWrapper = memo(({ children, key }: HtmlWrapperProps) => {
  const { setUIWrapperList, setActive, setActiveHover, active, activeHover, id, setId, getId } = useHtmlWrapper();
  const idRef = useRef(id);

  useEffect(() => {
    getId();
  }, []);

  const onHover = () => setActiveHover(idRef.current);
  const onClick = () => setActive(idRef.current);
  console.log('hover', activeHover, active);

  return (
    <div
      key={key}
      id={idRef.current.toString()}
      draggable={activeHover == idRef.current}
      onMouseOver={onHover}
      onClick={onClick}
      className={idRef.current.toString()}
      // register
    >
      {/* todo: make it so, that only text editable fields are shown this, 
        make sure to create only one instance of ckeditor and move the position relative to the position of the text */}
      {children}
    </div>
  );
});
