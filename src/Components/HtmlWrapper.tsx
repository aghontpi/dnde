import React, { ChangeEvent, ReactNode, SyntheticEvent, useMemo, useState } from 'react';
import { FC } from 'react';
import styled from 'styled-components';

interface HtmlWrapperProps {
  children: ReactNode;
  key: string | number;
}

const Wrapper = styled.div`
  div {
    hover {
      outline: 2px dotted #000;
      .parent * {
        pointer-events: none;
      }
    }
    .selected {
      outline: 2px dotted green;
    }
  }
`;

export const HtmlWrapper = ({ children, key }: HtmlWrapperProps) => {
  const [selected, setSelected] = useState(() => false);
  const [hover, setHover] = useState(() => false);
  const onClick = useMemo(
    () => (e: SyntheticEvent) => {
      e.currentTarget.classList.add('selected');
      setSelected(!selected);
    },
    [selected]
  );

  const onHover = (e: any) => {
    console.log(e.currentTarget, e.type, e);
  };

  return (
    <Wrapper draggable={true} key={key} onClick={onClick} onMouseEnter={onHover} onMouseOut={onHover}>
      <div>{children}</div>
    </Wrapper>
  );
};
