# Dnde - Mail (Drag and Drop Editor designed for mails)

> Drag and Drop E-mail editor

[![release][badge]][release link] [![npm][npm badge]][npm link] [![license][license-badge]][license file]

[license-badge]: https://img.shields.io/github/license/aghontpi/dnde?style=flat-square
[license file]: https://github.com/aghontpi/dnde/blob/master/LICENSE
[badge]: https://img.shields.io/github/v/release/aghontpi/dnde?include_prereleases&style=flat-square&label=github-release
[release link]: https://github.com/aghontpi/dnde/releases
[npm badge]: https://img.shields.io/npm/v/dnd-email-editor?style=flat-square
[npm link]: https://www.npmjs.com/package/dnd-email-editor

## Check live demo [here](https://dnde.bluepie.in)

## Installation

```bash
# Yarn
yarn add dnd-email-editor

# NPM
npm install dnd-email-editor

```

## What's included

Editor includes these api's

- `getHtml` - export the design as html content
- `getJson` - export as json string, this string can then be used with `loadJson`
- `loadJson` - load an existing design from json string

## Usage

- Importing

```typescript
import Editor from 'dnd-email-editor';

return <Editor />;
```

- Setup a `ref` using `useRef` and pass it to editor

```typescript
const ref = React.useRef(null);

return <Editor ref={ref} />;
```

- Using `getHtml()`, `getJson()` and `loadJson()`

```typescript
const logValues = () => {
  if (ref.current) {
    const html = ref.current.getHtml();
    const json = ref.current.getJson();
    console.log(html, json);
  }
};

const loadJson = (json: string) => {
  if (ref.current) {
    ref.current.loadJson(json);
  }
};
```

- Typescript

Inorder to use typescript and get cool definitions, just pass the type to the ref

```diff
import Editor from 'dnd-email-editor';

const ExampleComponent = () => {

- const ref = useRef(null);
+ const ref = useRef<Editor>(null);

  return (
    <Editor ref={ref}/>
  );

}
```

## Purpose

There are soo many drag and drop editors that helps in **creating website** but **not mails**, because mails differ a lot from `a normal html webpage'

- even if there are `mail editors` avialable, they are paid and not `open-source`.

One such example would be `unlayer`, It claims to be opensource but its not.

- Looking at their source code, they only provide their loader-script and call it as `open-source`
- later they ask you to pay for its features.

the above reasons and also I was inspired by drag-n-drop editors in general, so I decided to make one.

## Preview

<p align="center"  >
<img src="https://raw.githubusercontent.com/aghontpi/dnde/master/Screenshots/preview1(25-oct-2021).png"  width="50%" />
<img src="https://raw.githubusercontent.com/aghontpi/dnde/master/Screenshots/preview2(25-oct-2021).png"  width="50%" />
<img src="https://raw.githubusercontent.com/aghontpi/dnde/master/Screenshots/preview3(25-oct-2021).png"  width="50%" />
</p>

## Features

- Responsive and mobile friendly emails
- Design emails by drag and drop
- Import/Export designs
  - Export/Import as JSON
  - Export as HTML
- Manage Fonts
  - add custom fonts
  - list / add/ deletefonts
- Go back and forth with `Undo / Redo`
- Preview the design in the browser (mobile & pc)

## Built with

- [React](https://facebook.github.io/react/)
- [MJML](https://mjml.io/)
- [antd](https://ant.design/)

## Inspired by

- [MailJet](https://www.mailjet.com/)
- [Unlayer](https://unlayer.com/)
