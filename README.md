# Dnde - Mail (Drag and Drop Editor designed for mails)

> Drag and Drop E-mail editor

[![release][badge]][release link] [![license][license-badge]][license file]

[license-badge]: https://img.shields.io/github/license/aghontpi/dnde?style=flat-square
[license file]: https://github.com/aghontpi/dnde/blob/master/LICENSE
[badge]: https://img.shields.io/github/v/release/aghontpi/dnde?include_prereleases&style=flat-square
[release link]: https://github.com/aghontpi/dnde/releases

## Installation

```bash
# Yarn
yarn add dnde-mail-editor

# NPM
npm install dnde-mail-editor

```

## What's included

Editor includes these api's

- `getHtml` - export the design as html content
- `getJson` - export as json string, this string can then be used with `loadJson`
- `loadjson` - load an existing design from json string

## Usage

- Importing

```typescript
import Editor from 'dnde-mail-editor';

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
import Editor from 'dnde-mail-editor';

const ExampleComponent = () => {

- const ref = useRef(null);
+ const ref = useRef<Editor>(null);

  return (
    <Editor ref={ref}/>
  );

}
```

## Preview

<p align="center"  >
<img src="./Screenshots/preview1(25-oct-2021).png"  width="50%" />
<img src="./Screenshots/preview2(25-oct-2021).png"  width="50%" />
<img src="./Screenshots/preview3(25-oct-2021).png"  width="50%" />
</p>

## Features

- Responsive and mobile friendly emails
- Design emails by drag and drop
- Add custom fonts
- Export the design as html/json
- Preview the design in the browser (mobile & pc)

## Built with

- [React](https://facebook.github.io/react/)
- [MJML](https://mjml.io/)
- [antd](https://ant.design/)

## Inspired by

- [MailJet](https://www.mailjet.com/)
- [Unlayer](https://unlayer.com/)
