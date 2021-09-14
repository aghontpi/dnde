import _ from 'lodash';
import React, { memo, ReactNode, useEffect, useMemo, useState } from 'react';
import { FC } from 'react';
import styled from 'styled-components';
import { useHtmlWrapper } from '../Hooks/Htmlwrapper.hook';

interface HtmlWrapperProps {
  children: ReactNode;
  key: string | number;
}

export const HtmlWrapper = memo(({ children, key }: HtmlWrapperProps) => {
  const {
    setUIWrapperList,
    setActive,
    setActiveHover,
    active,
    activeHover,
    id: globalID,
    setId: globalSetId,
  } = useHtmlWrapper();

  // useEffect(() => {
  //   if (id === '') {
  //     setId('id' + globalID);
  //     globalSetId(globalID + 1);
  //   }
  // }, []);
  const id = 'id-' + _.uniqueId();

  const onHover = useMemo(() => () => setActiveHover(id), [id]);
  const onClick = useMemo(() => () => setActive(id), [id]);

  return (
    <div key={key} id={id} draggable={activeHover === id} onClick={onClick} onMouseOver={onHover} className={id}>
      {/* todo: make it so, that only text editable fields are shown this, 
        make sure to create only one instance of ckeditor and move the position relative to the position of the text */}
      {children}
    </div>
  );
});
