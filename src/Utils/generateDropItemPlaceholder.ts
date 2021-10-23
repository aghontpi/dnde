import _ from 'lodash';
import { findUniqueIdentifier, findUniqueIdentifierFromString } from './closestParent';
import { closeToTopOrBottom, isEventWithTargetElement } from './eventElementRelation';
import { findElementInJson } from './findElementInMjmlJson';
import { logger } from './logger';
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
          let item = findElementInJson(_.cloneDeep(mjmlJson), nearestTag);
          if (item) {
            const [, path]: [any, string] = item;
            // omit the last .child.. index, cuz parent is needed
            const parent = path.slice(1, path.lastIndexOf('.children'));
            let parentObj = _.get(_.cloneDeep(mjmlJson), parent);
            let newOrder = [];
            for (var i = 0; parentObj && parentObj.children && i < parentObj.children.length; i++) {
              let childItem = parentObj['children'][i];
              logger.log(childItem);
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
              const updated = _.set(_.cloneDeep(mjmlJson), parent, parentObj);
              const uniqueColumnIdentifier = findUniqueIdentifier(
                columnElement,
                columnElement.classList,
                'identifier-mj-column'
              );
              if (uniqueColumnIdentifier) {
                const cleaned = cleanMjmlJson(updated, uniqueColumnIdentifier);
                if (!_.isEqual(mjmlJson, cleaned)) {
                  logger.log('::update::', mjmlJson, cleaned);
                  setMjmlJson({ ...cleaned });
                } else {
                  logger.log('::update:: -> but elements are the same, not triggering rerender');
                }
              } else {
                if (!_.isEqual(mjmlJson, updated)) {
                  logger.log('::update::', mjmlJson, updated);
                  setMjmlJson({ ...updated });
                } else {
                  logger.log('::update:: -> but elements are the same, not triggering rerender');
                }
              }
            }
          }
        }
      }
    }
  }
};

const genereateDropItemPlaceholderForColumn = ({
  mjmlJson,
  setMjmlJson,
  nearestTag,
}: Omit<generateDropItemPlacehodlerProps, 'event' | 'columnElement' | 'currentTarget'>) => {
  if (nearestTag) {
    let find = findElementInJson(mjmlJson, nearestTag);
    if (find) {
      const cleanedMjmlJson = cleanMjmlJson(_.cloneDeep(mjmlJson));
      logger.log('::beforechange::', mjmlJson, cleanedMjmlJson);
      const [, path]: [any, string] = find;
      let columnObj = _.get(_.cloneDeep(cleanedMjmlJson), path.slice(1));
      let newOrder = [];
      for (let i = 0; columnObj && columnObj.children && i < columnObj.children.length; i++) {
        const childItem = columnObj['children'][i];
        const cssClass = childItem.attributes && childItem['attributes']['css-class'];
        // if there is existing placeholders, removing them
        if (cssClass && cssClass.includes('placeitem-placeholder')) {
          continue;
        }
        // remove column empty placeholders
        if (cssClass && cssClass.includes('mj-placeholder')) {
          continue;
        }
        newOrder.push(childItem);
      }

      // newOrder will not be zero if the column already has items
      if (newOrder.length > 0) {
        // todo: handle generateDropItemPlaceholder inside this fn.
        //  by getting event and performing calculations.
        return false;
      }

      // add the new element
      newOrder.push(placeItemPlaceHolder);

      let sectionPath = path.slice(1, path.lastIndexOf('.children'));
      if (columnObj) {
        //  section can contain multiple,
        // identify which column is active and replace with new order
        columnObj.children = newOrder;
        let parentSection = _.get(_.cloneDeep(cleanedMjmlJson), sectionPath);
        let columnChildrenNewOrder = [];
        for (let i = 0; parentSection && parentSection.children && i < parentSection.children.length; i++) {
          const childColumn = parentSection['children'][i];
          const cssClass = childColumn.attributes && childColumn['attributes']['css-class'];
          const uniqueIdentifer = findUniqueIdentifierFromString(cssClass);
          // nearestTag is the  uniqueId of the column,
          //   replace the old column with new one
          if (uniqueIdentifer === nearestTag) {
            columnChildrenNewOrder.push(columnObj);
            continue;
          }
          columnChildrenNewOrder.push(childColumn);
        }
        parentSection.children = columnChildrenNewOrder;
        const updated = _.set(cleanedMjmlJson, sectionPath, parentSection);
        if (!_.isEqual(mjmlJson, updated)) {
          logger.log('::update::', cleanedMjmlJson, updated);
          setMjmlJson({ ...updated });
        } else {
          logger.log('::update:: -> but elements are the same, not triggering rerender');
        }
        return true;
      }
    }
  }
};

export { generateDropItemPlaceholder, genereateDropItemPlaceholderForColumn };

const placeItemPlaceHolder = {
  tagName: 'mj-text',
  attributes: {
    align: 'center',
    'css-class': 'placeitem-placeholder',
  },
  content: '<div style="padding:24px">  </div>',
};
