import { Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useEditor } from '../Hooks/Editor.hook';
import { useHtmlWrapper } from '../Hooks/Htmlwrapper.hook';
import { Background } from './Mods/Background';
import { Width } from './Mods/WidthHeight';

const BODY_PATH = 'children[1]';

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
  const { mjmlJson } = useEditor();
  const [path, setPath] = useState('');
  const [init, setInit] = useState(false);

  useEffect(() => {
    if (init === false && path === '') {
      // body is not deepy nested, the path is static, take advantage of this
      const bodyConfig = mjmlJson && mjmlJson['children'][1];
      if (bodyConfig && bodyConfig['tagName'] === 'mj-body') {
        setPath(BODY_PATH);
        setInit(true);
      }
    }
  }, [mjmlJson]);

  return (
    <BodyContainer>
      <Row justify="center">
        <Col>
          <span className="title">Body Properties</span>
        </Col>
      </Row>
      {path ? (
        <div className="props-container">
          <Width activePath={path} />
          <Background activePath={path} label="Body Background:" />
        </div>
      ) : null}
    </BodyContainer>
  );
};

export { BodyAttributes };
