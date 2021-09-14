import { Editor } from './Editor';
import { DNDContext } from '../../Context/DragAndDrop.context';
import { EDContext } from '../../Context/Editor.context';
import { Ckeditor } from '../../Context/Ckeditor.context';
import { HtmlContextProvider } from '../../Context/Htmlwrapper.context';

const wrapContext = () => (
  <HtmlContextProvider>
    <Ckeditor>
      <DNDContext>
        <EDContext>
          <Editor />
        </EDContext>
      </DNDContext>
    </Ckeditor>
  </HtmlContextProvider>
);

export default wrapContext;
