import { useEffect } from 'react';
import { useEditor } from '../../Hooks/Editor.hook';
import mjml2html from 'mjml-browser';
import css from './Editor.module.scss';
import Scrollbars from 'react-custom-scrollbars-2';
import { htmlProcessor } from '../../Utils/htmlProcessor';
import { Editor } from '../../Components/Mods/Editor';
import { Add } from '../../Utils/operations';

interface ViewProps {}

export const View = (props: ViewProps) => {
  const { mjmlJson, mjmlstring, setActive, setMjmlString, setMjmlJson, setAttributes } = useEditor();

  useEffect(() => {
    setMjmlString(JSON.stringify(mjmlJson, null, 2));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDrop = (e: any) => {
    e.preventDefault();
    const config = JSON.parse(e.dataTransfer.getData('config'));
    Add({
      target: e.nativeEvent.target,
      setActive,
      droppedConfig: config,
      mjmlJson,
      setMjmlJson,
      setMjmlString,
      setAttributes,
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
        {mjmlstring && htmlProcessor(mjml2html(mjmlJson, { minify: true }).html)}
      </div>
    </Scrollbars>
  );
};

const onDragOver = (e: any) => {
  e.preventDefault();
};
