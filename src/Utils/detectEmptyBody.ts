const detectEmptyElement = (nodeWithReactProperties: any, detect: string) => {
  return (
    detectElement(nodeWithReactProperties, detect) &&
    nodeWithReactProperties.children &&
    nodeWithReactProperties.children < 1
  );
};

const detectElement = (nodeWithReactProperties: any, detect: string) => {
  if (!detect) {
    return false;
  } else if (detect === 'body') {
    detect = 'identifier-mj-body';
  } else if (detect === 'section') {
    detect = 'identifier-mj-section';
  } else if (detect === 'column') {
    detect = 'identifier-mj-column';
  } else {
    return false;
  }

  return (
    nodeWithReactProperties.props &&
    nodeWithReactProperties.props['className'] &&
    typeof nodeWithReactProperties.props['className'] === 'string' &&
    nodeWithReactProperties.props['className'].includes(detect)
  );
};

const countEmptyChildrenLevels = (nodeWithReactProperties: any, count: number = 0): number => {
  if (!nodeWithReactProperties) {
    return count + 0;
  }
  let children = null;
  if (nodeWithReactProperties['children']) {
    children = nodeWithReactProperties['children'][0];
  } else if (nodeWithReactProperties['props']['children']) {
    children = nodeWithReactProperties['props']['children'][0];
  }
  if (children) {
    return countEmptyChildrenLevels(children, count + 1);
  } else {
    return count;
  }
};

export { detectElement, detectEmptyElement, countEmptyChildrenLevels };
