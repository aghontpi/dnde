import { createContext, FC, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { FONTS_CONFIG } from '../Components/Mods/FontConfig';
import { HEADSTYLE } from '../Components/Mods/HeadStyle';
import { shopify } from '../exportJsonExamples/shopify';
import { useDragAndDropUniqueId } from '../Hooks/Drag.hook';
import { importJson } from '../Utils/mjmlProcessor';

export const EditorContext = createContext<any>(null);

const initialState = {
  tagName: 'mjml',
  children: [
    {
      tagName: 'mj-head',
      attributes: {},
      children: [
        { tagName: 'mj-title', attributes: {}, children: [] },
        { tagName: 'mj-style', content: HEADSTYLE },
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
  const { templateId }: { templateId: string | undefined } = useParams();
  const { getId } = useDragAndDropUniqueId();
  const [mjmlJson, setMjmlJson] = useState<any>(null);

  useEffect(() => {
    if (templateId === 'new' || typeof templateId === 'undefined') {
      // setMjmlJson(initialState);

      setMjmlJson(importJson(JSON.parse(shopify), getId));
    } else {
      // initiate api and fetch the template id
      // const parsedJson = JSON.parse(
      //   //json
      // );
    }
  }, []);

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
