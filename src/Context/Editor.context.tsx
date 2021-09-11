import { createContext, FC, useState } from 'react';

export const EditorContext = createContext<any>(null);

export const EDContext: FC = (props) => {
  const [mjmlJson, setMjmlJson] = useState<any>({
    tagName: 'mjml',
    children: [
      {
        tagName: 'mj-body',
        attributes: { 'css-class': 'mjml-tag identifier-mj-body', 'background-color': 'blue', width: '500px' },
        children: [
          {
            tagName: 'mj-section',
            attributes: { 'css-class': 'mjml-tag identifier-mj-section', 'background-color': 'red' },
            children: [],
          },
        ],
      },
    ],
    attributes: {},
  });
  return <EditorContext.Provider value={{ mjmlJson: mjmlJson, setMjmlJson }}>{props.children}</EditorContext.Provider>;
};
