import _ from 'lodash';
import { memo, useEffect, useMemo, useState } from 'react';
import { findUniqueIdentifier } from '../Utils/closestParent';
import { findElementInJson } from '../Utils/findElementInMjmlJson';
import { useEditor } from './Editor.hook';
import { useHtmlWrapper } from './Htmlwrapper.hook';

const useVisibility = (): [boolean | null, string] => {
  const [visible, setVisible] = useState<boolean | null>(null);

  const { active } = useHtmlWrapper();

  const [path, setPath] = useState('');

  const { mjmlJson } = useEditor();

  const { getValue } = useValue({ path, visible });

  useEffect(() => {
    if (active) {
      const uniqueIdentifier = findUniqueIdentifier(active, active.classList);
      if (uniqueIdentifier) {
        let path = findElementInJson(mjmlJson, uniqueIdentifier);
        if (path) {
          const [, pathToElement] = path;
          if (pathToElement.length > 0) {
            setPath(pathToElement.slice(1));
          }
          const item = _.get(mjmlJson, pathToElement.slice(1));
          if (item.mutableProperties && item.mutableProperties.includes('padding')) {
            setVisible(true);
            return;
          }
        }
      }
    }
    setVisible(false);
  }, [active, mjmlJson]);

  return [visible, path];
};

interface useValueProps {
  path: string;
  visible: boolean | null;
}

const useValue = ({ path, visible }: useValueProps) => {
  const { mjmlJson } = useEditor();
  const getValue = useMemo(() => {
    let value = '';
    if (path && visible) {
      let element = _.get(mjmlJson, path);
      if (element && element.attributes) {
        value = element.attributes['src'];
      }
    }
    return value;
  }, [path, visible, mjmlJson]);

  return { getValue };
};

export { useVisibility, useValue };
