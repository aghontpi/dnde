import { findUniqueIdentifier } from './closestParent';

const recursivelyFindParent = (node: HTMLElement | any, parentClassPartial: string): any => {
  if (!node) {
    return null;
  }
  let parent = node.closest('.mjml-tag');
  if (parent && parent.classList) {
    const uniqueIdentifier = findUniqueIdentifier(parent, parent.classList);
    if (uniqueIdentifier && uniqueIdentifier.includes(parentClassPartial)) {
      return [parent, uniqueIdentifier];
    }
    parent = parent.parentElement;
  }

  return recursivelyFindParent(parent, parentClassPartial);
};

const findColumnOfElement = (node: HTMLElement | any): any => {
  return recursivelyFindParent(node, 'mj-column');
};

const findSectionOfElement = (node: HTMLElement | any): any => {
  return recursivelyFindParent(node, 'mj-section');
};

export { findColumnOfElement, findSectionOfElement };
