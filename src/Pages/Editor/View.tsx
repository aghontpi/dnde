import { useEditor } from '../../Hooks/Editor.hook';
import mjml2html from 'mjml-browser';
import css from './Editor.module.scss';
import Scrollbars from 'react-custom-scrollbars-2';
import { htmlProcessor } from '../../Utils/htmlProcessor';
import { Editor } from '../../Components/Mods/Editor';
import { Add } from '../../Utils/operations';
import { useDragAndDropUniqueId } from '../../Hooks/Drag.hook';
import '../../Assets/Css/ckeditorOverride.css';
import '../../Assets/Css/quillOverride.css';

interface ViewProps {}

export const View = (props: ViewProps) => {
  const { mjmlJson, setMjmlJson } = useEditor();
  const { getId } = useDragAndDropUniqueId();

  const onDrop = (e: any) => {
    e.preventDefault();
    const config = JSON.parse(e.dataTransfer.getData('config'));
    Add({
      target: e.nativeEvent.target,
      droppedConfig: config,
      mjmlJson,
      setMjmlJson,
      uid: getId,
    });
  };

  return (
    <Scrollbars style={{ height: '100%' }}>
      <Editor />
      <div
        className={`${css.viewHolder} mjml-wrapper mjml-tag identifier-mj-body`}
        onDrop={onDrop}
        onDragOver={onDragOver}
      >
        {htmlProcessor(mjml2html(mjmlJson).html)}
      </div>
    </Scrollbars>
  );
};

const onDragOver = (e: any) => {
  e.preventDefault();
};
