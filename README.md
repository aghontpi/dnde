<p align="center">
  <img src="https://raw.githubusercontent.com/aghontpi/dnde/master/public/dnde-banner.svg"/>
  <br/>
  <br/>
  <i>Drag and Drop E-mail Editor</i>
  <br/>
  <br/>
  <a href="https://github.com/aghontpi/dnde/releases"><img src="https://img.shields.io/github/v/release/aghontpi/dnde?include_prereleases&style=flat-square&label=github-release" alt="release"></a>
  <a href="https://www.npmjs.com/package/dnd-email-editor"><img src="https://img.shields.io/npm/v/dnd-email-editor?style=flat-square" alt="npm"></a>
  <a href="https://github.com/aghontpi/dnde/blob/master/LICENSE"><img src="https://img.shields.io/github/license/aghontpi/dnde?style=flat-square" alt="license"></a>
</p>

[license-badge]: https://img.shields.io/github/license/aghontpi/dnde?style=flat-square
[license file]: https://github.com/aghontpi/dnde/blob/master/LICENSE
[badge]: https://img.shields.io/github/v/release/aghontpi/dnde?include_prereleases&style=flat-square&label=github-release
[release link]: https://github.com/aghontpi/dnde/releases
[npm badge]: https://img.shields.io/npm/v/dnd-email-editor?style=flat-square
[npm link]: https://www.npmjs.com/package/dnd-email-editor

<h2 align="center"> screens / live demo <a href="https://dnde.bluepie.in">here</a></h2>
<p align="center">
<img src="https://raw.githubusercontent.com/aghontpi/dnde/master/Screenshots/previews(25-oct-2021).gif"  width="50%" />
</p>

## Installation

```bash
# Yarn
yarn add dnd-email-editor

# NPM
npm install dnd-email-editor

```

## What's included

Props that can be passed to the component:

|      Prop      |  Type   | Default | Optional | Description                                                                                                                              |
| :------------: | :-----: | :-----: | :------: | ---------------------------------------------------------------------------------------------------------------------------------------- |
|   `preview`    | boolean | `true`  |   true   | show/hide the inbuilt preview button.                                                                                                    |
| `showUndoRedo` | boolean | `true`  |   true   | show/hide the inbuilt undo/redo button. <br/><br/> You can create your own undoredo functionality with `undoredo` from api methods below |

Editor exposes these api methods

- `getHtml` - export the design as html content
- `getJson` - export as json string, this string can then be used with `loadJson`
- `loadJson` - load an existing design from json string
- `undoredo` - undo and redo actions

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

- Using `getHtml()`, `getJson()`, `loadJson()`, `undoredo`

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

const performUndoAction = () => {
  if (ref.current) {
    ref.current.undoActionCallback();

    // to check if undo is possible
    console.log('is undo empty: ', ref.current.isUndoEmpty());
  }
};

const performRedoAction = () => {
  if (ref.current) {
    ref.current.redoActionCallback();

    // to check if redo is possible
    console.log('is redo empty: ', ref.current.isRedoEmpty());
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

There are soo many drag and drop editors that helps in **creating website** but **not mails**, because mails differ a lot from `a normal html webpage`

- even if there are `mail editors` available, they are paid and not `open-source`.

One such example would be `unlayer`, It claims to be opensource but its not.

- Looking at their source code, they only provide their loader-script and call it as `open-source`
- later they ask you to pay for its features.

the above reasons and also I was inspired by drag-n-drop editors in general, so I decided to make one.

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
- Preview the design in the browser (Mobile & PC)

## Built with

- [React](https://facebook.github.io/react/)
- [MJML](https://mjml.io/)
- [antd](https://ant.design/)

## Inspired by

- [MailJet](https://www.mailjet.com/)
- [Unlayer](https://unlayer.com/)
