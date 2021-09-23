import _ from 'lodash';
import { error } from '../Components/Messages';
import { findClosestParent, generateUiqueIdForColumns, replaceGeneicTagWithUniqueId } from './closestParent';
import { findElementInJson } from './findElementInMjmlJson';

interface AddProps {
  target: HTMLElement;
  droppedConfig: any;
  mjmlJson: any;
  setMjmlJson: any;
  setMjmlString: any;
  setAttributes: any;
  setActive: any;
  uid: () => string;
}

const Add = ({
  target,
  droppedConfig,
  setMjmlJson,
  mjmlJson,
  setMjmlString,
  setAttributes,
  setActive,
  uid,
}: AddProps) => {
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

export { Add };
