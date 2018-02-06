import { Printd } from '../src'

describe('Printd test suite', () => {
  let d: Printd = new Printd()

  it('should contain the Printd object', () => {
    expect(d).toBeTruthy()
  })

  const el: HTMLElement = document.createElement('div')
  el.innerHTML = '<b>Bold text!</b>'

  it('should contain valid params in callback function', (done) => {
    d.print(el, '', (win, doc, node) => {
      expect(typeof win).toBe('object')
      expect(typeof doc).toBe('object')
      expect(typeof node).toBe('object')
      expect(node.innerText).toBe(el.innerText)

      done()
    })
  })

  const iframeRef: HTMLIFrameElement = d.getIFrame()

  it('should contains an HTMLIFrameElement reference', () => {
    expect(typeof iframeRef).toBe('object')
    expect(iframeRef instanceof HTMLIFrameElement).toBeTruthy()
    expect(typeof iframeRef.contentDocument).toBe('object')
    expect(typeof iframeRef.contentWindow).toBe('object')
  })
})
