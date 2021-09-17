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

const findUniqueIdentifier = (element: Element, classlist: DOMTokenList) => {
  let uniqueClassName = null;
  for (var i = 0; i < classlist.length; i++) {
    const current = classlist[i];
    if (current.includes('identifier-mj')) {
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

export { findClosestParent, findUniqueIdentifier, replaceGeneicTagWithUniqueId };
