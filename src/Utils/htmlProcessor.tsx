import _ from 'lodash';
import React, { ReactNode } from 'react';
import { HtmlWrapper } from '../Components/HtmlWrapper';
import possibleStandardNames from './reactPropertyNames';

const DEBUG = false;

export const htmlProcessor = (html: string): ReactNode => {
  if (typeof html !== 'string') {
    console.error('htmlParser: html is not a string');
    return React.createElement('div', {}, 'errors: please check dev console') as ReactNode;
  }

  let doc = new DOMParser().parseFromString(html, 'text/html');

  if (doc === null) {
    console.error('htmlParser: doc is null, unable to process html');
    return React.createElement('p', {}, 'errors: please check dev console') as ReactNode;
  }
  return converter(doc.body as HTMLElement, 1);
};

const converter = (element: HTMLElement, key = 0) => {
  if (element === undefined) {
    return;
  }

  let nodeName = element.nodeName.toLowerCase();

  // meta, script, style tags don't have children, for design ignoring meta tag while render
  if (nodeName === 'script' || nodeName === 'style' || nodeName === 'meta') {
    if (nodeName !== 'meta') {
      return React.createElement(nodeName, { dangerouslySetInnerHTML: { __html: element.outerHTML } });
    }
    return;
  }

  let attributes: { [key: string]: string | { [key: string]: string } | any } = {};

  for (var i = 0; element.attributes && i < element.attributes.length; i++) {
    let attribute = element.attributes[i];
    let reactName = possibleStandardNames[attribute.name];

    if (reactName === undefined) {
      reactName = toCamelCase(attribute.name);
      const msg = `htmlParser: ${attribute.name} is not found in possible attributes,
      using ${reactName} instead.`;
      DEBUG && console.error(msg, element);
    }

    let value = attribute.name === 'style' ? convertStyleStringToObject(attribute.value) : attribute.value.trim();

    attributes[reactName] = value;
  }

  attributes['key'] = key++;

  let children: ReactNode[] = [];

  for (let i = 0; i < element.childNodes.length; i++) {
    let child = element.childNodes[i];

    if (child['nodeName'] === '#text') {
      child.textContent && children.push(child.textContent.trim());
      continue;
    }

    if (child['nodeName'] === '#comment') {
      continue;
    }

    if (nodeName !== 'script' && nodeName !== 'style') {
      children.push(converter(child as HTMLElement, key++));
    }
  }
  if (element.classList && element.classList.contains('mjml-tag')) {
    DEBUG && console.info(`identified mjml-tag for : ${nodeName}, with attributes: ${JSON.stringify(attributes)}`);
    const ReactNode = React.createElement(nodeName, { key: key++, ...attributes }, children);
    return <HtmlWrapper children={ReactNode} key={key++} />;
  }

  // img tag should not have child param passed to it
  if (nodeName === 'img') {
    return React.createElement(nodeName, { key: key++, ...attributes }, null);
  } else if (element.nodeType === 3) {
    return React.createElement(nodeName, { ...attributes, key: key++ }, element.textContent);
  }

  return React.createElement(nodeName, attributes, children);
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
