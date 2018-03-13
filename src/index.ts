function createStyle (doc: Document, cssText: string): HTMLStyleElement {
  const style: HTMLStyleElement = doc.createElement('style')

  style.type = 'text/css'
  style.appendChild(window.document.createTextNode(cssText))

  return style
}

function createIFrame (parent: HTMLElement = window.document.body): HTMLIFrameElement {
  const el: HTMLIFrameElement = window.document.createElement('iframe')
  const css: string = 'visibility:hidden;width:0;height:0;position:absolute;z-index:-9999;bottom:0;'

  el.setAttribute('src', 'about:blank')
  el.setAttribute('style', css)
  el.setAttribute('width', '0')
  el.setAttribute('height', '0')
  el.setAttribute('wmode', 'opaque')

  parent.appendChild(el)

  return el
}

type ICallback = (win: Window, doc: Document, node: HTMLElement, launchPrint: Function) => void

class Printd {
  private parent: HTMLElement
  private node: HTMLElement | null = null
  private iframe: HTMLIFrameElement

  constructor (parent: HTMLElement = window.document.body) {
    this.parent = parent
    this.iframe = createIFrame(this.parent)
  }

  getIFrame (): HTMLIFrameElement {
    return this.iframe
  }

  print (el: HTMLElement, cssText?: string, callback?: ICallback): void {
    this.node = el.cloneNode(true) as HTMLElement

    const { contentDocument, contentWindow } = this.iframe

    if (cssText) {
      contentDocument.head.appendChild(createStyle(contentDocument, cssText))
    }

    if (this.node) {
      contentDocument.body.innerHTML = ''
      contentDocument.body.appendChild(this.node)

      if (callback) {
        callback(contentWindow, contentDocument, this.node, this.launchPrint)
      } else {
        this.launchPrint(contentWindow)
      }
    }
  }

  launchPrint (contentWindow: Window) {
    let result = contentWindow.document.execCommand('print', false, null)
    if (!result) {
      contentWindow.print()
    }
  }
}

export { Printd, createIFrame, createStyle }

export default Printd
