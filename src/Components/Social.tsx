import { dragStart } from '../Utils/dragStart';
import { UiWrapper } from './UiWrapper';

// prettier-ignore
const social_properties = ["align", "border-radius", "color", "css-class", "container-background-color", "font-family", "font-size", "font-style", "font-weight", "icon-height", "icon-size", "inner-padding", "line-height", "mode", "padding", "padding-bottom", "padding-left", "padding-right", "padding-top", "icon-padding", "text-padding", "text-decoration"]

// prettier-ignore
const social_properties_with_default_values = {"align": "center", "border-radius": "3px", "color": "#333333", "css-class": "", "container-background-color": "", "font-family": "Ubuntu, Helvetica, Arial, sans-serif", "font-size": "13px", "font-style": "normal", "font-weight": "normal", "icon-height": "icon-size", "icon-size": "20px", "inner-padding": "4px", "line-height": "22px", "mode": "horizontal", "padding": "10px 25px", "padding-bottom": "", "padding-left": "", "padding-right": "", "padding-top": "", "icon-padding": "0px", "text-padding": "4px 4px 4px 0", "text-decoration": "none"}

// prettier-ignore
const social_assigned_default_values = {"align": "center", "border-radius": "3px", "color": "#333333", "font-family": "Ubuntu, Helvetica, Arial, sans-serif", "font-size": "13px", "font-style": "normal", "font-weight": "normal", "icon-height": "icon-size", "icon-size": "20px", "inner-padding": "4px", "line-height": "22px", "mode": "horizontal", "padding": "10px 25px", "icon-padding": "0px", "text-padding": "4px 4px 4px 0", "text-decoration": "none"}

// prettier-ignore
const social_element_properties = ["align", "alt", "background-color", "border-radius", "color", "css-class", "font-family", "font-size", "font-style", "font-weight", "href", "icon-height", "icon-size", "line-height", "name", "padding", "padding-bottom", "padding-left", "padding-right", "padding-top", "icon-padding", "text-padding", "sizes", "src", "srcset", "rel", "target", "title", "text-decoration", "vertical-align"]

// prettier-ignore
const social_element_properties_with_default_values = {"align": "center", "alt": "none", "background-color": "Each social name has its own default", "border-radius": "3px", "color": "#333333", "css-class": "", "font-family": "Ubuntu, Helvetica, Arial, sans-serif", "font-size": "13px", "font-style": "normal", "font-weight": "normal", "href": "none", "icon-height": "icon-size", "icon-size": "20px", "line-height": "22px", "name": "N/A", "padding": "4px", "padding-bottom": "", "padding-left": "", "padding-right": "", "padding-top": "", "icon-padding": "0px", "text-padding": "4px 4px 4px 0", "sizes": "", "src": "Each social name has its own default", "srcset": "", "rel": "", "target": "_blank", "title": "none", "text-decoration": "none", "vertical-align": "middle"}

// prettier-ignore
const social_element_assigned_default_values = {"align": "center", "alt": "none", "background-color": "Each social name has its own default", "border-radius": "3px", "color": "#333333", "font-family": "Ubuntu, Helvetica, Arial, sans-serif", "font-size": "13px", "font-style": "normal", "font-weight": "normal", "href": "none", "icon-height": "icon-size", "icon-size": "20px", "line-height": "22px", "name": "N/A", "padding": "4px", "icon-padding": "0px", "text-padding": "4px 4px 4px 0", "src": "Each social name has its own default", "target": "_blank", "title": "none", "text-decoration": "none", "vertical-align": "middle"}

const social_element_config = {
  tagName: 'mj-social-element',
  attributes: {
    'css-class': 'mjml-tag identifier-mj-social-element',
  },
  mutableProperties: social_element_properties,
};

export const Social = () => {
  const config = {
    tagName: 'mj-social',
    attributes: {
      'css-class': 'mjml-tag identifier-mj-social',
    },
    children: [
      {
        ...social_element_config,
        attributes: {
          ...social_element_config.attributes,
          name: 'facebook-noshare',
          href: 'https://github.com/aghontpi',
          src: 'https://dev.bluepie.in/assets/facebook.png',
        },
      },

      {
        ...social_element_config,
        attributes: {
          ...social_element_config.attributes,
          name: 'twitter-noshare',
          href: 'https://twitter.com/aghontpi',
          src: 'https://dev.bluepie.in/assets/twitter.png',
        },
      },

      {
        ...social_element_config,
        attributes: {
          ...social_element_config.attributes,
          name: 'youtube-noshare',
          href: 'https://github.com/aghontpi',
          src: 'https://dev.bluepie.in/assets/youtube.png',
        },
      },

      {
        ...social_element_config,
        attributes: {
          ...social_element_config.attributes,
          name: 'github',
          href: 'https://github.com/aghontpi',
          src: 'https://dev.bluepie.in/assets/github.png',
        },
      },
    ],
    mutableProperties: social_properties,
  };

  const onDragStart = (e: any) => {
    dragStart(e, config);
  };

  return (
    <div onDragStart={onDragStart} draggable={true}>
      <UiWrapper background="social" label="Social" />
    </div>
  );
};
