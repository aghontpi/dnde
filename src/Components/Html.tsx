import { SyntheticEvent } from 'react';
import { UiWrapper } from './UiWrapper';

export type DragEvent = SyntheticEvent & { dataTransfer: DataTransfer };

export const Html = () => {
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
    e.dataTransfer.dropEffect = 'copy';
    e.dataTransfer.setData('config', JSON.stringify(config));
    console.log(e);
  };
  // access type, etc from comp nd set to context

  return (
    <div onDragStart={onDragStart} draggable={true}>
      <UiWrapper background="html" label=" Html" />
    </div>
  );
};
