import DeleteOutlined from '@ant-design/icons/lib/icons/DeleteOutlined';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { Button, Popconfirm } from 'antd';
import ED from 'ckeditor5-custom-build/build/ckeditor';
import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import { useCkeditor } from '../../Hooks/Ckeditor.hook';
import { useEditor } from '../../Hooks/Editor.hook';
import { useHtmlWrapper } from '../../Hooks/Htmlwrapper.hook';
import { findClosestParent } from '../../Utils/closestParent';
import { findElementInJson } from '../../Utils/findElementInMjmlJson';

export const Editor = () => {
  const { ref, isActive, x, y, delActive, delX, delY, setDelActive } = useCkeditor();
  const { mjmlJson, setMjmlJson } = useEditor();
  const { active, setActive } = useHtmlWrapper();
  useEffect(() => {
    if (ref) {
      console.log(ref, ref.current);
    }
  }, [ref]);

  const deleteConfirm = useMemo(
    () => () => {
      if (active) {
        const identifier = findClosestParent(active);
        if (identifier) {
          const finder = findElementInJson(mjmlJson, identifier);
          if (finder) {
            setActive(null);
            let [, path]: [any, string] = finder;
            let parent: any = path.split('.');
            const last: string = parent.pop();
            parent = parent.join('.');
            let item = _.get(mjmlJson, parent.slice(1));
            const regExMatch = last.match(/\[(.*?)\]/);

            if (regExMatch) {
              const indexToRemove = parseInt(regExMatch[1]);
              let newChildren = [];
              for (var i = 0; item && item.children && i < item.children.length; i++) {
                if (i !== indexToRemove) {
                  newChildren.push(item.children[i]);
                }
              }
              item.children = newChildren;
            }

            const updated = _.set(mjmlJson, parent.slice(1), item);

            if (updated) {
              setDelActive(false);
              setMjmlJson({ ...updated });
            } else {
              console.info('unable to delete the item');
            }
          }
        }
      }
    },
    [active]
  );

  return (
    <>
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
