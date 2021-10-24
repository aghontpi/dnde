import _ from 'lodash';
import { useEffect, useState } from 'react';
import { BODY_PATH } from '../Components/BodyAttributes';
import { findUniqueIdentifier } from '../Utils/closestParent';
import { findElementInJson } from '../Utils/findElementInMjmlJson';
import { useEditor } from './Editor.hook';
import { useHtmlWrapper } from './Htmlwrapper.hook';

interface useVisibilityProps {
  attribute?: string;
  property?: string;
  customPath?: string;
}

const useVisibility = ({ attribute, property, customPath }: useVisibilityProps): [boolean | null, string, any] => {
  const [visible, setVisible] = useState<boolean | null>(false);

  const { active } = useHtmlWrapper();

  const [path, setPath] = useState('');

  const { mjmlJson } = useEditor();

  useEffect(() => {
    // if its body, no need to tranverse, as soon as the state'mjmlJson' is available,
    //   it can be show to the ui
    // possible optimization: body properties are being on every active item click.
    //  write seperate Mods for body ex: instead of using common width, create width uniquely for body
    if (mjmlJson && customPath && customPath === BODY_PATH) {
      setVisible(true);
      setPath(BODY_PATH);
      return;
    }

    if (active) {
      const uniqueIdentifier = findUniqueIdentifier(active, active.classList);
      if (uniqueIdentifier) {
        let path = findElementInJson(mjmlJson, uniqueIdentifier);

        if (customPath) {
          path = [null, '.' + customPath];
        }

        if (path) {
          const [, pathToElement] = path;
          if (pathToElement.length > 0) {
            setPath(pathToElement.slice(1));
          }
          if (attribute) {
            const item = _.get(mjmlJson, pathToElement.slice(1));
            if (item && item.mutableProperties && item.mutableProperties.includes(attribute)) {
              setVisible(true);
              return;
            }
          } else if (property) {
            const item = _.get(mjmlJson, pathToElement.slice(1));
            if (item && item[property]) {
              setVisible(true);
              return;
            }
          }
        }
      }
    }
    setVisible(false);
    setPath('');
  }, [active]);

  return [visible, path, active];
};

interface useValueProps {
  path: string;
  visible: boolean | null;
  attribute: string;
}

const useValue = ({ path, visible, attribute }: useValueProps) => {
  const { mjmlJson } = useEditor();
  // todo: optimize this
  const getValue = () => {
    let value = '';
    if (path && visible) {
      let element = _.get(mjmlJson, path);
      if (element && element.attributes) {
        value = element.attributes[attribute];
      }
    }
    return value;
  };

  return { getValue };
};

export { useVisibility, useValue };
