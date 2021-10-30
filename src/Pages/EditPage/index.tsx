import { Button, Col, Row, Modal, Layout, PageHeader, Input, Form, message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { Prompt, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useLazyGetTemplateQuery, useSendMailMutation } from '../../Api/api';
import { success } from '../../Components/Messages';
import { logger } from '../../Utils/logger';
import { UNDOREDO } from '../../Utils/undoRedo';
import Editor from '../Editor/';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { generatePreview } from '../../Utils/previewGenerator';

const { Content } = Layout;

const LOADING_KEY = 'loading';

const EditPage = () => {
  const ref = useRef<any>(null);
  const { templateId }: { templateId: string | undefined } = useParams();
  const [trigger, { data, isError, isLoading, isSuccess }] = useLazyGetTemplateQuery();

  useEffect(() => {
    if (templateId === 'new' || typeof templateId === 'undefined') {
      ref.current && ref.current.loadJson(null);
    } else {
      if (templateId) {
        message.loading({ content: 'Fetching Template...', key: LOADING_KEY, duration: 0 });
        trigger({ id: templateId });
      }
    }
  }, []);

  useEffect(() => {
    if (isSuccess && data) {
      try {
        ref.current && ref.current.loadJson(data.response.data);
      } catch (e) {
        message.error('Unable to load template', 3);
      }
    } else if (isSuccess && !data) {
      message.error('Template is empty', 2);
    }
    if (isSuccess) {
      message.destroy(LOADING_KEY);
    }
    if (isError) {
      message.info('Network error, template not fetched.', 2);
    }
  }, [isError, isLoading, isSuccess, data]);

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
      const html = ref.current.getHtml();
      navigator.clipboard.writeText(html);
      logger.log('html', html);
      success('Copied to clipboard & logged in devtools ');
      e.preventDefault();
    }
  };

  const copyPreviewImage = async (e: any) => {
    if (ref.current) {
      e.preventDefault();
      const html = ref.current.html;
      navigator.clipboard.writeText(await generatePreview(html));
      success('Preview Image Copied to clipboard');
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
  const [sendMailApi] = useSendMailMutation();

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

const modalConfirmLoadLocalState = async (okCallback: () => void, cancelCallback: () => void) => {
  return new Promise<boolean>((resolve, reject) => {
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: 'local save found do you want to load it?',
      okText: 'restore',
      cancelText: 'cancel',
      onOk: () => {
        okCallback();
        resolve(true);
      },
      onCancel: () => {
        cancelCallback();
        resolve(false);
      },
    });
  });
};
