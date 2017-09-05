# Printd

> [Print](https://developer.mozilla.org/en-US/docs/Web/API/Window/print) HTML elements in modern browsers. :printer:

Printd is a small script to print HTMLElements. Printd opens [the Print Dialog](https://developer.mozilla.org/en-US/docs/Web/API/Window/print) to print elements inside a blank document. It also supports [CSS Text](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style) for custom styles.

:tada: View demo on [CodePen](https://codepen.io/joseluisq/full/VzRpGb/).

## Install

[Yarn](https://github.com/yarnpkg/)

```sh
yarn add printd --dev
```

[NPM](https://www.npmjs.com/)

```sh
npm install printd --save-dev
```

[UMD](https://github.com/umdjs/umd/) file is also available on [unpkg](https://unpkg.com):

```html
<script src="https://unpkg.com/printd/dist/printd.umd.min.js"></script>
```

You can use the library via `window.printd`.

## Usage

```js
import Printd from 'printd'

// some styles for the element (optional)
const cssText = `
  table {
    font-size: 85%;
    font-family: sans-serif;
    border-spacing: 0;
    border-collapse: collapse;
  }
`

const d = new Printd()

// opens the "print dialog" of your browser to print the element
d.print( document.getElementById('mytable'), cssText )
```

### Typescript

```ts
import Printd from 'printd'

const cssText: string = `
  h1 {
    color: black;
    font-family: sans-serif;
  }
`

const d: Printd = new Printd()
d.print( document.querySelector('#myelement'), cssText )
```

## API

### Methods

#### constructor
The constructor supports an optional parent element (`HTMLElement`) where the printable element will be appended. Default value is `window.document.body`.

Example:

```js
const d = new Printd( document.getElementById('myparent') )
```

#### print
Prints the current `HTMLElement`. An optional `cssText` is supported to add custom styles to element.

Example:

```js
const d = new Printd()
d.print( document.querySelector('#h1'), `h1 { font-family: serif }` )
```

## Contributions

Feel free to send some [Pull request](https://github.com/joseluisq/printd/pulls) or [issue](https://github.com/joseluisq/printd/issues).

## License
MIT license

© 2017 [José Luis Quintana](http://git.io/joseluisq)
