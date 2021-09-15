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

export { findClosestParent, findUniqueIdentifier };
