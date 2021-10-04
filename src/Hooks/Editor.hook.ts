import _ from 'lodash';
import { useCallback, useContext, useEffect, useState } from 'react';
import { EditorContext } from '../Context/Editor.context';
import { findUniqueIdentifier } from '../Utils/closestParent';
import { findElementInJson } from '../Utils/findElementInMjmlJson';
import { useHtmlWrapper } from './Htmlwrapper.hook';

export const useEditor = () => {
  const context = useContext(EditorContext);
  return context as unknown as {
    mjmlJson: any;
    setMjmlJson: (v: any) => void;
    attributes: any;
    setAttributes: (v: any) => void;
  };
};

export const useEditorUpdater = () => {
  const { active: activeElement } = useHtmlWrapper();
  const { setMjmlJson, mjmlJson } = useEditor();
  const [item, setItem] = useState<any>(null);
  const [path, setPath] = useState<any>(null);

  useEffect(() => {
    console.log('ae', activeElement, mjmlJson);
    if (activeElement && mjmlJson) {
      const uniqueIdentifer = findUniqueIdentifier(activeElement as HTMLElement, activeElement.classList);
      if (uniqueIdentifer) {
        const [, _path] = findElementInJson(mjmlJson, uniqueIdentifer);
        setPath(_path);
        const _item = _.get(mjmlJson, _path.slice(1));
        console.log('ae', _item);
        if (_item) {
          setItem(_item);
        }
      }
    }
  }, [mjmlJson, activeElement]);

  const update = useCallback(
    (updatedValue: any) => {
      if (path) {
        const updated = _.set(mjmlJson, path.slice(1), updatedValue);
        if (updated) {
          setMjmlJson({ ...updated });
        }
      }
    },
    [path]
  );

  return [item, update];
};
