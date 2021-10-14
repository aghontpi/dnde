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
import { useCallback, useEffect, useState } from 'react';
import { UndoRedo } from '../../Components/UndoRedo';
import _ from 'lodash';

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
  const { setActive, active } = useHtmlWrapper();
  const { setDelActive, copy } = useCkeditor();
  const { setCopyActive } = copy;
  const [undoRedo, setUndoRedo] = useState<{ undo: any[]; redo: any[] }>({ undo: [], redo: [] });

  useEffect(() => {
    const undo_len = undoRedo.undo.length;
    const current = _.cloneDeep(mjmlJson);
    if (undo_len > 0) {
      const prev = undoRedo.undo[undo_len - 1];
      if (!_.isMatch(prev, current)) {
        setUndoRedo((prev) => {
          return {
            redo: [...prev.redo],
            undo: [...prev.undo, current],
          };
        });
      }
    } else if (undo_len === 0) {
      setUndoRedo((prev) => {
        return {
          redo: [...prev.redo],
          undo: [...prev.undo, current],
        };
      });
    }

    console.log('::updated mjmlJson::', mjmlJson, undoRedo);
  }, [mjmlJson]);

  const undoCallback = () => {
    let undo_len = undoRedo.undo.length;
    if (undo_len > 1) {
      const undo = _.cloneDeep(undoRedo.undo[undo_len - 2]);
      setUndoRedo((prev) => {
        return {
          undo: prev.undo.slice(0, -1),
          redo: [...prev.redo, undo],
        };
      });
      setMjmlJson({ ...undo });
    }
  };

  const onDragOver = useCallback(
    (e: any) => {
      if (active) {
        setActive(null);
      }
      e.preventDefault();
    },
    [setActive, active]
  );

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
      <UndoRedo undoCallback={undoCallback} redoCallback={() => alert('redo')} />
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
