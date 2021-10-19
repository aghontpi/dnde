import { findElementInJson } from './findElementInMjmlJson';
import { findColumnOfElement } from './findElementsParent';
import { logger } from './logger';

const findClosestParent = (element: HTMLElement) => {
  const closest = element.closest('.mjml-tag');
  let uniqueClassName = null;

  if (!closest) {
    logger.info('unable to find closest');
    return uniqueClassName;
  }

  uniqueClassName = findUniqueIdentifier(closest, closest.classList);

  if (!uniqueClassName) {
    logger.info('unable to find identifier');
  }

  return uniqueClassName;
};

const findUniqueIdentifier = (element: Element, classlist: DOMTokenList, identifier = 'identifier-mj') => {
  let uniqueClassName = null;
  for (var i = 0; classlist && i < classlist.length; i++) {
    const current = classlist[i];
    if (current.includes(identifier)) {
      uniqueClassName = current;
      break;
    }
  }
  return uniqueClassName;
};

const findUniqueIdentifierFromString = (classList: string) => {
  return findUniqueIdentifier(null as unknown as Element, classList.split(' ') as unknown as DOMTokenList);
};

const replaceGeneicTagWithUniqueId = (classNames: string, uid: string) => {
  let updatedClassNames = '';
  if (typeof classNames !== 'string') {
    logger.log(`classNames should be string while generating uniqueIdentifier, but found ${typeof classNames} instead`);
    return null;
  }
  let classNamesArr = classNames.split(' ');
  for (var i = 0; i < classNamesArr.length; i++) {
    let current = classNamesArr[i];
    if (current.includes('identifier-mj')) {
      current = current.trim();

      // checking if the element has already uniqueId,
      //   if it has, instead of appending uid to tag, need to replace it.
      const regexMatch = current.match(/-(\d+)/); // regex match number after '-'
      const log = current;
      if (regexMatch) {
        current = current.replace(regexMatch[0], `-${uid}`);
      } else {
        current = ` ${current}-${uid}`;
      }
      logger.log(`generating-tag: ${log} -> ${current} `);
    }
    updatedClassNames += ` ${current}`;
  }
  return updatedClassNames;
};

// section with different columns are stored in config without unqiueId's,
//   replacing those with unqiueIds (only for mj-columns).
const generateUniqueIdRecursively = (item: any, uidGenerator: () => string): any => {
  if (!item) {
    return;
  }

  for (var i = 0; item['children'] && i < item['children'].length; i++) {
    item['children'][i] = generateUniqueIdRecursively(item['children'][i], uidGenerator);
  }

  let attr = item['attributes'];
  if (attr) {
    let css_class = attr['css-class'];
    css_class = replaceGeneicTagWithUniqueId(css_class, uidGenerator());
    attr['css-class'] = css_class;
  }

  item['attributes'] = attr;

  return item;
};

const findIndexOfIdentifierInChildren = (children: [any], uniqueIdentifier: string) => {
  for (var i = 0; uniqueIdentifier && children && children.length > 0 && i < children.length; i++) {
    const child = children[i];
    if (child && child['attributes'] && child['attributes']['css-class'].includes(uniqueIdentifier)) {
      return i;
    }
  }
  return -1;
};

const getIndexOfElementInParent = (node: HTMLElement, mjmlJson: any, uniqueIdentifier: string) => {
  let index = -1;
  let parent = node.closest('.mjml-tag');
  // closest can be he same node, so go to parent
  if (parent === node) {
    parent = node.parentElement;
  }

  // element must be outside of column
  while (index === -1 && parent) {
    const parentUniqueIdentifier = findUniqueIdentifier(parent, parent.classList);
    if (parentUniqueIdentifier) {
      let element = findElementInJson(mjmlJson, parentUniqueIdentifier);
      if (element) {
        [element] = element;
        index = findIndexOfIdentifierInChildren(element.children, uniqueIdentifier);
        if (index !== -1) {
          break;
        }
      }
    }

    const next_parent = parent.closest('.mjml-tag');
    if (next_parent && next_parent === parent) {
      if (parent.parentElement) {
        parent = parent.parentElement.closest('.mjml-tag');
      }
    } else {
      parent = next_parent;
    }
  }

  const parentIdentifier = parent && parent.classList ? findUniqueIdentifier(parent, parent.classList) : null;
  return [index, parentIdentifier];
};

export {
  findClosestParent,
  findUniqueIdentifier,
  findUniqueIdentifierFromString,
  replaceGeneicTagWithUniqueId,
  generateUniqueIdRecursively,
  getIndexOfElementInParent,
};
