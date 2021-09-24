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
    const current = classNamesArr[i];
    if (current.includes('identifier-mj')) {
      updatedClassNames += ` ${current}-${uid}`;
      continue;
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

export { findClosestParent, findUniqueIdentifier, replaceGeneicTagWithUniqueId, generateUiqueIdForColumns };
