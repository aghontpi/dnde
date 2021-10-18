import { message } from 'antd';
import { createContext, FC, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useLazyGetTemplateQuery } from '../Api/api';
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

const LOADING_KEY = 'loading';

export const EDContext: FC = (props) => {
  const { templateId }: { templateId: string | undefined } = useParams();
  const { getId } = useDragAndDropUniqueId();
  const [mjmlJson, setMjmlJson] = useState<any>(null);
  const [trigger, { data, isError, isLoading, isSuccess }] = useLazyGetTemplateQuery();

  useEffect(() => {
    if (templateId === 'new' || typeof templateId === 'undefined') {
      setMjmlJson(initialState);
    } else {
      if (templateId) {
        message.loading({ content: 'Fetching Template...', key: LOADING_KEY, duration: 0 });
        trigger({ id: templateId });
      }
    }
  }, []);

  useEffect(() => {
    if (isSuccess && data) {
      setMjmlJson(importJson(JSON.parse(data.response.data), getId));
    } else if (isSuccess && !data) {
      message.error('Template is empty', 2);
    }
    if (isSuccess || isError) {
      message.destroy(LOADING_KEY);
    }
  }, [isError, isLoading, isSuccess, data]);

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
