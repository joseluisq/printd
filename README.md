# Printd [![npm](https://img.shields.io/npm/v/printd.svg)](https://www.npmjs.com/package/printd) [![npm](https://img.shields.io/npm/dt/printd.svg)](https://www.npmjs.com/package/printd) [![Build Status](https://travis-ci.org/joseluisq/printd.svg?branch=master)](https://travis-ci.org/joseluisq/printd) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

> [Print](https://developer.mozilla.org/en-US/docs/Web/API/Window/print) HTML elements or pages in modern browsers. :printer:

Printd opens your [Browser Print Dialog](https://developer.mozilla.org/en-US/docs/Web/API/Window/print) to print HTML elements inside a blank document or pages by URL.

## Features

- Written and tested entirely in [Typescript](./src/index.ts).
- Tiny script (around `1KB` gzipped with no dependencies).
- Print any element **_without_** opening a new window.
- Print only when assets such as images or fonts are ready (loaded).
- Print pages by URL.
- Add styles and scripts on demand using text or URL.

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
<script src="https://unpkg.com/printd/printd.umd.min.js"></script>
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

const d = new Printd()
d.print( document.getElementById('myelement'), [ cssText ] )
```

## API

### options

- __parent__: Optional parent element where the printable element will be appended. Default `window.document.body`
- __headElements__: Optional custom document `head` elements array.
- __bodyElements__: Optional custom document `body` elements array.

Example:

```ts
// custom base element example
const base = document.createElement('base')
base.setAttribute('href', 'https://your-cdn.dev')

// define options to use
const options = {
  parent: document.getElementById('myparent'),
  headElements: [ base ]
}

const d = new Printd(options)
```

### print

Function to print an `HTMLElement`.

```ts
d.print (element, styles, scripts, callback)
```

__Print parameters:__

- __element:__ Some `HTMLElement` object to print.
- __styles:__ Optional styles (array of texts or urls) that will add to iframe (`document.head`)
- __scripts:__ Optional scripts (array of texts or urls) that will add to iframe (`document.body`)
- __callback:__ Optional callback that will be triggered when content is ready to print.
  - __callback arguments:__
  - __iframe__: An `HTMLIFrameElement` reference. It already contains `contentWindow` and `contentDocument` references.
  - __element__: An `HTMLElement` copy (cloned node) reference of current element to print.
  - __launchPrint__: Function to launch the print dialog after assets (images, fonts, etc) was loaded.

#### 1. Basic example

```ts
const d = new Printd()

d.print( document.getElementById('h1'), [`h1 { font-family: serif; }`] )
```

#### 2. Callback example

Callback option is suitable when you plan to print elements or pages with assets (images, fonts, etc) but you need to wait for them. Your callback will be triggered only when your assets are loaded.

```ts
const d = new Printd()

// Tip: texts & urls are supported

const styles = [
  'https://your-cdn.dev/style.css',
  `.code { font-family: monospace; }`
]

const scripts = [
  'https://your-cdn.dev/script.js',
  `(() => console.log('Hello from IFrame!'))()`
]

// Get an HTMLElement reference
const el = document.getElementById('mycode-block')
// Trigger the print dialog on demand
const printCallback = ({ launchPrint }) => launchPrint()

d.print(el, styles, scripts, printCallback)
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
- Internet Explorer 11
- Opera Desktop 50+
- Opera for Android 50+

__References:__

- [Chrome Platform Status - beforeprint and afterprint events](https://www.chromestatus.com/features/5700595042222080)
- https://caniuse.com/#feat=beforeafterprint
- [PR: Update support for before/after print event handlers (Blink)](https://github.com/Fyrd/caniuse/pull/4086)
- https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onbeforeprint

### beforeprint & afterprint workaround (Webkit-based and old browsers)

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


## Security

Since Printd uses an underlying iframe it's highly recommended to ensure that only your content will be displayed.
As a fallback you could remove the hidden iframe after some printing.

Here some interesting security advices that you want to take at look:

- [Why are iframes considered dangerous and a security risk?](https://stackoverflow.com/a/9428051/2510591)
- [MDN: X-Frame-Options](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options)
- [Play safely in sandboxed IFrames](https://www.html5rocks.com/en/tutorials/security/sandboxed-iframes/)

## Contributions

Feel free to send some [Pull request](https://github.com/joseluisq/printd/pulls) or [issue](https://github.com/joseluisq/printd/issues).

## License
MIT license

© 2017-present [José Quintana](https://git.io/joseluisq)
