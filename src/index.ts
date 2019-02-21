const URL_LONG = /^(((http[s]?)|file):)?(\/\/)+([0-9a-zA-Z-_.=?&].+)$/g
const URL_SHORT = /^([\.]?\/)([0-9a-zA-Z-_.=?&]+\/)*([0-9a-zA-Z-_.=?&]+)$/g
const isValidURL = (str: string) => URL_LONG.test(str) || URL_SHORT.test(str)

export function createStyle (doc: Document, cssText: string) {
  const style: HTMLStyleElement = doc.createElement('style')

  style.type = 'text/css'
  style.appendChild(window.document.createTextNode(cssText))

  return style
}

export function createLinkStyle (doc: Document, url: string) {
  const style: HTMLLinkElement = doc.createElement('link')

  style.type = 'text/css'
  style.rel = 'stylesheet'
  style.href = url

  return style
}

export function createIFrame (parent: HTMLElement = window.document.body) {
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

export interface PrintdCallbackArgs {
  /** Iframe reference */
  iframe: HTMLIFrameElement
  /** HTMLElement copy reference */
  element?: HTMLElement
  /** Function to launch the print dialog after content was loaded */
  launchPrint: Function
}

export type PrintdCallback = (args: PrintdCallbackArgs) => void

/** Printd class that prints HTML elements in a blank document */
export default class Printd {
  private readonly iframe: HTMLIFrameElement
  private loading = false
  private callback?: PrintdCallback
  private elCopy?: HTMLElement

  constructor (private readonly parent: HTMLElement = window.document.body) {
    this.iframe = createIFrame(this.parent)
    this.iframe.addEventListener('load', () => this.loadEvent(), false)
  }

  /** Gets current Iframe reference */
  getIFrame () {
    return this.iframe
  }

  /**
   * Print an HTMLElement
   *
   * @param el HTMLElement
   * @param styles Optional styles (css texts or urls) that will add to iframe document.head
   * @param scripts Optional scripts (script texts or urls) that will add to iframe document.body
   * @param callback Optional callback that will be triggered when content is ready to print
   */
  print (el: HTMLElement, styles?: string[], scripts?: string[], callback?: PrintdCallback) {
    if (this.loading) return

    const { contentDocument, contentWindow } = this.iframe

    if (!contentDocument || !contentWindow) return

    this.iframe.src = 'about:blank'
    this.elCopy = el.cloneNode(true) as HTMLElement

    if (!this.elCopy) return

    this.loading = true
    this.callback = callback

    const doc = contentWindow.document

    doc.open()
    doc.write(`
      <!DOCTYPE html><html><head><meta charset="utf-8"></head><body></body></html>
    `)

    // append custom styles
    if (Array.isArray(styles)) {
      styles.forEach((value) => {
        if (value) {
          if (isValidURL(value)) {
            doc.head.appendChild(createLinkStyle(doc, value))
          } else {
            doc.head.appendChild(createStyle(doc, value))
          }
        }
      })
    }

    // append element copy
    doc.body.appendChild(this.elCopy)

    // append custom scripts
    if (Array.isArray(scripts)) {
      scripts.forEach((value) => {
        if (value) {
          const script = doc.createElement('script')

          if (isValidURL(value)) {
            script.src = value
          } else {
            script.innerText = value
          }

          doc.body.appendChild(script)
        }
      })
    }

    doc.close()
  }

  /**
   * Print an URL
   *
   * @param url URL to print
   * @param callback Optional callback that will be triggered when content is ready to print
   */
  printURL (url: string, callback?: PrintdCallback) {
    if (this.loading) return

    this.loading = true
    this.callback = callback
    this.iframe.src = url
  }

  private launchPrint (contentWindow: Window) {
    const result = contentWindow.document.execCommand('print', false, null)

    if (!result) {
      contentWindow.print()
    }
  }

  private loadEvent () {
    if (this.iframe) {
      this.loading = false

      const { contentDocument, contentWindow } = this.iframe

      if (!contentDocument || !contentWindow) return

      if (this.callback) {
        this.callback({
          iframe: this.iframe,
          element: this.elCopy,
          launchPrint: () => this.launchPrint(contentWindow)
        })
      } else {
        this.launchPrint(contentWindow)
      }
    }
  }
}

export { Printd }
