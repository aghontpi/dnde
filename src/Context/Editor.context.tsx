import _ from 'lodash';
import { createContext, FC, useState } from 'react';
import { FONTS_CONFIG } from '../Components/Mods/FontConfig';
import { HEADSTYLE } from '../Components/Mods/HeadStyle';

export const EditorContext = createContext<any>(null);

export const PageHeaderItems = [
  { tagName: 'mj-title', content: 'dnde-editor' },
  { tagName: 'mj-style', content: HEADSTYLE },
  { tagName: 'mj-attributes', children: [{ tagName: 'mj-text', attributes: { 'font-family': 'Ubuntu' } }] },
  ...FONTS_CONFIG.map((font) => {
    return {
      tagName: 'mj-font',
      attributes: {
        name: font.name,
        href: font.value,
      },
    };
  }),
];

const initialState = {
  tagName: 'mjml',
  children: [
    {
      tagName: 'mj-head',
      attributes: {},
      children: [...PageHeaderItems],
    },
    {
      tagName: 'mj-body',
      attributes: { 'css-class': 'mjml-tag body identifier-mj-body', 'background-color': 'grey', width: '600px' },
      children: [],
      mutableProperties: ['width', 'background-color'],
    },
  ],
  attributes: {},
};

export const EDContext: FC = (props) => {
  const [mjmlJson, setMjmlJson] = useState<any>(_.cloneDeep(initialState));

  const [attributes, setAttributes] = useState<any>({});

  return (
    <EditorContext.Provider
      value={{
        mjmlJson: mjmlJson,
        setMjmlJson,
        attributes,
        setAttributes,
      }}
    >
      {props.children}
    </EditorContext.Provider>
  );
};

export { initialState as EMPTY_EDITOR_STATE };
