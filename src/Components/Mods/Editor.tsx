import DeleteOutlined from '@ant-design/icons/lib/icons/DeleteOutlined';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { Button, Popconfirm } from 'antd';
import ED from 'ckeditor5-custom-build/build/ckeditor';
import { useEffect } from 'react';
import { useCkeditor } from '../../Hooks/Ckeditor.hook';

export const Editor = () => {
  const { ref, isActive, x, y, delActive, delX, delY } = useCkeditor();
  useEffect(() => {
    if (ref) {
      console.log(ref, ref.current);
    }
  }, [ref]);

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
      />
    </>
  );
};

interface DeleteProps {
  style: any;
}

const Delete = ({ style }: DeleteProps) => {
  return (
    <Popconfirm placement="right" title="Are you sure ?" okText="Delete" cancelText="Cancel">
      <Button style={style} type="primary" icon={<DeleteOutlined />} />
    </Popconfirm>
  );
};
