type ICallback = (win: Window, doc: Document, node: HTMLElement, launchPrint: Function) => void

export class Printd {
  constructor (parent?: HTMLElement)
  print (el: HTMLElement, cssText?: string, callback?: ICallback): void
  getIFrame (): HTMLIFrameElement
}

export function createIFrame (parent?: HTMLElement): HTMLIFrameElement
export function createStyle (doc: Document, cssText: string): HTMLStyleElement
