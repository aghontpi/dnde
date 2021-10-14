import { SyntheticEvent } from 'react';
import { useEditor } from '../Hooks/Editor.hook';
import { dragStart } from '../Utils/dragStart';
import { cleanMjmlJson } from '../Utils/mjmlProcessor';
import { UiWrapper } from './UiWrapper';

export type DragEvent = SyntheticEvent & { dataTransfer: DataTransfer };

export const Html = () => {
  const { mjmlJson, setMjmlJson } = useEditor();
  const config = {
    tagName: 'mj-raw',
    attributes: {
      'css-class': 'mjml-tag identifier-mj-raw',
      height: '100px',
      width: '100px',
    },
    children: [],
    content: `<table>
    <tr>
      <td>heading 1</td> 
      <td>heading 2</td>
    </tr>
    <tr>
      <td>data one</td>
      <td>data two</td>
    </tr>
    <tr>
      <td>an one</td>
      <td>an two</td>
    </tr>
    </table>`,
  };

  const onDragStart = (e: DragEvent) => {
    dragStart(e as any, config);
  };
  // access type, etc from comp nd set to context

  const onDragEnd = (e: DragEvent) => {
    const cleaned = cleanMjmlJson(mjmlJson);
    setMjmlJson({ ...cleaned });
  };

  return (
    <div onDragEnd={onDragEnd} onDragStart={onDragStart} draggable={true}>
      <UiWrapper background="html" label=" Html" />
    </div>
  );
};
