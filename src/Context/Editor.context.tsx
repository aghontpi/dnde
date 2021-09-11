import _ from 'lodash';
import { createContext, FC, useEffect, useState } from 'react';

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
  const [attributes, setAttributes] = useState<any>({});
  const [active, setActive] = useState<any>({});
  const [mjmlstring, setMjmlString] = useState('');

  useEffect(() => {
    console.log('apth', active);
    if (active.change) {
      const original = mjmlJson;
      const changed = _.set(original, active.path.slice(1) + '.attributes', active.change);
      setMjmlString(JSON.stringify(changed, null, 2));
    }
  }, [active]);

  return (
    <EditorContext.Provider
      value={{
        mjmlJson: mjmlJson,
        setMjmlJson,
        attributes,
        setAttributes,
        active,
        setActive,
        mjmlstring: mjmlstring,
        setMjmlString,
      }}
    >
      {props.children}
    </EditorContext.Provider>
  );
};
