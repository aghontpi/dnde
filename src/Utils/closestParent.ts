import { findElementInJson } from './findElementInMjmlJson';
import { findColumnOfElement } from './findElementsParent';

const findClosestParent = (element: HTMLElement) => {
  const closest = element.closest('.mjml-tag');
  let uniqueClassName = null;

  if (!closest) {
    console.info('unable to find closest');
    return uniqueClassName;
  }

  uniqueClassName = findUniqueIdentifier(closest, closest.classList);

  if (!uniqueClassName) {
    console.info('unable to find identifier');
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
    console.log(
      `classNames should be string while generating uniqueIdentifier, but found ${typeof classNames} instead`
    );
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
      console.log(`generating-tag: ${log} -> ${current} `);
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

// node/parenetUniqueIdentifier is used, one of the two can be passed
const getIndexOfElementInColumn = (
  mjmlJson: any,
  node: HTMLElement | null,
  parentUniqueIdentifier: string = '',
  uniqueIdentifier: string
) => {
  let columnIdentifier = null;
  let index = -1;
  if (node) {
    columnIdentifier = findColumnOfElement(node);
    if (columnIdentifier) {
      [, columnIdentifier] = columnIdentifier;
    }
  } else if (parentUniqueIdentifier !== '') {
    columnIdentifier = parentUniqueIdentifier;
  }

  let columnInJson = findElementInJson(mjmlJson, columnIdentifier);

  // finding index of the element in the column, column has children,
  //   facts we can use to search: a column can not have nested columns,
  if (columnInJson) {
    [columnInJson] = columnInJson;
    index = findIndexOfIdentifierInChildren(columnInJson.children, uniqueIdentifier);
  }

  return index;
};

// todo: refractor getIndexOfElementInParent
const getIndexOfElementInParent = (node: HTMLElement, mjmlJson: any, uniqueIdentifier: string) => {
  let index = -1;
  let parent = findColumnOfElement(node);

  // within column
  if (parent) {
    [parent] = parent;
  } else {
    // outside column bounday
    parent = node.closest('.mjml-tag');
  }

  // first check in columns, if it can be identified
  index = getIndexOfElementInColumn(mjmlJson, node, '', uniqueIdentifier);

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
    if (next_parent === parent) {
      parent = parent.parentElement.closest('.mjml-tag');
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
  getIndexOfElementInColumn,
  getIndexOfElementInParent,
};
