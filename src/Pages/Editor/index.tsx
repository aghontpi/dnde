import { Editor } from "./Editor";
import { DNDContext } from "../../Context/DragAndDrop.context";
import { EDContext } from "../../Context/Editor.context";
import { Ckeditor } from "../../Context/Ckeditor.context";

const wrapContext = () => (
  <Ckeditor>
    <DNDContext>
      <EDContext>
        <Editor />
      </EDContext>
    </DNDContext>
  </Ckeditor>
);

export default wrapContext;
