import { CKEditor } from '@ckeditor/ckeditor5-react';
import { Button, Popconfirm } from 'antd';
import ED from 'ckeditor5-custom-build/build/ckeditor';
import { useEffect, useMemo } from 'react';
import { useCkeditor } from '../../Hooks/Ckeditor.hook';
import { useEditor } from '../../Hooks/Editor.hook';
import { useHtmlWrapper } from '../../Hooks/Htmlwrapper.hook';
import { Remove, Copy as CopyOperation } from '../../Utils/operations';
import { findTextNode } from '../../Utils/findTextNode';
import Quill from 'quill';
import { useQuillEditor } from '../../Hooks/Quill.hook';
import { findUniqueIdentifier } from '../../Utils/closestParent';
import { findElementInJson } from '../../Utils/findElementInMjmlJson';
import _ from 'lodash';
import CopyFilled from '@ant-design/icons/lib/icons/CopyFilled';
import DeleteFilled from '@ant-design/icons/lib/icons/DeleteFilled';
import { useUniqueIdGenerator } from '../../Hooks/Drag.hook';
import { logger } from '../../Utils/logger';

export const Editor = () => {
  const { ref, isActive, x, y, delActive, delX, delY, setDelActive, copy } = useCkeditor();
  const { mjmlJson, setMjmlJson } = useEditor();
  const { active, setActive } = useHtmlWrapper();
  const { QuillActive, quillX, quillY, setQuillEditor, setQuillActive } = useQuillEditor();
  let { quillEditor } = useQuillEditor();
  const { copyActive, setCopyActive, copyX, copyY } = copy;
  const { getId } = useUniqueIdGenerator();

  useEffect(() => {
    if (quillEditor) {
      const identifier = findUniqueIdentifier(active, active.classList);
      quillEditor.on('text-change', () => {
        const change = quillEditor.container.firstChild.innerHTML;
        logger.log(change);
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
    }
    return () => quillEditor && quillEditor.off('text-change');
  }, [quillEditor]);

  useEffect(() => {
    if (active && QuillActive) {
      let textNode = findTextNode(active);

      if (quillEditor) {
        // previous instance listeners
        quillEditor.off('text-change');
      }

      if (textNode) {
        // fix for QuillWrapper keeps wrapping up an extra div on init
        while (textNode.parentElement.classList.contains('ql-container') || textNode.hasAttribute('data-gramm')) {
          textNode = textNode.parentElement;
        }
        if (textNode.classList.contains('ql-container')) {
          textNode.classList.remove('ql-container');
          textNode.classList.remove('ql-snow');
        }

        let lquill: any = new Quill(textNode, { theme: 'snow', modules: { toolbar: '#toolbarContainer' } });

        // fix for allowing multiple instances,
        // on how it works refer, 'https://github.com/quilljs/quill/blob/develop/modules/toolbar.js'
        // pain \u{1F63F}
        lquill.getModule('toolbar').container.childNodes.forEach((element: any) => {
          const clone = element.cloneNode(true);
          element.parentNode.replaceChild(clone, element);
        });

        let toolbar = lquill.getModule('toolbar');

        toolbar.container.childNodes.forEach((input: any) => {
          toolbar.attach(input);
        }, toolbar);

        setQuillEditor(lquill);
        lquill.editor.scroll.domNode.classList.remove('ql-editor');

        // remove clipboard and tooltip
        lquill.container.children[1].remove();
        lquill.container.children[1].remove();
        lquill = undefined;
      }
    }
  }, [active]);

  const deleteConfirm = useMemo(
    () => () => {
      if (active) {
        // setQuillActive(false);
        Remove({ target: active, mjmlJson, setMjmlJson, setDelActive, setActive, setCopyActive });
      }
    },
    [active]
  );

  const copyAction = () => {
    if (active) {
      CopyOperation({
        mjmlJson,
        setActive,
        setMjmlJson,
        setCopyActive,
        setDelActive,
        target: active,
        uidGenerator: getId,
      });
    }
  };

  return (
    <>
      {/* <div
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
      </div> */}

      {/* <div
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
      </div> */}
      <Delete
        style={{
          zIndex: 200,
          display: delActive ? 'block' : 'none',
          position: 'fixed',
          left: `${delX}px`,
          top: `${delY}px`,
        }}
        deleteConfirm={deleteConfirm}
      />
      <Copy
        onClick={copyAction}
        style={{
          zIndex: 200,
          display: copyActive ? 'block' : 'none',
          position: 'fixed',
          left: `${copyX}px`,
          top: `${copyY}px`,
        }}
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
      <Button style={style} type="primary" icon={<DeleteFilled />} />
    </Popconfirm>
  );
};

interface CopyProps {
  style: any;
  onClick: () => void;
}

const Copy = ({ style, onClick }: CopyProps) => {
  return <Button style={style} onClick={onClick} type="primary" icon={<CopyFilled />} />;
};
