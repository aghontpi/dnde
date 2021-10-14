import _ from 'lodash';
import { findUniqueIdentifierFromString } from './closestParent';
import { findElementInJson } from './findElementInMjmlJson';
import { UNDOREDO } from './undoRedo';

const moveSectionUp = (className: string, mjmlJson: any, setMjmlJson: any) => {
  const uniqueClassName = findUniqueIdentifierFromString(className);
  if (uniqueClassName) {
    const child = findElementInJson(mjmlJson, uniqueClassName);
    const parent = findElementInJson(mjmlJson, 'identifier-mj-body');
    if (child && parent) {
      const [parentItem, parentPath] = parent;
      const [childItem] = child;

      let newOrder = [];
      let indexOfItem = -1;
      for (let i = 0; parentItem.children.length > 1 && i < parentItem.children.length; i++) {
        const childSection = parentItem.children[i];
        if (childSection && childSection.attributes && childSection.attributes['css-class'].includes(uniqueClassName)) {
          indexOfItem = i;
          break;
        }
      }

      if (indexOfItem !== -1) {
        for (let i = 0; parentItem.children.length > 1 && i < parentItem.children.length; i++) {
          const childSection = parentItem.children[i];
          if (childSection) {
            // moveup -> indexOfItem -1
            if (i === indexOfItem - 1) {
              newOrder.push(childItem);
              newOrder.push(childSection);
              i += 1;
              continue;
            }
            newOrder.push(childSection);
          }
        }
      }
      if (newOrder.length > 1) {
        let update_parent = _.cloneDeep(parentItem);
        update_parent.children = _.cloneDeep(newOrder);
        const updated = _.set(mjmlJson, parentPath.slice(1), update_parent);
        UNDOREDO.newAction(updated);
        setMjmlJson({ ...updated });
      }
    }
  }
};

const moveSectionDown = (uniqueClassName: string) => {};

export { moveSectionUp, moveSectionDown };
