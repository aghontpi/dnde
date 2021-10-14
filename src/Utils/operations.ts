import { message } from 'antd';
import _ from 'lodash';
import { error } from '../Components/Messages';
import { columnPlaceholder } from '../Components/Section';
import {
  findClosestParent,
  findUniqueIdentifier,
  generateUniqueIdRecursively,
  getIndexOfElementInParent,
} from './closestParent';
import { findElementInJson } from './findElementInMjmlJson';
import { cleanMjmlJson } from './mjmlProcessor';
import { insertAtPlaceholderIndicatorPosition, removePlaceholderBanner } from './removePlaceholders';
import { UNDOREDO } from './undoRedo';

interface AddProps {
  target: HTMLElement;
  droppedConfig: any;
  mjmlJson: any;
  setMjmlJson: any;
  uid: () => string;
}

const Add = ({ target, droppedConfig, setMjmlJson, mjmlJson, uid }: AddProps) => {
  let uniqueClassName = findClosestParent(target);

  if (!uniqueClassName) {
    const cleanedMjmlJson = cleanMjmlJson(mjmlJson);
    setMjmlJson({ ...cleanedMjmlJson });
    return null;
  }

  if (droppedConfig.tagName !== 'mj-section') {
    if (uniqueClassName === 'identifier-mj-body' || uniqueClassName === 'identifier-mj-section') {
      const cleanedMjmlJson = cleanMjmlJson(mjmlJson);
      setMjmlJson({ ...cleanedMjmlJson });
      error('kindly place the item on column instead ');
      return null;
    }
  }

  if (droppedConfig.tagName && droppedConfig.tagName === 'mj-section') {
    if (uniqueClassName !== 'identifier-mj-body') {
      const msg = 'Columns can not be nested! it will break mobile design';
      message.info(msg);
      console.log(`operation add: ${msg}`);
      return;
    }
  }

  let droppedConfigWithUid = _.cloneDeep(droppedConfig);
  droppedConfigWithUid = generateUniqueIdRecursively(droppedConfigWithUid, uid);

  const ObjectEquivalent = findElementInJson(_.cloneDeep(mjmlJson), uniqueClassName);

  if (!ObjectEquivalent) {
    return null;
  }

  let [item, path] = ObjectEquivalent;
  console.info('operation add: item in Object:', item, 'path to Object:', path);

  item = removePlaceholderBanner(item);

  item = insertAtPlaceholderIndicatorPosition(item, droppedConfigWithUid);

  if (UNDOREDO.isUndoEmpty()) {
    UNDOREDO.newAction(mjmlJson);
  }

  let updated = _.set(mjmlJson, path.slice(1), item);
  updated = cleanMjmlJson(updated);
  UNDOREDO.newAction(updated);
  setMjmlJson({ ...updated });
};

interface AddAtIndexProps {
  droppedConfig: any;
  mjmlJson: any;
  setMjmlJson: any;
  uid: () => string;
  parentUniqueClassIdentifier: string;
  index: number;
}

const AddAtIndex = ({
  droppedConfig,
  setMjmlJson,
  mjmlJson,
  uid,
  parentUniqueClassIdentifier,
  index,
}: AddAtIndexProps) => {
  let uniqueClassName = parentUniqueClassIdentifier;

  if (!uniqueClassName) {
    const cleanedMjmlJson = cleanMjmlJson(mjmlJson);
    setMjmlJson({ ...cleanedMjmlJson });
    return null;
  }

  let droppedConfigWithUid = _.cloneDeep(droppedConfig);
  droppedConfigWithUid = generateUniqueIdRecursively(droppedConfigWithUid, uid);

  const ObjectEquivalent = findElementInJson(mjmlJson, uniqueClassName);

  if (!ObjectEquivalent) {
    return null;
  }

  let [item, path] = ObjectEquivalent;
  console.info('operation add: item in Object:', item, 'path to Object:', path);

  item = removePlaceholderBanner(item);

  // insert the dropped config at the specified location
  if (index > -1) {
    for (var i = 0; item && item.children && i < item.children.length; i++) {
      if (i === index) {
        item.children.splice(i, 0, droppedConfigWithUid);
      }
    }
  }
  let updated = _.set(mjmlJson, path.slice(1), item);
  updated = cleanMjmlJson(updated);

  UNDOREDO.newAction(updated);
  setMjmlJson({ ...updated });
};

interface RemoveProps {
  target?: HTMLElement | undefined;
  uniqueClassName?: string;
  mjmlJson: any;
  setMjmlJson: any;
  setDelActive: any;
  setCopyActive: any;
  setActive: any;
}

const Remove = ({
  target,
  uniqueClassName: ucn,
  mjmlJson,
  setMjmlJson,
  setDelActive,
  setCopyActive,
  setActive,
}: RemoveProps) => {
  let uniqueClassName;
  if (target) {
    uniqueClassName = findClosestParent(target);
  } else if (ucn) {
    uniqueClassName = ucn;
  } else {
    console.info(`operation remove: either target/uniqueClassName must be provided 
      to perform this operation
    `);
    return;
  }
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
  UNDOREDO.newAction(updated);
  if (updated) {
    setDelActive(false);
    setCopyActive(false);
    setMjmlJson({ ...updated });
  } else {
    console.info('operation remove: unable to delete the item');
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

interface CopyProps extends Exclude<RemoveProps, 'uniqueClassName'> {
  target: HTMLElement;
  uidGenerator: () => string;
}

const Copy = ({ mjmlJson, setActive, setMjmlJson, setCopyActive, setDelActive, target, uidGenerator }: CopyProps) => {
  const uniqueIdentifier = findUniqueIdentifier(target, target.classList);
  let parentUniqueIdentifier = '';
  let index = -1;

  if (uniqueIdentifier) {
    const _ = getIndexOfElementInParent(target, mjmlJson, uniqueIdentifier);
    if (_ && typeof _[0] === 'number' && typeof _[1] === 'string') {
      [index, parentUniqueIdentifier] = _;
    }
  }

  let copyOfConfig = findElementInJson(mjmlJson, uniqueIdentifier);
  if (copyOfConfig && index > -1) {
    [copyOfConfig] = copyOfConfig;
    setCopyActive(false);
    setDelActive(false);
    setActive(null);

    return AddAtIndex({
      droppedConfig: _.cloneDeep(copyOfConfig),
      setMjmlJson,
      mjmlJson,
      uid: uidGenerator,
      index,
      parentUniqueClassIdentifier: parentUniqueIdentifier,
    });
  }
};

export { Add, Remove, UpdateValue, Copy };
