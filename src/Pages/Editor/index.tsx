import { Editor } from './Editor';
import { DNDContext } from '../../Context/DragAndDrop.context';
import { EDContext } from '../../Context/Editor.context';

const wrapContext = () => (
  <DNDContext>
    <EDContext>
      <Editor />
    </EDContext>
  </DNDContext>
);

export default wrapContext;
