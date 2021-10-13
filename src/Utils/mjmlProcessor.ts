import { columnPlaceholder } from '../Components/Section';

const cleanMjmlJson = (mjmlJson: any, ignore: string = '') => {
  if (!mjmlJson) {
    return null;
  }

  if (mjmlJson['attributes'] && mjmlJson['attributes']['css-class']) {
    const cssClass = mjmlJson['attributes']['css-class'];
    if (cssClass.includes('placeitem-placeholder')) {
      return null;
    }
  }

  // before processing children, if the parent has ignore class, then dont process its children
  //  the active item being hovered on is passed as ignore, (specifically the column of the active item being hovered)
  const isIgnoring =
    ignore &&
    mjmlJson['attributes'] &&
    mjmlJson['attributes']['css-class'] &&
    mjmlJson['attributes']['css-class'].includes(ignore);

  let newChildren: any = [];
  for (var i = 0; mjmlJson['children'] && i < mjmlJson['children'].length; i++) {
    const item = mjmlJson['children'][i];

    const result = isIgnoring ? item : cleanMjmlJson(item, ignore);
    if (result) {
      newChildren.push(result);
    }
  }

  // if the children is column and its length is 0,
  //  then add a placeholder to the column
  if (mjmlJson && mjmlJson['tagName'] === 'mj-column' && newChildren.length === 0) {
    newChildren.push(...columnPlaceholder);
  }

  if (newChildren.length) {
    mjmlJson['children'] = newChildren;
  }

  return mjmlJson;
};

export { cleanMjmlJson };
