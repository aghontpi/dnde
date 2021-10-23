import { Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useEditor } from '../Hooks/Editor.hook';
import { useHtmlWrapper } from '../Hooks/Htmlwrapper.hook';
import { Background } from './Mods/Background';
import { Width } from './Mods/WidthHeight';

export const BODY_PATH = 'children[1]';

const BodyContainer = styled.div`
  padding: 16px 0px;
  .title {
    font-size: 14px;
    font-weight: 600;
  }
  .props-container {
    padding: 16px;
  }
`;

const BodyAttributes = () => {
  return (
    <BodyContainer>
      <Row justify="center">
        <Col>
          <span className="title">Body Properties</span>
        </Col>
      </Row>
      <div className="props-container">
        <Width activePath={BODY_PATH} />
        <Background activePath={BODY_PATH} label="Body Background:" />
      </div>
    </BodyContainer>
  );
};

export { BodyAttributes };
