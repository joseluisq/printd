# Printd [![npm](https://img.shields.io/npm/v/printd.svg)](https://www.npmjs.com/package/printd) [![npm](https://img.shields.io/npm/dt/printd.svg)](https://www.npmjs.com/package/printd) [![Build Status](https://travis-ci.org/joseluisq/printd.svg?branch=master)](https://travis-ci.org/joseluisq/printd) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

> [Print](https://developer.mozilla.org/en-US/docs/Web/API/Window/print) HTML elements or URLs in modern browsers. :printer:

Printd opens your [Browser Print Dialog](https://developer.mozilla.org/en-US/docs/Web/API/Window/print) to print HTML elements inside a blank document or pages by URL.

## Features

- Written and tested entirely in [Typescript](./src/index.ts).
- Tiny script (around `800 bytes` gzipped with no dependencies).
- Print any element **_without_** opening a new window.
- Custom [CSS Text](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style) support.
- Printd waits until content such as images or fonts are ready to print.
- Print an page by URL.

## Demos

- :rocket: [Live demo](https://codepen.io/joseluisq/full/VzRpGb/)
- :books: [Demo source code](https://github.com/joseluisq/printd-vue-component-example)

## Install

[Yarn](https://github.com/yarnpkg/)

```sh
yarn add printd
```

[NPM](https://www.npmjs.com/)

```sh
npm install printd --save
```

[UMD](https://github.com/umdjs/umd/) file is also available on [unpkg](https://unpkg.com):

```html
<script src="https://unpkg.com/printd/dist/printd.umd.min.js"></script>
```

You can use the library via `window.printd`.

## Usage

```ts
import { Printd } from 'printd'

const cssText = `
  h1 {
    color: black;
    font-family: sans-serif;
  }
`

const d: Printd = new Printd()
d.print( document.getElementById('myelement'), cssText )
```

## API

### constructor

Constructor supports an optional parent element (`HTMLElement`) where the printable element will be appended. Default value is `window.document.body`.

Example:

```ts
const d = new Printd( document.getElementById('myparent') )
```

### print
Function to print an `HTMLElement`.

```ts
d.print (el, cssText, callback)
```

__Print parameters:__

- __element:__ The `HTMLElement` to print.
- __cssText:__ Optional [CSS Text](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style) that will add to head section of the iframe document.
- __callback:__ Optional callback that will be triggered when content is ready to print.
  - __Callback arguments:__
  - __iframe__: Iframe reference. `iframe` already contains `contentWindow` and `contentDocument` references.
  - __element__: `HTMLElement` copy reference.
  - __launchPrint__: Function to launch the print dialog after content was loaded.

1. Basic example:

```js
const d = new Printd()

d.print( document.getElementById('h1'), `h1 { font-family: serif; }` )
```

2. Callback example:

```js
const d = new Printd()
const cssText = `
  .code {
    font-family: monospace;
  }
`

// trigger the print dialog on demand when content (E.g. text, images, etc) is ready to print
const printCallback = ({ launchPrint }) => launchPrint()

d.print(document.getElementById('mycode'), cssText, printCallback)
```

### printURL

Function to print an URL.

__PrintURL parameters:__

- __url:__ URL to print.
- __callback:__ Optional callback that will be triggered when content is ready to print.

```ts
const d = new Printd()

d.printURL('http://127.0.0.1/', ({ launchPrint }) => {
  console.log('Content loaded!')

  // fire printing!
  launchPrint()
})
```

### getIFrame

Gets the current `HTMLIFrameElement` reference.

Examples:

```ts
const d = new Printd()
const iframe = d.getIFrame()

// a) Subscribe to IFrame load event
iframe.addEventListener('load', () => console.log('iframe loaded!'))

// b) Subscribe to Window `beforeprint` or `afterprint` events
const { contentWindow } = iframe
contentWindow.addEventListener('beforeprint', () => console.log('before print!'))
contentWindow.addEventListener('afterprint', () => console.log('after print!'))
```

## Browser compatibility

- Chrome Desktop 63+
- Chrome for Android 63+
- Firefox 6+
- Edge
- Internet Explorer
- Opera Desktop 50+
- Opera for Android 50+

__References:__

- [Chrome Platform Status - beforeprint and afterprint events](https://www.chromestatus.com/features/5700595042222080)
- https://caniuse.com/#feat=beforeafterprint
- [PR: Update support for before/after print event handlers (Blink)](https://github.com/Fyrd/caniuse/pull/4086)
- https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onbeforeprint

### Webkit-based and old browsers

For Webkit-based browsers, it can create an equivalent result using `window.matchMedia('print')`.

```ts
if (contentWindow.matchMedia) {
  const mediaQueryList = contentWindow.matchMedia('print')

  mediaQueryList.addListener((mql) => {
    if (mql.matches) {
      console.log('before print!')
    } else {
      console.log('after print!')
    }
  })
}
```

__References:__
- https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onbeforeprint
- https://www.tjvantoll.com/2012/06/15/detecting-print-requests-with-javascript/

## Contributions

Feel free to send some [Pull request](https://github.com/joseluisq/printd/pulls) or [issue](https://github.com/joseluisq/printd/issues).

## License
MIT license

© 2017-present [José Quintana](http://git.io/joseluisq)
