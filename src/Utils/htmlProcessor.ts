import _ from 'lodash';
import React, { Children, ReactFragment, ReactNode } from 'react';
import possibleStandardNames from './reactPropertyNames';

const DEBUG = false;

let doc: Document | null = null;
let counter = 0;

export const htmlProcessor = (html: string): ReactNode => {
  if (typeof html !== 'string') {
    console.error('htmlParser: html is not a string');
    return React.createElement('div', {}, 'errors: please check dev console') as ReactNode;
  }

  if (doc === null) {
    doc = new DOMParser().parseFromString(html, 'text/html');
  }
  //   const head = converter(doc.head, 0);
  return converter(doc.body);
};

const converter = (element: HTMLElement) => {
  if (element === undefined) {
    return;
  }

  let nodeName = element.nodeName.toLowerCase();

  // meta, script, style tags don't have children, for design ignoring meta tag while render
  if (nodeName === 'script' || nodeName === 'style' || nodeName === 'meta') {
    if (nodeName !== 'meta') {
      return React.createElement(nodeName, { key: ++counter, dangerouslySetInnerHTML: { __html: element.outerHTML } });
    }
    return;
  }

  // rerender trigger https://reactjs.org/docs/react-api.html#cloneelement
  if (React.isValidElement(element)) {
    DEBUG && console.info('cloning:', element);
    return React.cloneElement(element, { key: element.key ? element.key : ++counter }, null);
  }

  let attributes: { [key: string]: string | { [key: string]: string } | any } = {};

  for (var i = 0; i < element.attributes.length; i++) {
    let attribute = element.attributes[i];
    let reactName = possibleStandardNames[attribute.name];

    if (reactName === undefined) {
      reactName = toCamelCase(attribute.name);
      const msg = `htmlParser: ${attribute.name} is not found in possible attributes,
      using ${reactName} instead.`;
      DEBUG && console.error(msg, element);
    }

    let value = attribute.name === 'style' ? convertStyleStringToObject(attribute.value) : attribute.value;

    attributes[reactName] = value;
  }

  let children: ReactNode[] = [];

  for (let i = 0; i < element.childNodes.length; i++) {
    let child = element.childNodes[i];

    if (child.nodeType === 1 && nodeName !== 'script' && nodeName !== 'style') {
      children.push(converter(child as HTMLElement));
    } else if (child.nodeType === 3) {
      // text
      children.push(child.textContent?.trim());
    }
  }

  // todo: fix all key realted errors

  if (element.classList.contains('mjml-tag')) {
    // const ReactNode = React.createElement(nodeName, { key: ++counter, ...attributes }, children);
    // return React.createElement(
    //   'div',
    //   {
    //     draggable: true,
    //     style: { outline: '2px dashed #000', outlineOffset: '-1px' },
    //     key: ++counter,
    //   },
    //   ReactNode
    // );
  }

  return React.createElement(nodeName, { key: ++counter, ...attributes }, children);
};

const convertStyleStringToObject = (style: string) => {
  let styleObject: { [key: string]: string } = {};
  let styleArray = style.split(';');
  for (let i = 0; i < styleArray.length; i++) {
    if (styleArray[i] === '') {
      continue;
    }
    let stylePair = styleArray[i].split(':');
    let property = stylePair[0].trim();
    property = toCamelCase(property);
    let value = stylePair[1].trim();
    styleObject[property] = value;
  }

  return styleObject;
};

const toCamelCase = (str: string) => {
  return str.replace(/([-_][a-z])/gi, ($1) => {
    return $1.toUpperCase().replace('-', '').replace('_', '');
  });
};
