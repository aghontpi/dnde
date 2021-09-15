import { CKEditor } from '@ckeditor/ckeditor5-react';
import ED from 'ckeditor5-custom-build/build/ckeditor';
import { useEffect } from 'react';
import { useCkeditor } from '../../Hooks/Ckeditor.hook';

export const Editor = () => {
  const { ref, isActive, x, y } = useCkeditor();
  useEffect(() => {
    if (ref) {
      console.log(ref, ref.current);
    }
  }, [ref]);

  return (
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
  );
};
