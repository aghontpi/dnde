import { SyntheticEvent } from 'react';
import { useEditor } from '../Hooks/Editor.hook';
import { dragStart } from '../Utils/dragStart';
import { cleanMjmlJson } from '../Utils/mjmlProcessor';
import { UiWrapper } from './UiWrapper';

export type DragEvent = SyntheticEvent & { dataTransfer: DataTransfer };

// prettier-ignore
const properties = ['align', 'background-color', 'border', 'border-bottom', 'border-left', 'border-radius', 'border-right', 'border-top', 'color', 'container-background-color', 'css-class', 'font-family', 'font-size', 'font-style', 'font-weight', 'height', 'href', 'inner-padding', 'letter-spacing', 'line-height', 'padding', 'padding-bottom', 'padding-left', 'padding-right', 'padding-top', 'rel', 'target', 'text-align', 'text-decoration', 'text-transform', 'title', 'vertical-align', 'width'];

// prettier-ignore
const properties_with_default_values = {"align": "center", "background-color": "#414141", "border": "none", "border-bottom": "", "border-left": "", "border-radius": "3px", "border-right": "", "border-top": "", "color": "#ffffff", "container-background-color": "", "css-class": "", "font-family": "Ubuntu, Helvetica, Arial, sans-serif", "font-size": "13px", "font-style": "", "font-weight": "normal", "height": "", "href": "", "inner-padding": "10px 25px", "letter-spacing": "", "line-height": "120%", "padding": "10px 25px", "padding-bottom": "", "padding-left": "", "padding-right": "", "padding-top": "", "rel": "", "target": "_blank", "text-align": "none", "text-decoration": "none", "text-transform": "none", "title": "", "vertical-align": "middle", "width": ""}

// prettier-ignore
const assigned_default_values  = {"align": "center", "background-color": "#414141", "border": "none", "border-radius": "3px", "color": "#ffffff", "font-family": "Ubuntu, Helvetica, Arial, sans-serif", "font-size": "13px", "font-weight": "normal", "inner-padding": "10px 25px", "line-height": "120%", "padding": "10px 25px", "target": "_blank", "text-align": "none", "text-decoration": "none", "text-transform": "none", "vertical-align": "middle"}

export const Button = () => {
  const { mjmlJson, setMjmlJson } = useEditor();

  const config = {
    tagName: 'mj-button',
    attributes: {
      ...assigned_default_values,
      'css-class': 'mjml-tag identifier-mj-button',
    },
    children: [],
    content: 'button',
    mutableProperties: properties,
    mutalbePropertiesWithDefaultValues: properties_with_default_values,
  };

  const onDragStart = (e: any) => {
    dragStart(e, config);
  };

  const onDragEnd = (e: DragEvent) => {
    const cleaned = cleanMjmlJson(mjmlJson);
    setMjmlJson({ ...cleaned });
  };

  return (
    <div onDragEnd={onDragEnd} onDragStart={onDragStart} draggable={true}>
      <UiWrapper background="button" label="Button" />
    </div>
  );
};
