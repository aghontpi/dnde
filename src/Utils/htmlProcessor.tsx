import React, { ReactNode } from 'react';
import { HtmlWrapper } from '../Components/HtmlWrapper';
import possibleStandardNames from './reactPropertyNames';
import { WrapWithOutline } from './wrapWithOutline';

const DEBUG = false;

const domParser: any = new DOMParser();

export const htmlProcessor = (html: string): ReactNode => {
  if (typeof html !== 'string') {
    console.error('htmlParser: html is not a string');
    return React.createElement('div', {}, 'errors: please check dev console') as ReactNode;
  }

  let doc = domParser.parseFromString(html, 'text/html');

  if (doc === null) {
    console.error('htmlParser: doc is null, unable to process html');
    return React.createElement('p', {}, 'errors: please check dev console') as ReactNode;
  }
  return converter(doc as unknown as HTMLElement, 1);
};

const converter = (element: HTMLElement, key = 0) => {
  if (element === undefined) {
    return;
  }

  let nodeName = element.nodeName.toLowerCase();

  // meta, script, style, ..etc, tags don't have children,
  if (
    nodeName === 'script' ||
    nodeName === 'style' ||
    nodeName === 'meta' ||
    nodeName === 'link' ||
    nodeName === 'title' ||
    nodeName === 'br'
  ) {
    if (nodeName === 'meta') {
      let el = element as HTMLMetaElement;
      return React.createElement(
        nodeName,
        { httpEquiv: el.httpEquiv, content: el.content, key: nodeName + key++ },
        null
      );
    }
    if (nodeName === 'link') {
      let el = element as HTMLLinkElement;
      let type = null;
      if (el.type) {
        type = el.type;
      }
      return React.createElement(
        nodeName,
        {
          href: el.href,
          rel: el.rel,
          type,
          key: nodeName + key++,
        },
        null
      );
    }
    if (nodeName === 'br') {
      return React.createElement(nodeName, { key: nodeName + key++ }, null);
    }

    return React.createElement(nodeName, {
      dangerouslySetInnerHTML: { __html: element.innerHTML, key: nodeName + key++ },
    });
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

  if (element.className && element.className.includes('mj-text')) {
    // if element is mj-text, we edit it with customInlineEditor by making div 'contentEditable' true.
    //  do not handle children in react.

    const original = { nodeName, props: { ...attributes, dangerouslySetInnerHTML: { __html: element.innerHTML } } };

    return <HtmlWrapper uniqueKey={key++} originalNode={original} />;
  }

  for (let i = 0; i < element.childNodes.length; i++) {
    let child = element.childNodes[i];

    if (child['nodeName'] === '#text') {
      if (child.textContent) {
        // inline editor, whitespace characters are being trimmed.
        // if whitespce is a problem in future, detect if text is related to
        // inline editor and stop trimming if so.

        // remove all new line characters
        const content = child.textContent.replaceAll('\n', '');
        if (content) {
          children.push(content);
        }
      }
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
    // const ReactNode = React.createElement(nodeName, { key: key++, ...attributes }, children);
    const original = { nodeName, props: { ...attributes }, children };

    return <HtmlWrapper uniqueKey={key++} originalNode={original} />;
    // return <HtmlWrapper children={ReactNode} key={key++} originalNode={original} />;
  }

  // process placehodler item differently, if mj-text is placer, the wrapper is td,
  //    td does not obey border properties, so outline can be used.
  if (element.classList && element.classList.contains('placeitem-placeholder')) {
    return <WrapWithOutline id={key++} nodeName={nodeName} props={{ ...attributes }} children={children} />;
  }

  // if root document, create it with div,
  // todo: rnd if this document can be abstracted from the main document,
  if (nodeName === '#document') {
    nodeName = 'div';
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
