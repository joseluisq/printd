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
})
