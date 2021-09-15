const findClosestParent = (element: HTMLElement) => {
  const closest = element.closest('.mjml-tag');
  let uniqueClassName = null;

  if (!closest) {
    console.info('unable to find closest');
    return uniqueClassName;
  }

  for (var i = 0; i < closest.classList.length; i++) {
    const current = closest.classList[i];
    if (current.includes('identifier-mj')) {
      uniqueClassName = current;
      break;
    }
  }

  if (!uniqueClassName) {
    console.info('unable to find identifier');
  }
  return uniqueClassName;
};

export { findClosestParent };
