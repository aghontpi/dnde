import _ from 'lodash';
import { error } from '../Components/Messages';
import { findClosestParent } from './closestParent';
import { findElementInJson } from './findElementInMjmlJson';

interface AddProps {
  target: HTMLElement;
  droppedConfig: any;
  mjmlJson: any;
  setMjmlJson: any;
  setMjmlString: any;
  setAttributes: any;
  setActive: any;
}

const Add = ({ target, droppedConfig, setMjmlJson, mjmlJson, setMjmlString, setAttributes, setActive }: AddProps) => {
  const uniqueClassName = findClosestParent(target);
  console.info('uniqueClassNames', uniqueClassName);
  if (!uniqueClassName) {
    return null;
  }

  if (droppedConfig.tagName !== 'mj-column' && droppedConfig.tagName !== 'mj-section') {
    if (uniqueClassName === 'identifier-mj-body' || uniqueClassName === 'identifier-mj-section') {
      error('kindly place the item on column instead ');
      return null;
    }
  }

  const ObjectEquivalent = findElementInJson(mjmlJson, uniqueClassName);
  if (!ObjectEquivalent) {
    return null;
  }

  let [item, path] = ObjectEquivalent;
  console.info('item in Object:', item, 'path to Object:', path);
  item.children.push(droppedConfig);
  setActive({ value: item, path: path + `.children[${item.children.length - 1}]` });
  const updated = _.set(mjmlJson, path.slice(1), item);
  console.info('updated:', updated);
  setMjmlJson((prev: any) => updated);
  setMjmlString(JSON.stringify(updated, null, 2));
  setAttributes(droppedConfig.mutableProperiesWithDefaultValues);
};

export { Add };
