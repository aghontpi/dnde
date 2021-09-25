import { createContext, FC, useState } from 'react';

export const EditorContext = createContext<any>(null);

export const EDContext: FC = (props) => {
  const [mjmlJson, setMjmlJson] = useState<any>({
    tagName: 'mjml',
    children: [
      {
        tagName: 'mj-body',
        attributes: { 'css-class': 'mjml-tag identifier-mj-body', 'background-color': 'grey', width: '600px' },
        children: [],
      },
    ],
    attributes: {},
  });
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
