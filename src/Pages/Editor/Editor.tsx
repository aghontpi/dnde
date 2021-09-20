import { View } from './View';
import css from './Editor.module.scss';
import { Attributes } from './Attributes';
import { ComponentBank } from './ComponentBank';
import { Button, PageHeader, Layout, Modal, Input, Tabs } from 'antd';
import { success } from '../../Components/Messages';
import mjml2html from 'mjml-browser';
import { useEditor } from '../../Hooks/Editor.hook';
import { sendMail } from '../../Utils/sendMail';
import { useState } from 'react';
import { Preview } from './Preview';
const { Content } = Layout;
const { confirm } = Modal;

const { TabPane } = Tabs;

export const Editor = () => {
  const { mjmlJson } = useEditor();
  const [preview, setPreview] = useState(false);

  const copyHTMLAsClipBoard = (e: any) => {
    e.preventDefault();
    const html = mjml2html(mjmlJson).html;
    navigator.clipboard.writeText(html);
    console.log('html', html);

    success('Copied to clipboard & logged in devtools ');
  };

  const copyJsonInClipBoard = (e: any) => {
    e.preventDefault();
    const to_copy = JSON.stringify(mjmlJson);
    navigator.clipboard.writeText(to_copy);
    console.log('json', to_copy);

    success('Copied to Clipboard & logged in devtools ');
  };

  return (
    <>
      <Preview visible={preview} visibleChange={(flag) => setPreview(flag)} />
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
              <Button key="3" onClick={() => setPreview(true)}>
                Preview
              </Button>
              <Button key="2" onClick={copyHTMLAsClipBoard}>
                Copy as html
              </Button>
              <Button key="1" onClick={copyJsonInClipBoard}>
                Copy as json
              </Button>
              ,
            </>,
          ]}
        ></PageHeader>
        <Content>
          <div className={css.editor}>
            <div className={css.bank}>
              <ComponentBank />
            </div>
            <div className={css.view}>
              <View />
            </div>
            <div className={css.attributes}>
              <Attributes />
            </div>
          </div>
        </Content>
      </Layout>
    </>
  );
};

const SendTestMail = () => {
  const { mjmlJson } = useEditor();
  //todo: investigate onChange behaviour here ~sendTestMail
  const [mail, SetMail] = useState('');
  const onBlur = (e: any) => {
    SetMail(e.currentTarget.value);
  };

  const msg = () =>
    confirm({
      title: 'Email',
      icon: null,
      content: <Input onBlur={onBlur} />,
      onOk: () => {
        mail && sendMail(mail, mjml2html(mjmlJson).html);
      },
    });

  return (
    <Button key="2" type="primary" onClick={msg}>
      Send Test Mail
    </Button>
  );
};
