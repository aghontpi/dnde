import { findUniqueIdentifier } from './closestParent';

const findColumnOfElement = (node: HTMLElement | any): any => {
  if (!node) {
    return null;
  }
  let parent = node.closest('.mjml-tag');
  if (parent && parent.classList) {
    const uniqueIdentifier = findUniqueIdentifier(parent, parent.classList);
    if (uniqueIdentifier && uniqueIdentifier.includes('mj-column')) {
      return parent;
    }
    parent = parent.parentElement;
  }

  return findColumnOfElement(parent);
};

export { findColumnOfElement };
