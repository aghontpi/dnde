import { Button, Col, Row, Modal, Layout, PageHeader, Input, Form, message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { Prompt } from 'react-router-dom';
import styled from 'styled-components';
import { useSendMailMutation } from '../../Api/api';
import { success } from '../../Components/Messages';
import { logger } from '../../Utils/logger';
import { UNDOREDO } from '../../Utils/undoRedo';
import Editor from '../Editor/';

const { Content } = Layout;
const { confirm } = Modal;

const EditPage = () => {
  const ref = useRef<any>(null);

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
        <Prompt
          when={UNDOREDO.undo.length > 1 || UNDOREDO.redo.length > 1}
          message={() => 'Are you sure you want to leave, your changes will be lost'}
        />
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
                  <SendTestMail editorRef={ref} key="4" />
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

let MESSAGEID = 'sendMailid';

const SendTestMail = ({ editorRef }: { editorRef: any }) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [sendMailApi, sendMailApiStatus] = useSendMailMutation();

  const onOk = () => {
    form.validateFields().then(async (values) => {
      if (editorRef.current) {
        const html = editorRef.current.getHtml();
        if (html && html.trim().length > 0) {
          message.loading({ content: 'mail is being sent', key: MESSAGEID, duration: 0 });
          setVisible(false);
          const result = (await sendMailApi({
            to: values.email,
            html: editorRef.current.getHtml(),
          })
            .unwrap()
            .catch((e) => {
              message.error({ content: 'unable to contact server', key: MESSAGEID, duration: 0 });
            })) as any;
          if (result) {
            if (result.success) {
              message.success({ content: result.success, key: MESSAGEID, duration: 4 });
            } else if (result.error) {
              message.error({ content: result.error, key: MESSAGEID, duration: 2 });
            }
          }
        } else {
          message.error('design can not be converted into html');
        }
        setVisible(false);
      } else {
        setVisible(false);
      }
    });
  };

  const onCancel = () => {
    setVisible(false);
  };

  return (
    <>
      <Button key="2" type="primary" onClick={() => setVisible(!visible)}>
        Send Test Mail
      </Button>
      <CustomModal
        closable={false}
        title={null}
        visible={visible}
        onOk={onOk}
        onCancel={onCancel}
        okText="sendMail"
        cancelText="cancel"
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Email"
            validateTrigger="onchange"
            name="email"
            rules={[{ required: true }, { type: 'email' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </CustomModal>
    </>
  );
};

const CustomModal = styled(Modal)`
  .ant-modal-footer {
    border-top: unset;
  }

  .ant-form-item {
    margin-bottom: 0px;
  }

  .ant-modal-footer {
    padding-top: 0px;
  }
`;
