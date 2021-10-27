import { Button, Col, Row, Modal, Layout, PageHeader, Input } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { Prompt } from 'react-router-dom';
import { success } from '../../Components/Messages';
import { logger } from '../../Utils/logger';
import { UNDOREDO } from '../../Utils/undoRedo';
import Editor from '../Editor/';

const { Content } = Layout;
const { confirm } = Modal;

const EditPage = () => {
  const ref = useRef<any>(null);
  const [isBlockingRoute, setIsBlockingRoute] = useState(false);

  useEffect(() => {
    if (UNDOREDO.undo.length > 1 || UNDOREDO.redo.length > 1) {
      setIsBlockingRoute(true);
      return;
    }
    setIsBlockingRoute(false);
  }, [UNDOREDO.undo, UNDOREDO.redo]);

  const sendEmail = () => {
    if (ref.current) {
      const html = ref.current.getHtml();
      console.log('html', html);
    }
  };

  const copyJsonInClipBoard = (e: any) => {
    if (ref.current) {
      e.preventDefault();
      const json = ref.current.getJson();
      logger.log('json', json);
      navigator.clipboard.writeText(json);
      success('Copied to Clipboard & logged in devtools ');
    }
  };

  const copyHTMLAsClipBoard = (e: any) => {
    if (ref.current) {
      const html = ref.current.html;
      navigator.clipboard.writeText(html);
      logger.log('html', html);
      success('Copied to clipboard & logged in devtools ');
      e.preventDefault();
    }
  };

  return (
    <div style={{ flex: '1', display: 'flex', width: '100%', height: '100%' }}>
      <Row style={{ height: '100%', width: '100%' }} justify="center">
        <Prompt when={isBlockingRoute} message={() => 'Are you sure you want to leave, your changes will be lost'} />
        <Col lg={24} xl={0}>
          <div style={{ textAlign: 'center', padding: '40px', paddingTop: '10%' }}>
            <h3>Sorry, You need a device with a larger screen to perform editing, atleast '{'>'}=1200px'</h3>
          </div>
        </Col>
        <Col xs={0} xl={24}>
          <Layout style={{ height: '100%' }}>
            <PageHeader
              ghost={false}
              onBack={() => window.history.back()}
              title="dnde"
              subTitle=""
              style={{ borderBottom: '1px solid #e8e8e8' }}
              extra={[
                <>
                  <SendTestMail key="4" />
                  {/* <Button key="5" onClick={copyPreviewImage}>
                Copy Preview Image
              </Button> */}
                  <Button key="2" onClick={copyHTMLAsClipBoard}>
                    Copy as html
                  </Button>
                  <Button key="1" onClick={copyJsonInClipBoard}>
                    Copy as json
                  </Button>
                </>,
              ]}
            ></PageHeader>
            <Content>
              <Editor ref={ref} />
              <Button onClick={(e: any) => sendEmail()} style={{ position: 'absolute', bottom: '16px', right: '16px' }}>
                gethtml
              </Button>
            </Content>
          </Layout>
        </Col>
      </Row>
    </div>
  );
};

export { EditPage };

const SendTestMail = () => {
  const [mail, SetMail] = useState('');
  const onBlur = (e: any) => {
    SetMail(e.currentTarget.value);
  };

  const msg = () =>
    confirm({
      title: 'Email',
      icon: null,
      content: <Input onBlur={onBlur} />,
      onOk: () => {},
    });

  return (
    <Button key="2" type="primary" onClick={msg}>
      Send Test Mail
    </Button>
  );
};
