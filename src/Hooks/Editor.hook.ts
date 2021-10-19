import _ from 'lodash';
import { useCallback, useContext, useEffect, useState } from 'react';
import { EditorContext } from '../Context/Editor.context';
import { findUniqueIdentifier } from '../Utils/closestParent';
import { findElementInJson } from '../Utils/findElementInMjmlJson';
import { logger } from '../Utils/logger';
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
    logger.log('editor value updater: ae->', activeElement);
    if (activeElement && mjmlJson) {
      const uniqueIdentifer = findUniqueIdentifier(activeElement as HTMLElement, activeElement.classList);
      if (uniqueIdentifer) {
        const find = findElementInJson(mjmlJson, uniqueIdentifer);
        if (find) {
          const [, _path] = find;
          setPath(_path);
          const _item = _.get(mjmlJson, _path.slice(1));
          if (_item) {
            setItem(_item);
          }
        } else {
          logger.log(`editor value updater: unable to find item in json, ${find}, identifier: ${uniqueIdentifer}`);
        }
      }
    }
  }, [activeElement]);

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
