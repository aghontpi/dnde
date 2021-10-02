import _ from 'lodash';
import { error } from '../Components/Messages';
import { columnPlaceholder } from '../Components/Section';
import {
  findClosestParent,
  findUniqueIdentifier,
  generateUiqueIdForColumns,
  getIndexOfElementInColumn,
  replaceGeneicTagWithUniqueId,
} from './closestParent';
import { findElementInJson } from './findElementInMjmlJson';
import { findColumnOfElement } from './findElementsColumn';
import { cleanMjmlJson } from './mjmlProcessor';

interface AddProps {
  target: HTMLElement | null;
  droppedConfig: any;
  mjmlJson: any;
  setMjmlJson: any;
  uid: () => string;
  insert?: {
    ParentUniqueClassIdentifier: string;
    index: number;
  };
}

const Add = ({ target, droppedConfig, setMjmlJson, mjmlJson, uid, insert }: AddProps) => {
  let uniqueClassName = null;
  if (target) {
    uniqueClassName = findClosestParent(target);
  } else if (insert) {
    uniqueClassName = insert.ParentUniqueClassIdentifier;
  }

  if (!uniqueClassName) {
    const cleanedMjmlJson = cleanMjmlJson(mjmlJson);
    setMjmlJson({ ...cleanedMjmlJson });
    return null;
  }

  if (droppedConfig.tagName !== 'mj-section') {
    if (uniqueClassName === 'identifier-mj-body' || uniqueClassName === 'identifier-mj-section') {
      // if the action performed is clone, allow it to be performed,
      //   since only body can not be cloned
      if (!insert && droppedConfig.tagName !== 'mj-body') {
        const cleanedMjmlJson = cleanMjmlJson(mjmlJson);
        setMjmlJson({ ...cleanedMjmlJson });
        error('kindly place the item on column instead ');
        return null;
      }
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

  // remove the empty placeholder-banner if present
  if (item.children) {
    item.children = item.children.filter((v: any) => {
      if (v && v['attributes'] && v['attributes']['css-class']) {
        return !v['attributes']['css-class'].includes('mj-placeholder');
      }
      return true;
    });
  }

  // insert the dropped config at the specified location
  if (insert && insert.index > -1) {
    for (var i = 0; item && item.children && i < item.children.length; i++) {
      if (i === insert.index) {
        item.children.splice(i, 0, droppedConfigWithUid);
      }
    }
  }
  // place the dropped config in the placeholder position, this only is needed for
  //   items, which has children
  else if (item.tagName !== 'mj-body' && item.children.length) {
    for (var i = 0; i < item.children.length; i++) {
      const child = item.children[i];
      const cssClass = child.attributes['css-class'];
      if (cssClass && cssClass.includes('placeitem-placeholder')) {
        item.children[i] = droppedConfigWithUid;
        continue;
      }
      item.children[i] = child;
    }
  } else {
    item.children.push(droppedConfigWithUid);
  }

  let updated = _.set(mjmlJson, path.slice(1), item);
  updated = cleanMjmlJson(updated);
  console.info('updated:', updated);
  setMjmlJson({ ...updated });
};

interface RemoveProps {
  target: HTMLElement;
  mjmlJson: any;
  setMjmlJson: any;
  setDelActive: any;
  setCopyActive: any;
  setActive: any;
}

const Remove = ({ target, mjmlJson, setMjmlJson, setDelActive, setCopyActive, setActive }: RemoveProps) => {
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
    setCopyActive(false);
    setMjmlJson({ ...updated });
  } else {
    console.info('unable to delete the item');
  }

  setMjmlJson({ ...updated });
};

interface UpdateValueProps {
  visible: boolean | null;
  path: string;
  mjmlJson: any;
  setMjmlJson: any;
  attribute: string;
  value: any;
}

const UpdateValue = ({ visible, path, mjmlJson, setMjmlJson, attribute, value }: UpdateValueProps) => {
  if (visible && path) {
    let item = _.get(mjmlJson, path, visible);
    if (item) {
      if (item['attributes'] && item['attributes'][attribute] !== value) {
        item['attributes'][attribute] = value;
        const updated = _.set(mjmlJson, path, item);
        setMjmlJson({ ...updated });
      }
    }
  }
};

interface CopyProps extends RemoveProps {
  uidGenerator: () => string;
}

const Copy = ({ mjmlJson, setActive, setMjmlJson, setCopyActive, setDelActive, target, uidGenerator }: CopyProps) => {
  const uniqueIdentifier = findUniqueIdentifier(target, target.classList);
  let columnUniqueIdentifier = findColumnOfElement(target);
  let index = -1;

  if (uniqueIdentifier && columnUniqueIdentifier) {
    [, columnUniqueIdentifier] = columnUniqueIdentifier;
    index = getIndexOfElementInColumn(mjmlJson, null, columnUniqueIdentifier, uniqueIdentifier);
  }

  if (index === -1) {
    console.log('handle cloning of section and column');
  }

  let copyOfConfig = findElementInJson(mjmlJson, uniqueIdentifier);
  if (copyOfConfig && index > -1) {
    [copyOfConfig] = copyOfConfig;
    setCopyActive(false);
    setDelActive(false);
    setActive(null);

    return Add({
      target: null,
      droppedConfig: copyOfConfig,
      setMjmlJson,
      mjmlJson,
      uid: uidGenerator,
      insert: { index, ParentUniqueClassIdentifier: columnUniqueIdentifier },
    });
  }
};

export { Add, Remove, UpdateValue, Copy };
