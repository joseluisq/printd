const URL_LONG = /^(((http[s]?)|file):)?(\/\/)+([0-9a-zA-Z-_.=?&].+)$/
const URL_SHORT = /^((\.|\.\.)?\/)([0-9a-zA-Z-_.=?&]+\/)*([0-9a-zA-Z-_.=?&]+)$/
const isValidURL = (str: string) => URL_LONG.test(str) || URL_SHORT.test(str)

export function createStyle (doc: Document, cssText: string) {
    const style = doc.createElement("style")
    style.appendChild(doc.createTextNode(cssText))
    return style
}

export function createLinkStyle (doc: Document, url: string) {
    const style = doc.createElement("link")
    style.type = "text/css"
    style.rel = "stylesheet"
    style.href = url
    return style
}

export function createIFrame (parent: HTMLElement) {
    const el = window.document.createElement("iframe")
    el.setAttribute("src", "about:blank")
    el.setAttribute("style", "visibility:hidden;width:0;height:0;position:absolute;z-index:-9999;bottom:0;")
    el.setAttribute("width", "0")
    el.setAttribute("height", "0")
    el.setAttribute("wmode", "opaque")
    parent.appendChild(el)
    return el
}

export interface PrintdOptions {
    /** Parent element where the printable element will be appended. */
    parent?: HTMLElement
    /** Specifies a custom document head elements */
    headElements?: HTMLElement[]
    /** Specifies a custom document body elements */
    bodyElements?: HTMLElement[]

    [key: string]: HTMLElement | HTMLElement[] | undefined
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

const DEFAULT_OPTIONS: PrintdOptions = {
    parent: window.document.body,
    headElements: [],
    bodyElements: []
}

/** Printd class that prints HTML elements in a blank document */
export default class Printd {
    private readonly opts: Required<PrintdOptions>
    private readonly iframe: HTMLIFrameElement
    private isLoading = false
    private hasEvents = false
    private callback?: PrintdCallback
    private elCopy?: HTMLElement

    constructor (options?: PrintdOptions) {
        // IE 11+ "Object.assign" polyfill
        this.opts = [ DEFAULT_OPTIONS, options || {} ].reduce((a, b) => {
            Object.keys(b).forEach((k) => (a[k] = b[k]))
            return a
        }, {}) as Required<PrintdOptions>

        this.iframe = createIFrame(this.opts.parent)
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
        if (this.isLoading) return

        const { contentDocument, contentWindow } = this.iframe

        if (!contentDocument || !contentWindow) return

        this.iframe.src = "about:blank"
        this.elCopy = el.cloneNode(true) as HTMLElement

        if (!this.elCopy) return

        this.isLoading = true
        this.callback = callback

        const doc = contentWindow.document

        doc.open()
        doc.write('<!DOCTYPE html><html><head><meta charset="utf-8"></head><body></body></html>')

        this.addEvents()

        // 1. append custom elements
        const { headElements, bodyElements } = this.opts

        // 1.1 append custom head elements
        if (Array.isArray(headElements)) {
            headElements.forEach((el) => doc.head.appendChild(el))
        }

        // 1.1 append custom body elements
        if (Array.isArray(bodyElements)) {
            bodyElements.forEach((el) => doc.body.appendChild(el))
        }

        // 2. append custom styles
        if (Array.isArray(styles)) {
            styles.forEach((value) => {
                if (value) {
                    doc.head.appendChild(
                        isValidURL(value) ? createLinkStyle(doc, value) : createStyle(doc, value)
                    )
                }
            })
        }

        // 3. append element copy
        doc.body.appendChild(this.elCopy)

        // 4. append custom scripts
        if (Array.isArray(scripts)) {
            scripts.forEach((value) => {
                if (value) {
                    const script = doc.createElement("script")
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
        if (this.isLoading) return

        this.addEvents()
        this.isLoading = true
        this.callback = callback
        this.iframe.src = url
    }

    private launchPrint (contentWindow: Window) {
        const result = contentWindow.document.execCommand("print", false, undefined)
        if (!result) {
            contentWindow.print()
        }
    }

    private addEvents () {
        if (!this.hasEvents) {
            this.hasEvents = true
            this.iframe.addEventListener("load", () => this.onLoad(), false)
        }
    }

    private onLoad () {
        if (this.iframe) {
            this.isLoading = false

            const { contentDocument, contentWindow } = this.iframe

            if (!contentDocument || !contentWindow) return

            if (typeof this.callback === "function") {
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
