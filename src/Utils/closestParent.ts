import { findElementInJson } from './findElementInMjmlJson';
import { findColumnOfElement } from './findElementsColumn';

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
  for (var i = 0; i < classlist.length; i++) {
    const current = classlist[i];
    if (current.includes(identifier)) {
      uniqueClassName = current;
      break;
    }
  }
  return uniqueClassName;
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
      if (regexMatch) {
        current = current.replace(regexMatch[0], `-${uid}`);
      } else {
        current = ` ${current}-${uid}`;
      }
    }
    updatedClassNames += ` ${current}`;
  }
  return updatedClassNames;
};

// section with different columns are stored in config without unqiueId's,
//   replacing those with unqiueIds (only for mj-columns).
const generateUiqueIdForColumns = (children: any, uidGenerator: () => string): any => {
  if (!children) {
    return;
  }

  for (var i = 0; children['children'] && i < children['children'].length; i++) {
    children['children'][i] = generateUiqueIdForColumns(children['children'][i], uidGenerator);
  }

  if (children.tagName !== 'mj-column') {
    return children;
  }

  let attr = children['attributes'];
  if (attr) {
    let css_class = attr['css-class'];
    css_class = replaceGeneicTagWithUniqueId(css_class, uidGenerator());
    attr['css-class'] = css_class;
  }

  children['attributes'] = attr;

  return children;
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
    for (
      var i = 0;
      columnInJson.children && columnInJson.children.length > 0 && i < columnInJson.children.length;
      i++
    ) {
      const child = columnInJson.children[i];

      if (child && child['attributes'] && child['attributes']['css-class'].includes(uniqueIdentifier)) {
        index = i;
        break;
      }
    }
  }

  return index;
};

export {
  findClosestParent,
  findUniqueIdentifier,
  replaceGeneicTagWithUniqueId,
  generateUiqueIdForColumns,
  getIndexOfElementInColumn,
};
