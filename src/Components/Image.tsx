import { SyntheticEvent } from 'react';
import { UiWrapper } from './UiWrapper';

export type DragEvent = SyntheticEvent & { dataTransfer: DataTransfer };

// prettier-ignore
const properties = ["align", "alt", "border", "border-top", "border-bottom", "border-left", "border-right", "border-radius", "container-background-color", "css-class", "fluid-on-mobile", "height", "href", "name", "padding", "padding-bottom", "padding-left", "padding-right", "padding-top", "rel", "sizes", "src", "srcset", "target", "title", "usemap", "width"]

// prettier-ignore
const properties_with_default_values = {"align": "center", "alt": "", "border": "none", "border-top": "none", "border-bottom": "none", "border-left": "none", "border-right": "none", "border-radius": "", "container-background-color": "", "css-class": "", "fluid-on-mobile": "", "height": "auto", "href": "", "name": "", "padding": "10px 25px", "padding-bottom": "", "padding-left": "", "padding-right": "", "padding-top": "", "rel": "", "sizes": "", "src": "", "srcset": "", "target": "_blank", "title": "", "usemap": "", "width": "100%"}

// prettier-ignore
const assigned_default_values = {"align": "center", "border": "none", "border-top": "none", "border-bottom": "none", "border-left": "none", "border-right": "none", "height": "auto", "padding": "10px 25px", "target": "_blank", "width": "100%"}

export const Image = () => {
  const config = {
    tagName: 'mj-image',
    attributes: {
      ...assigned_default_values,
      'css-class': 'mjml-tag identifier-mj-image',
      src: 'https://dev.bluepie.in/dnde.png',
    },
    children: [],
    mutableProperties: properties,
    mutalbePropertiesWithDefaultValues: properties_with_default_values,
  };

  const onDragStart = (e: DragEvent) => {
    e.dataTransfer.dropEffect = 'copy';
    e.dataTransfer.setData('config', JSON.stringify(config));
  };
  // access type, etc from comp nd set to context

  return (
    <div onDragStart={onDragStart} draggable={true}>
      <UiWrapper background="image" label="Image" />
    </div>
  );
};
