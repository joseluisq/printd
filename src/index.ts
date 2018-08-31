export function createStyle (doc: Document, cssText: string): HTMLStyleElement {
  const style: HTMLStyleElement = doc.createElement('style')

  style.type = 'text/css'
  style.appendChild(window.document.createTextNode(cssText))

  return style
}

export function createIFrame (parent: HTMLElement = window.document.body): HTMLIFrameElement {
  const el: HTMLIFrameElement = window.document.createElement('iframe')
  const css = 'visibility:hidden;width:0;height:0;position:absolute;z-index:-9999;bottom:0;'

  el.setAttribute('src', 'about:blank')
  el.setAttribute('style', css)
  el.setAttribute('width', '0')
  el.setAttribute('height', '0')
  el.setAttribute('wmode', 'opaque')

  parent.appendChild(el)

  return el
}

export type PrintdCallback = (win: Window, doc: Document, node: HTMLElement, launchPrint: Function) => void

export default class Printd {
  private node: HTMLElement | null = null
  private readonly iframe: HTMLIFrameElement

  constructor (private readonly parent: HTMLElement = window.document.body) {
    this.iframe = createIFrame(this.parent)
  }

  getIFrame (): HTMLIFrameElement {
    return this.iframe
  }

  print (el: HTMLElement, cssText?: string, callback?: PrintdCallback): void {
    this.node = el.cloneNode(true) as HTMLElement

    const { contentDocument, contentWindow } = this.iframe

    if (contentDocument && contentWindow) {
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
  }

  private launchPrint (contentWindow: Window): void {
    const result: boolean = contentWindow.document.execCommand('print', false, null)

    if (!result) {
      contentWindow.print()
    }
  }
}

export { Printd }
