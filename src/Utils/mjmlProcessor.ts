const cleanMjmlJson = (mjmlJson: any) => {
  if (!mjmlJson) {
    return null;
  }

  if (mjmlJson['attributes'] && mjmlJson['attributes']['css-class']) {
    const cssClass = mjmlJson['attributes']['css-class'];
    if (cssClass.includes('placeitem-placeholder')) {
      return null;
    }
  }

  let newChildren: any = [];
  for (var i = 0; mjmlJson['children'] && i < mjmlJson['children'].length; i++) {
    const item = mjmlJson['children'][i];
    const result = cleanMjmlJson(item);
    if (result) {
      newChildren.push(result);
    }
  }
  if (newChildren.length) {
    mjmlJson['children'] = newChildren;
  }

  return mjmlJson;
};

export { cleanMjmlJson };
