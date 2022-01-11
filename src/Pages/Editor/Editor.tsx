import { View } from './View';
import css from './Editor.module.scss';
import { Attributes, OnlyAttributesDrawer } from './Attributes';
import { ComponentBank } from './ComponentBank';
import { Button } from 'antd';
import mjml2html from 'mjml-browser';
import { useEditor } from '../../Hooks/Editor.hook';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Preview } from './Preview';
import { exportJson, importJson } from '../../Utils/mjmlProcessor';
import _ from 'lodash';
import { UNDOREDO } from '../../Utils/undoRedo';
import { useDragAndDropUniqueId } from '../../Hooks/Drag.hook';
import { EMPTY_EDITOR_STATE } from '../../Context/Editor.context';

export interface EmailEditorProps {
  preview?: boolean;
  showUndoRedo?: boolean;
}

export const Editor = forwardRef((props: EmailEditorProps, ref) => {
  const viewRef = useRef<any>(null);
  const { mjmlJson, setMjmlJson } = useEditor();
  const [preview, setPreview] = useState(false);
  const { getId } = useDragAndDropUniqueId();

  useImperativeHandle(ref, () => {
    return {
      getHtml,
      getJson,
      loadJson,
      undoredo: {
        undoActionCallback,
        redoActionCallback,
        isUndoEmpty: UNDOREDO.isUndoEmpty,
        isRedoEmpty: UNDOREDO.isRedoEmpty,
      },
    };
  });

  /**
   *
   * @param json JSON-String | null
   * null if want to load empty template
   * @param raw boolean
   * raw used for unprocessed json exports, restoring from crash with undoredo
   * @returns
   */
  const loadJson = (json: string, raw: false) => {
    try {
      if (json !== null) {
        const parsedJson = JSON.parse(json);
        if (parsedJson) {
          const processedJson = importJson(parsedJson, getId, raw);
          processedJson && setMjmlJson({ ...processedJson });
          UNDOREDO.newAction({ ...processedJson });
        }
      } else if (json === null) {
        UNDOREDO.reset();
        setMjmlJson(_.cloneDeep(EMPTY_EDITOR_STATE));
      }
    } catch (e) {
      throw new Error('Invalid JSON');
    }
    return;
  };

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

  const undoActionCallback = () => {
    if (viewRef.current) {
      viewRef.current.undoCallback();
    }
  };

  const redoActionCallback = () => {
    if (viewRef.current) {
      viewRef.current.redoCallback();
    }
  };

  return (
    <div className={css.editor}>
      <div className={css.bank}>
        <ComponentBank />
      </div>
      <div className={css.view}>
        {/* disable preview only if preview is passed with 'false' */}
        {(props.preview === undefined || props.preview === true) && (
          <>
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
          </>
        )}
        <View ref={viewRef} showUndoRedo={props.showUndoRedo} />
      </div>
      <div className={css.attributes} style={{ position: 'relative' }}>
        <OnlyAttributesDrawer />
        <Attributes />
      </div>
    </div>
  );
});
