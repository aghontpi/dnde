import { SyntheticEvent } from 'react';
import { UiWrapper } from './UiWrapper';

export type DragEvent = SyntheticEvent & { dataTransfer: DataTransfer };

// prettier-ignore
const properties = ["container-background-color", "css-class", "height", "padding", "padding-bottom", "padding-left", "padding-right", "padding-top"]

// prettier-ignore
const properties_with_default_values = {"container-background-color": "", "css-class": "", "height": "20px", "padding": "none", "padding-bottom": "", "padding-left": "", "padding-right": "", "padding-top": ""}

// prettier-ignore
const assigned_default_values = {"height": "20px", "padding": "none"}

export const Spacer = () => {
  const config = {
    tagName: 'mj-spacer',
    attributes: {
      ...assigned_default_values,
      'css-class': 'mjml-tag identifier-mj-spacer',
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
      <UiWrapper background="spacer" label="Spacer" />
    </div>
  );
};
