import { View } from './View';
import css from './Editor.module.scss';
import { Attributes, OnlyAttributesDrawer } from './Attributes';
import { ComponentBank } from './ComponentBank';
import { Button } from 'antd';
import { success } from '../../Components/Messages';
import mjml2html from 'mjml-browser';
import { useEditor } from '../../Hooks/Editor.hook';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Preview } from './Preview';
import { exportJson } from '../../Utils/mjmlProcessor';
import _ from 'lodash';
import { generatePreview } from '../../Utils/previewGenerator';
import { UNDOREDO } from '../../Utils/undoRedo';

export const Editor = forwardRef((props, ref) => {
  const { mjmlJson } = useEditor();
  const [preview, setPreview] = useState(false);

  useImperativeHandle(ref, () => {
    return {
      getHtml,
      getJson,
    };
  });

  useEffect(() => {
    // reset undo redo actions on each new load
    UNDOREDO.reset();
  }, []);

  const getHtml = () => {
    let html = '';
    if (mjmlJson) {
      html = mjml2html(mjmlJson).html;
    }
    return html;
  };

  const getJson = () => {
    let json = {};
    if (mjmlJson) {
      const _json = JSON.stringify(exportJson(_.cloneDeep(mjmlJson)));
      if (_json) {
        json = _json;
      }
    }
    return json;
  };

  const copyPreviewImage = async (e: any) => {
    e.preventDefault();
    const html = mjml2html(mjmlJson).html;
    navigator.clipboard.writeText(await generatePreview(html));
    success('Preview Image Copied to clipboard');
  };

  return (
    <div className={css.editor}>
      <div className={css.bank}>
        <ComponentBank />
      </div>
      <div className={css.view}>
        <Preview
          visible={preview}
          visibleChange={(flag) => setPreview(flag)}
          inframeContent={preview ? mjml2html(mjmlJson).html : ''}
        />
        <Button
          style={{ position: 'absolute', top: '8px', right: '16px', zIndex: 300 }}
          key="3"
          onClick={() => setPreview(true)}
        >
          Preview
        </Button>
        <View />
      </div>
      <div className={css.attributes} style={{ position: 'relative' }}>
        <OnlyAttributesDrawer />
        <Attributes />
      </div>
    </div>
  );
});
