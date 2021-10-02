export const findElementInJson = (mjmljson: any, classidentifier: any, path = ''): any => {
  if (mjmljson === undefined) {
    return null;
  }
  const element = mjmljson;
  if (element.attributes && element.attributes['css-class']) {
    const classNames: string = element.attributes['css-class'];
    if (classNames.includes(classidentifier)) {
      return [element, path];
    }
  }
  if (element.children) {
    for (var i = 0; i < element.children.length; i++) {
      const child = element.children[i];
      const res = findElementInJson(child, classidentifier, path + `.children[${i}]`);
      if (res) {
        return res;
      }
    }
  }

  return null;
};
