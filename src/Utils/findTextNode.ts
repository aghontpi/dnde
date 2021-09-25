const findTextNode = (node: any): any => {
  if (node.nodeType === 3) {
    return node;
  }

  for (let i = 0; node.childNodes && i < node.childNodes.length; i++) {
    const textNode = findTextNode(node.childNodes[i]);
    if (textNode) {
      return closestDivToTextNode(textNode);
    }
  }
};

const closestDivToTextNode = (node: any): any => {
  if (!node) {
    return null;
  }
  if (node.nodeType === 3) {
    return closestDivToTextNode(node.parentNode);
  }

  const element = node;

  if (element.nodeType === 1) {
    const closestDiv = element.closest('div');
    return closestDiv;
  }

  return element;
};

export { findTextNode };
