import _ from 'lodash';
import { findUniqueIdentifier } from './closestParent';
import { closeToTopOrBottom, isEventWithTargetElement } from './eventElementRelation';
import { findElementInJson } from './findElementInMjmlJson';
import { cleanMjmlJson } from './mjmlProcessor';

interface generateDropItemPlacehodlerProps {
  setMjmlJson: any;
  mjmlJson: any;
  nearestTag: any;
  columnElement: any;
  currentTarget: any;
  event: any;
}

const generateDropItemPlaceholder = ({
  mjmlJson,
  setMjmlJson,
  columnElement,
  event: e,
  currentTarget,
  nearestTag,
}: generateDropItemPlacehodlerProps) => {
  if (columnElement && nearestTag) {
    const nearestElement = currentTarget.closest(`.${nearestTag}`);
    if (nearestElement && columnElement) {
      if (isEventWithTargetElement(e, columnElement)) {
        const suggestionDirection = closeToTopOrBottom(e, nearestElement);
        if (suggestionDirection) {
          let item = findElementInJson(mjmlJson, nearestTag);
          if (item) {
            const [, path]: [any, string] = item;
            // omit the last .child.. index, cuz parent is needed
            const parent = path.slice(1, path.lastIndexOf('.children'));
            let parentObj = _.get(mjmlJson, parent);
            let newOrder = [];
            for (var i = 0; parentObj && parentObj.children && i < parentObj.children.length; i++) {
              let childItem = parentObj['children'][i];
              console.log(childItem);
              const cssClass = childItem.attributes && childItem['attributes']['css-class'];
              // if there is existing placeholders, removing them
              if (cssClass && cssClass.includes('placeitem-placeholder')) {
                continue;
              }
              if (cssClass && cssClass.includes(nearestTag)) {
                if (suggestionDirection === 'top') {
                  newOrder.push(placeItemPlaceHolder, childItem);
                } else if (suggestionDirection === 'bottom') {
                  newOrder.push(childItem, placeItemPlaceHolder);
                }
                continue;
              }
              newOrder.push(childItem);
            }

            if (parentObj && newOrder.length > 0) {
              // replace with new order
              parentObj.children = newOrder;
              const updated = _.set(mjmlJson, parent, parentObj);
              const uniqueColumnIdentifier = findUniqueIdentifier(
                columnElement,
                columnElement.classList,
                'identifier-mj-column'
              );
              if (uniqueColumnIdentifier) {
                const cleaned = cleanMjmlJson(updated, uniqueColumnIdentifier);
                setMjmlJson({ ...cleaned });
              } else {
                setMjmlJson({ ...updated });
              }
            }
          }
        }
      }
    }
  }
};

export { generateDropItemPlaceholder };

const placeItemPlaceHolder = {
  tagName: 'mj-text',
  attributes: {
    align: 'center',
    'css-class': 'placeitem-placeholder',
  },
  content: '<h1>+</h1>',
};
