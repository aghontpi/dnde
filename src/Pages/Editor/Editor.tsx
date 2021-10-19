import { View } from './View';
import css from './Editor.module.scss';
import { Attributes } from './Attributes';
import { ComponentBank } from './ComponentBank';
import { Button, PageHeader, Layout, Modal, Input } from 'antd';
import { success } from '../../Components/Messages';
import mjml2html from 'mjml-browser';
import { useEditor } from '../../Hooks/Editor.hook';
import { sendMail } from '../../Utils/sendMail';
import { useEffect, useState } from 'react';
import { Preview } from './Preview';
import { exportJson } from '../../Utils/mjmlProcessor';
import _ from 'lodash';
import { generatePreview } from '../../Utils/previewGenerator';
import { UNDOREDO } from '../../Utils/undoRedo';
import { logger } from '../../Utils/logger';
const { Content } = Layout;
const { confirm } = Modal;

export const Editor = () => {
  const { mjmlJson } = useEditor();
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    // reset undo redo actions on each new load
    UNDOREDO.reset();
  }, []);

  useEffect(() => {
    if (mjmlJson) {
      if (UNDOREDO.isUndoEmpty() && UNDOREDO.isRedoEmpty()) {
        UNDOREDO.newAction(mjmlJson);
      }
    }
  }, [mjmlJson]);

  const copyHTMLAsClipBoard = (e: any) => {
    e.preventDefault();
    const html = mjml2html(mjmlJson).html;
    navigator.clipboard.writeText(html);
    logger.log('html', html);
    generatePreview(html);
    success('Copied to clipboard & logged in devtools ');
  };

  const copyPreviewImage = async (e: any) => {
    e.preventDefault();
    const html = mjml2html(mjmlJson).html;
    navigator.clipboard.writeText(await generatePreview(html));
    success('Preview Image Copied to clipboard');
  };

  const copyJsonInClipBoard = (e: any) => {
    e.preventDefault();
    const to_copy = JSON.stringify(exportJson(_.cloneDeep(mjmlJson)));
    navigator.clipboard.writeText(to_copy);
    logger.log('json', to_copy);

    success('Copied to Clipboard & logged in devtools ');
  };

  return (
    <>
      <Preview
        visible={preview}
        visibleChange={(flag) => setPreview(flag)}
        inframeContent={preview ? mjml2html(mjmlJson).html : ''}
      />
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
              <Button key="5" onClick={copyPreviewImage}>
                Copy Preview Image
              </Button>
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
