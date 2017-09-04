function createIFrame (parent: HTMLElement = window.document.body): HTMLIFrameElement {
  const el: HTMLIFrameElement = window.document.createElement('iframe')
  const css: string = 'visibility:hidden;width:0;height:0;position:absolute;z-index:-9999;bottom:0;'

  el.setAttribute('style', css)
  el.setAttribute('width', '0')
  el.setAttribute('height', '0')
  el.setAttribute('wmode', 'opaque')

  parent.appendChild(el)
  el.contentDocument.write('<!DOCTYPE html><html><head><meta charset="utf-8"></head><body></body></html>')

  return el
}

function createStyle (doc: Document, cssText: string): HTMLStyleElement {
  const style: HTMLStyleElement = doc.createElement('style')

  style.type = 'text/css'
  style.appendChild(window.document.createTextNode(cssText))

  return style
}

class Printd {
  private win: Window
  private doc: Document
  private parent: HTMLElement
  private el: HTMLElement

  constructor (parent: HTMLElement = window.document.body) {
    this.parent = parent
  }

  print (el: HTMLElement, cssText: string = ''): void {
    if (!this.win) {
      const { contentWindow, contentDocument } = createIFrame()
      this.win = contentWindow
      this.doc = contentDocument
    }

    let contentNode: Node | null = null

    if (this.el !== el) {
      contentNode = el.cloneNode(true)
      this.el = el
    }

    if (cssText) {
      this.doc.head.appendChild(createStyle(this.doc, cssText))
    }

    if (contentNode) {
      this.doc.body.innerHTML = ''
      this.doc.body.appendChild(contentNode)
    }

    this.doc.close()
    this.win.print()
  }
}

export { createIFrame, createStyle, Printd }

export default Printd
