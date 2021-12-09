import { Editor } from './Editor';
import { DNDContext } from '../../Context/DragAndDrop.context';
import { EDContext } from '../../Context/Editor.context';
import { Ckeditor } from '../../Context/Ckeditor.context';
import { HtmlContextProvider } from '../../Context/Htmlwrapper.context';
import { CustomEditorProvider } from '../../Context/CustomEditor.context';
import { forwardRef } from 'react';

const wrapContext = forwardRef((props, ref) => (
  <HtmlContextProvider>
    <CustomEditorProvider>
      <Ckeditor>
        <DNDContext>
          <EDContext>
            <Editor ref={ref} />
          </EDContext>
        </DNDContext>
      </Ckeditor>
    </CustomEditorProvider>
  </HtmlContextProvider>
));

export default wrapContext;
