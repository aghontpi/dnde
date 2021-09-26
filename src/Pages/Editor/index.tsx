import { Editor } from './Editor';
import { DNDContext } from '../../Context/DragAndDrop.context';
import { EDContext } from '../../Context/Editor.context';
import { Ckeditor } from '../../Context/Ckeditor.context';
import { HtmlContextProvider } from '../../Context/Htmlwrapper.context';
import { QuillEditor } from '../../Context/Quill.context';

const wrapContext = () => (
  <HtmlContextProvider>
    <QuillEditor>
      <Ckeditor>
        <DNDContext>
          <EDContext>
            <Editor />
          </EDContext>
        </DNDContext>
      </Ckeditor>
    </QuillEditor>
  </HtmlContextProvider>
);

export default wrapContext;
