import { CKEditor } from '@ckeditor/ckeditor5-react';
import ED from 'ckeditor5-custom-build/build/ckeditor';

export const Editor = () => {
  return (
    <>
      <CKEditor
        editor={ED}
        config={{
          toolbar: [
            'heading',
            '|',
            'bold',
            'italic',
            'link',
            'bulletedList',
            'numberedList',
            '|',
            'undo',
            'redo',
            'insertTable',
          ],
        }}
        data="<p>Hello from CKEditor 5!</p>"
        onReady={(editor) => {
          console.log('Change the Text here', editor);
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
    </>
  );
};
