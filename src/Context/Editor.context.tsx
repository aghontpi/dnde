import { createContext, FC, useState } from 'react';
import { FONTS_CONFIG } from '../Components/Mods/FontConfig';

export const EditorContext = createContext<any>(null);

const initialState = {
  tagName: 'mjml',
  children: [
    {
      tagName: 'mj-head',
      attributes: {},
      children: [
        { tagName: 'mj-title', attributes: {}, children: [] },
        ...FONTS_CONFIG.map((font) => {
          return {
            tagName: 'mj-font',
            attributes: {
              name: font.name,
              href: font.value,
            },
          };
        }),
      ],
    },
    {
      tagName: 'mj-body',
      attributes: { 'css-class': 'mjml-tag identifier-mj-body', 'background-color': 'grey', width: '600px' },
      children: [],
    },
  ],
  attributes: {},
};

export const EDContext: FC = (props) => {
  const [mjmlJson, setMjmlJson] = useState<any>(initialState);
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
