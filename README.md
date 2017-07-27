# Printd

> [Print](https://developer.mozilla.org/en-US/docs/Web/API/Window/print) HTML elements in modern browsers.

Printd is a small script to print HTMLElements. Printd opens [the Print Dialog](https://developer.mozilla.org/en-US/docs/Web/API/Window/print) to print elements inside a blank document. Also it supports [CSS Text](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style) styles.

__Development in progress...__

## Install

[Yarn](https://github.com/yarnpkg/)

```sh
yarn add printd --dev
```

[NPM](https://www.npmjs.com/)

```sh
npm install printd --save-dev
```

## Usage

```js
import printd from 'printd'

// Some styles for the element (optional)
const cssText = `
  table {
    font-size: 85%;
    font-family: sans-serif;
    border-spacing: 0;
    border-collapse: collapse;
  }
`

// Opens the Print Dialog
printd(document.getElementById('mytable'), cssText)
```

## Contributions

Feel free to send some [Pull requests](https://github.com/joseluisq/printd/pulls) or [issues](https://github.com/joseluisq/printd/issues).

## License
MIT license

© 2017 [José Luis Quintana](http://git.io/joseluisq)
