import { SyntheticEvent } from 'react';
import { UiWrapper } from './UiWrapper';

export type DragEvent = SyntheticEvent & { dataTransfer: DataTransfer };

// prettier-ignore
const properties = ["border-color", "border-style", "border-width", "container-background-color", "css-class", "padding", "padding-bottom", "padding-left", "padding-right", "padding-top", "width", "align"]

// prettier-ignore
const properties_with_default_values = {"border-color": "#000000", "border-style": "solid", "border-width": "4px", "container-background-color": "", "css-class": "", "padding": "10px 25px", "padding-bottom": "", "padding-left": "", "padding-right": "", "padding-top": "", "width": "100%", "align": "center"}

// prettier-ignore
const assigned_default_values = {"border-color": "#000000", "border-style": "solid", "border-width": "4px", "padding": "10px 25px", "width": "100%", "align": "center"}

export const Divider = () => {
  const config = {
    tagName: 'mj-divider',
    attributes: {
      ...assigned_default_values,
      'css-class': 'mjml-tag identifier-mj-divider',
    },
    children: [],
    mutableProperties: properties,
    mutalbePropertiesWithDefaultValues: properties_with_default_values,
  };

  const onDragStart = (e: DragEvent) => {
    e.dataTransfer.dropEffect = 'copy';
    e.dataTransfer.setData('config', JSON.stringify(config));
    console.log(e);
  };
  // access type, etc from comp nd set to context

  return (
    <div onDragStart={onDragStart} draggable={true}>
      <UiWrapper background="divider" label="Divider" />
    </div>
  );
};
