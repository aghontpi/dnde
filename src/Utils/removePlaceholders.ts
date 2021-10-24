// remove the empty placeholder-banner if present
const removePlaceholderBanner = (item: any) => {
  if (item && item.children) {
    item.children = item.children.filter((config: any) => {
      if (config && config['attributes'] && config['attributes']['css-class']) {
        return !config['attributes']['css-class'].includes('mj-placeholder');
      }
      return true;
    });
  }
  return item;
};

const insertAtPlaceholderIndicatorPosition = (item: any, itemToInsert: any) => {
  if (item.tagName !== 'mj-body' && item.children && item.children.length) {
    // place the dropped config in the placeholder position, this only is needed for
    //   items, which has children
    for (var i = 0; i < item.children.length; i++) {
      const child = item.children[i];
      const cssClass = child.attributes['css-class'];
      if (cssClass && cssClass.includes('placeitem-placeholder')) {
        item.children[i] = itemToInsert;
        continue;
      }
      item.children[i] = child;
    }
  } else {
    // children are empty
    item.children.push(itemToInsert);
  }

  return item;
};

export { removePlaceholderBanner, insertAtPlaceholderIndicatorPosition };
