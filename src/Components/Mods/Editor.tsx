import DeleteOutlined from '@ant-design/icons/lib/icons/DeleteOutlined';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { Button, Popconfirm } from 'antd';
import ED from 'ckeditor5-custom-build/build/ckeditor';
import { useCallback, useEffect, useMemo } from 'react';
import { useCkeditor } from '../../Hooks/Ckeditor.hook';
import { useEditor } from '../../Hooks/Editor.hook';
import { useHtmlWrapper } from '../../Hooks/Htmlwrapper.hook';
import { Remove } from '../../Utils/operations';
import { findTextNode } from '../../Utils/findTextNode';
import Quill from 'quill';
import { useQuillEditor } from '../../Hooks/Quill.hook';
import { findUniqueIdentifier } from '../../Utils/closestParent';
import { findElementInJson } from '../../Utils/findElementInMjmlJson';
import _ from 'lodash';

export const Editor = () => {
  const { ref, isActive, x, y, delActive, delX, delY, setDelActive } = useCkeditor();
  const { mjmlJson, setMjmlJson } = useEditor();
  const { active, setActive } = useHtmlWrapper();
  const { QuillActive, quillX, quillY, quillEditor, setQuillEditor, setQuillActive } = useQuillEditor();
  useEffect(() => {
    if (ref) {
      console.log(ref, ref.current);
    }
  }, [ref]);

  useEffect(() => {
    if (quillEditor && !QuillActive) {
      quillEditor.enable(false);
    }
  }, [QuillActive]);

  const quillOnChange = useMemo(
    () => (delta: any, oldDelta: any, source: any) => {
      console.log('change', quillEditor);
      if (quillEditor) {
        console.log('quillContents', quillEditor.getContents());
      }
    },
    [quillEditor]
  );

  useEffect(() => {
    if (active && QuillActive) {
      let textNode = findTextNode(active);
      if (textNode) {
        // todo: fix QuillWrapper keeps wrapping up an extra div on init
        let lquill: any = new Quill(textNode, { theme: 'snow', modules: { toolbar: '#toolbarContainer' } });
        setQuillEditor(lquill);
        lquill.editor.scroll.domNode.classList.remove('ql-editor');
        lquill.on('text-change', () => {
          const change = lquill.container.firstChild.innerHTML;
          console.log(change);
          const identifier = findUniqueIdentifier(active, active.classList);
          if (identifier) {
            let position = findElementInJson(mjmlJson, identifier);
            if (position) {
              let [, path] = position;
              let item = _.get(mjmlJson, path.slice(1));
              item.content = change;
              const updated = _.set(mjmlJson, path.slice(1), item);
              setMjmlJson({ ...updated });
            }
          }
        });
        // remove clipboard and tooltip
        lquill.container.children[1].remove();
        lquill.container.children[1].remove();
      }
    }
  }, [active, QuillActive]);

  const deleteConfirm = useMemo(
    () => () => {
      if (active) {
        setQuillActive(false);
        Remove({ target: active, mjmlJson, setMjmlJson, setDelActive, setActive });
      }
    },
    [active]
  );

  return (
    <>
      <div
        id="toolbarContainer"
        style={{
          visibility: QuillActive ? 'visible' : 'hidden',
          backgroundColor: '#fff',
          zIndex: 99,
          position: 'fixed',
          left: `${quillX}px`,
          top: `${quillY}px`,
        }}
      >
        <button className="ql-bold"></button>
        <button className="ql-italic"></button>
        <button className="ql-underline"></button>
        <button className="ql-script" value="sub"></button>
        <button className="ql-script" value="super"></button>
      </div>

      <div
        key="editorContainer"
        id="editorContainer"
        ref={ref}
        style={{ display: isActive ? 'block' : 'none', position: 'fixed', left: `${x}px`, top: `${y}px` }}
      >
        <div key="editor">
          <CKEditor
            editor={ED}
            disabled={false}
            config={{
              toolbar: [
                'fontSize',
                'fontColor',
                'FontFamily',
                'FontBackgroundColor',
                '|',
                'heading',
                '|',
                'bold',
                'italic',
                '|',
                'undo',
                'redo',
                'insertTable',
              ],
            }}
            data={'placement'}
            onReady={(editor) => {}}
            onChange={(event, editor) => {}}
            onBlur={(event, editor) => {}}
            onFocus={(event, editor) => {}}
          />
        </div>
      </div>
      <Delete
        style={{ display: delActive ? 'block' : 'none', position: 'fixed', left: `${delX}px`, top: `${delY}px` }}
        deleteConfirm={deleteConfirm}
      />
    </>
  );
};

interface DeleteProps {
  style: any;
  deleteConfirm: () => void;
}

const Delete = ({ style, deleteConfirm }: DeleteProps) => {
  return (
    <Popconfirm placement="right" title="Are you sure ?" okText="Delete" cancelText="Cancel" onConfirm={deleteConfirm}>
      <Button style={style} type="primary" icon={<DeleteOutlined />} />
    </Popconfirm>
  );
};
