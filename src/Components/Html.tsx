import { SyntheticEvent } from 'react';
import { useEditor } from '../Hooks/Editor.hook';
import { dragStart } from '../Utils/dragStart';
import { cleanMjmlJson } from '../Utils/mjmlProcessor';
import { UiWrapper } from './UiWrapper';

export type DragEvent = SyntheticEvent & { dataTransfer: DataTransfer };

export const Html = () => {
  const { mjmlJson, setMjmlJson } = useEditor();
  const config = {
    tagName: 'mj-text',
    attributes: {
      'css-class': 'mjml-tag identifier-mj-html html-block',
      padding: '0px',
    },
    mutableProperties: ['font-family'],
    content: `
    <table border="1" style="width:100%; border-collapse:collapse">
    <tr style="font-weight:bold">
      <td>S. No</td> 
      <td>Items</td>
      <td>Quantity</td>
      <td align="center">Price</td>
    </tr>
    <tr>
      <td>1</td>
      <td>egg</td>
      <td>24</td>
      <td align="center">$10.00</td>
    </tr>
    <tr>
      <td>2</td>
      <td>milk</td>
      <td>5</td>
      <td align="center">$8</td>
    </tr>
    <tr>
      <td>3</td>
      <td>curd</td>
      <td>8</td>
      <td align="center">$8</td>
    </tr>
    </table>
    `,
  };

  const onDragStart = (e: DragEvent) => {
    dragStart(e as any, config);
  };

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
