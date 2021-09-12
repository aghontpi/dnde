import { SyntheticEvent } from 'react';
import { UiWrapper } from './UiWrapper';

export type DragEvent = SyntheticEvent & { dataTransfer: DataTransfer };

// prettier-ignore
const properties = ['align', 'background-color', 'border', 'border-bottom', 'border-left', 'border-radius', 'border-right', 'border-top', 'color', 'container-background-color', 'css-class', 'font-family', 'font-size', 'font-style', 'font-weight', 'height', 'href', 'inner-padding', 'letter-spacing', 'line-height', 'padding', 'padding-bottom', 'padding-left', 'padding-right', 'padding-top', 'rel', 'target', 'text-align', 'text-decoration', 'text-transform', 'title', 'vertical-align', 'width'];

// prettier-ignore
const properties_with_default_values = {"align": "center", "alt": "", "border": "none", "border-top": "none", "border-bottom": "none", "border-left": "none", "border-right": "none", "border-radius": "", "container-background-color": "", "css-class": "", "fluid-on-mobile": "", "height": "auto", "href": "", "name": "", "padding": "10px 25px", "padding-bottom": "", "padding-left": "", "padding-right": "", "padding-top": "", "rel": "", "sizes": "", "src": "", "srcset": "", "target": "_blank", "title": "", "usemap": "", "width": "100%"};

// prettier-ignore
const assigned_default_values  = {"align": "center", "background-color": "#414141", "border": "none", "border-radius": "3px", "color": "#ffffff", "font-family": "Ubuntu, Helvetica, Arial, sans-serif", "font-size": "13px", "font-weight": "normal", "inner-padding": "10px 25px", "line-height": "120%", "padding": "10px 25px", "target": "_blank", "text-align": "none", "text-decoration": "none", "text-transform": "none", "vertical-align": "middle"}

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
    console.log(e);
  };
  // access type, etc from comp nd set to context

  return (
    <div onDragStart={onDragStart} draggable={true}>
      <UiWrapper background="image" label="Image" />
    </div>
  );
};
