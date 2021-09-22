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

export { detectElement, detectEmptyElement };
