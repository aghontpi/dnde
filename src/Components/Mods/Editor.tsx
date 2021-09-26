import DeleteOutlined from '@ant-design/icons/lib/icons/DeleteOutlined';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { Button, Popconfirm } from 'antd';
import ED from 'ckeditor5-custom-build/build/ckeditor';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useCkeditor } from '../../Hooks/Ckeditor.hook';
import { useEditor } from '../../Hooks/Editor.hook';
import { useHtmlWrapper } from '../../Hooks/Htmlwrapper.hook';
import { findClosestParent } from '../../Utils/closestParent';
import { findElementInJson } from '../../Utils/findElementInMjmlJson';
import { Remove } from '../../Utils/operations';
import { columnPlaceholder } from '../Section';
import { findTextNode } from '../../Utils/findTextNode';
import Quill from 'quill';
import { useQuillEditor } from '../../Hooks/Quill.hook';

export const Editor = () => {
  const { ref, isActive, x, y, delActive, delX, delY, setDelActive } = useCkeditor();
  const { mjmlJson, setMjmlJson } = useEditor();
  const { active, setActive } = useHtmlWrapper();
  const [quill, setQuill] = useState<any>(null);
  const [toolbar, setToolbar] = useState<any>(null);
  const refTxt = useRef();
  const { QuillActive, quillX, quillY } = useQuillEditor();
  useEffect(() => {
    if (ref) {
      console.log(ref, ref.current);
    }
  }, [ref]);

  useEffect(() => {
    if (active && QuillActive) {
      let textNode = findTextNode(active);
      // if (!textNode || textNode.contentEditable) {
      //   return;
      // }
      refTxt.current = textNode;
      if (refTxt.current) {
        // todo: fix QuillWrapper keeps wrapping up an extra div on init
        let lquill: any = new Quill(refTxt.current, { theme: 'snow', modules: { toolbar: '#toolbarContainer' } });
        setQuill(lquill);
        let toolbar = lquill.getModule('toolbar');
        lquill.editor.scroll.domNode.classList.remove('ql-editor');
        // remove clipboard and tooltip, figout to move somewhere else
        lquill.container.children[1].remove();
        lquill.container.children[1].remove();

        // lquill.container.classList.remove('ql-container');
        setToolbar(toolbar);
        // toolbar.container.style.visibility = 'hidden';V
        // const toolbarElement = toolbar.container;

        // const element = toolbar?.container;
        // const isToolbarFocused =
        //   element && (element.contains(document.activeElement) || element === document.activeElement);
        // if (!isToolbarFocused) {
        //   element.style.visibility = 'hidden';
        // }
        // toolbarElement.style.visibility = 'visible';
        // toolbarElement.style.position = 'absolute';
        // toolbarElement.style.top = `${x - 270}px`; // TODO need additional calculation for edge cases
        // toolbarElement.style.left = `${y + 400}px`;
      }
    }
  }, [active, QuillActive]);

  const deleteConfirm = useMemo(
    () => () => {
      if (active) {
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
        <select className="ql-size">
          <option value="small"></option>
          <option selected></option>
          <option value="large"></option>
          <option value="huge"></option>
        </select>
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
            onReady={(editor) => {
              console.log('', editor);
            }}
            onChange={(event, editor) => {
              const data = editor.getData();
              console.log({ event, editor, data });
            }}
            onBlur={(event, editor) => {
              console.log('Blur.', editor);
            }}
            onFocus={(event, editor) => {
              console.log('Focus.', editor);
            }}
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
