import { logger } from './logger';

const htmlSerializer = (div: HTMLElement, json: any): any => {
  if (div === undefined || div.tagName === undefined) {
    return;
  }

  json['tag'] = div.tagName.toLowerCase();
  if (div.hasAttributes && div.hasAttributes()) {
    let attributes: any[] = [];
    let attributes_json: any = {};
    Object.entries(div.attributes).forEach(([key, value]) => {
      const k = key as unknown as number;
      const name = div.attributes[k].name;
      const _value = div.attributes[k].value;
      attributes.push({ name, value: _value });
      attributes_json[name] = _value;
    });
    json['attributes'] = attributes;
  } else {
    logger.log('not attributes present for ===>', div);
  }

  let children: Object[] = [];
  if (div.children) {
    const childCount = div.children.length;
    for (var i = 0; i < childCount; i++) {
      const res = htmlSerializer(div.children[i] as HTMLElement, {});
      children.push(res);
    }
  }
  json['children'] = children;
  return json;
};

export { htmlSerializer };
