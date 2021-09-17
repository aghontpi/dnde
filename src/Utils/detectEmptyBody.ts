const detectEmptyElement = (nodeWithReactProperties: any, detect: string) => {
  if (!detect) {
    return false;
  } else if (detect === 'body') {
    detect = 'mj-identifier-body';
  } else if (detect === 'section') {
    detect = 'mj-identifier-section';
  } else {
    return false;
  }

  return (
    nodeWithReactProperties.props &&
    nodeWithReactProperties.props['className'] &&
    nodeWithReactProperties.props['className'] === 'string' &&
    nodeWithReactProperties.props['className'].includes(detect) &&
    nodeWithReactProperties.children &&
    nodeWithReactProperties.children < 1
  );
};

export { detectEmptyElement };
