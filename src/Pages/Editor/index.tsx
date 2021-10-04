import { Editor } from './Editor';
import { DNDContext } from '../../Context/DragAndDrop.context';
import { EDContext } from '../../Context/Editor.context';
import { Ckeditor } from '../../Context/Ckeditor.context';
import { HtmlContextProvider } from '../../Context/Htmlwrapper.context';
import { QuillEditor } from '../../Context/Quill.context';
import { CustomEditorProvider } from '../../Context/CustomEditor.context';

const wrapContext = () => (
  <HtmlContextProvider>
    <CustomEditorProvider>
      <QuillEditor>
        <Ckeditor>
          <DNDContext>
            <EDContext>
              <Editor />
            </EDContext>
          </DNDContext>
        </Ckeditor>
      </QuillEditor>
    </CustomEditorProvider>
  </HtmlContextProvider>
);

export default wrapContext;
