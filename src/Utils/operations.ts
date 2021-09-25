import _ from 'lodash';
import { error } from '../Components/Messages';
import { columnPlaceholder } from '../Components/Section';
import { findClosestParent, generateUiqueIdForColumns, replaceGeneicTagWithUniqueId } from './closestParent';
import { findElementInJson } from './findElementInMjmlJson';

interface AddProps {
  target: HTMLElement;
  droppedConfig: any;
  mjmlJson: any;
  setMjmlJson: any;
  uid: () => string;
}

const Add = ({ target, droppedConfig, setMjmlJson, mjmlJson, uid }: AddProps) => {
  const uniqueClassName = findClosestParent(target);
  console.info('uniqueClassNames', uniqueClassName);
  if (!uniqueClassName) {
    return null;
  }

  if (droppedConfig.tagName !== 'mj-section') {
    if (uniqueClassName === 'identifier-mj-body' || uniqueClassName === 'identifier-mj-section') {
      error('kindly place the item on column instead ');
      return null;
    }
  }

  // if tag name is mj-section, generate uniqueId for all mj-column tags
  if (droppedConfig.tagName === 'mj-section') {
    droppedConfig = generateUiqueIdForColumns(droppedConfig, uid);
  }

  const ObjectEquivalent = findElementInJson(mjmlJson, uniqueClassName);
  if (!ObjectEquivalent) {
    return null;
  }

  let droppedConfigWithUid = _.cloneDeep(droppedConfig);
  let classNameString = droppedConfigWithUid['attributes']['css-class'];
  if (classNameString) {
    classNameString = replaceGeneicTagWithUniqueId(classNameString, uid());
  }
  // set the classnames with uniqueId generated in classnames
  droppedConfigWithUid['attributes']['css-class'] = classNameString;
  console.info('dropped config recreated with uniqueId', droppedConfigWithUid);

  let [item, path] = ObjectEquivalent;
  console.info('item in Object:', item, 'path to Object:', path);
  // remove the empty placeholder if present
  item.children = item.children.filter((v: any) => {
    if (v && v['attributes'] && v['attributes']['css-class']) {
      return !v['attributes']['css-class'].includes('mj-placeholder');
    }
    return true;
  });
  item.children.push(droppedConfigWithUid);
  const updated = _.set(mjmlJson, path.slice(1), item);
  console.info('updated:', updated);
  setMjmlJson({ ...updated });
};

interface RemoveProps {
  target: HTMLElement;
  mjmlJson: any;
  setMjmlJson: any;
  setDelActive: any;
  setActive: any;
}

const Remove = ({ target, mjmlJson, setMjmlJson, setDelActive, setActive }: RemoveProps) => {
  const uniqueClassName = findClosestParent(target);
  if (!uniqueClassName) {
    return null;
  }

  const ObjectEquivalent = findElementInJson(mjmlJson, uniqueClassName);
  if (!ObjectEquivalent) {
    return null;
  }

  let [, path]: [any, string] = ObjectEquivalent;
  let parent: any = path.split('.');
  const last: string = parent.pop();
  parent = parent.join('.');
  let item = _.get(mjmlJson, parent.slice(1));
  const regExMatch = last.match(/\[(.*?)\]/);

  if (regExMatch) {
    const indexToRemove = parseInt(regExMatch[1]);
    let newChildren = [];
    for (var i = 0; item && item.children && i < item.children.length; i++) {
      if (i !== indexToRemove) {
        newChildren.push(item.children[i]);
      }
    }

    // if column is empty, fill it with placeholder
    if (parent) {
      const parentItem = _.get(mjmlJson, parent.slice(1));

      if (parentItem.tagName && parentItem.tagName === 'mj-column' && newChildren.length === 0) {
        newChildren = columnPlaceholder;
      }
    }

    item.children = newChildren;
  }

  setActive(null);
  const updated = _.set(mjmlJson, parent.slice(1), item);

  if (updated) {
    setDelActive(false);
    setMjmlJson({ ...updated });
  } else {
    console.info('unable to delete the item');
  }

  setMjmlJson({ ...updated });
};

export { Add, Remove };
