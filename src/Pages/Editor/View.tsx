import { useEditor } from '../../Hooks/Editor.hook';
import mjml2html from 'mjml-browser';
import css from './Editor.module.scss';
import Scrollbars from 'react-custom-scrollbars-2';
import { htmlProcessor } from '../../Utils/htmlProcessor';
import { Editor } from '../../Components/Mods/Editor';
import { Add, Remove } from '../../Utils/operations';
import { useDragAndDropUniqueId } from '../../Hooks/Drag.hook';
import '../../Assets/Css/ckeditorOverride.css';
import '../../Assets/Css/quillOverride.css';
import { InlineEditor } from '../../Components/Mods/CustomInlineEditor';
import styled from 'styled-components';
import { useHtmlWrapper } from '../../Hooks/Htmlwrapper.hook';
import { useCkeditor } from '../../Hooks/Ckeditor.hook';

interface ViewProps {}

const DesignContainer = styled('div')`
  .editor-active {
    :focus {
      outline: none;
    }
  }
`;

export const View = (props: ViewProps) => {
  const { mjmlJson, setMjmlJson } = useEditor();
  const { getId } = useDragAndDropUniqueId();
  const { setActive } = useHtmlWrapper();
  const { setDelActive, copy } = useCkeditor();
  const { setCopyActive } = copy;

  const onDrop = (e: any) => {
    e.preventDefault();
    let config = JSON.parse(e.dataTransfer.getData('config'));
    if (config && config.mode && config.mode === 'move' && config['config']) {
      // remove the item old position, before inserting in new position
      Remove({
        uniqueClassName: config.uniqueClassName,
        mjmlJson,
        setMjmlJson,
        setActive,
        setDelActive,
        setCopyActive,
      });
      console.info(`operation move: onDrop -> removed previous instance 
      of config :'${config.uniqueClassName}'`);
      config = config['config'];
    }

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
      <InlineEditor />
      <DesignContainer
        className={`${css.viewHolder} mjml-wrapper mjml-tag identifier-mj-body`}
        onDrop={onDrop}
        onDragOver={onDragOver}
      >
        {htmlProcessor(mjml2html(mjmlJson).html)}
      </DesignContainer>
    </Scrollbars>
  );
};

const onDragOver = (e: any) => {
  e.preventDefault();
};
