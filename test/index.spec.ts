import { Printd } from '../src'

describe('Printd test suite', () => {
  describe('api', () => {
    let printd: Printd
    let iframe: HTMLIFrameElement
    let spy: jasmine.Spy
    let el: HTMLElement

    const onEvent = () => true

    beforeEach(() => {
      printd = new Printd()
      iframe = printd.getIFrame()
      spy = spyOn(printd, 'print')

      el = document.createElement('div')
      el.innerHTML = '<b>Bold text!</b>'

      printd.print(el, '', onEvent)
    })

    it('should contain the Printd object', () => {
      expect(printd).toBeTruthy()
      expect(typeof printd).toBe('object')
      expect(printd instanceof Printd).toBeTruthy()
    })

    it('should track all the arguments of its calls (print)', () => {
      expect(printd.print).toHaveBeenCalledWith(el, '', onEvent)
    })

    it('should contains an HTMLIFrameElement reference', () => {
      expect(typeof iframe).toBe('object')
      expect(iframe).toEqual(jasmine.any(HTMLElement))

      const { contentDocument, contentWindow } = iframe

      expect(typeof contentDocument).toBe('object')
      expect(typeof contentWindow).toBe('object')
    })
  })

  describe('events', () => {
    let printd: Printd
    let window: Window
    let spy: jasmine.Spy

    const onEvent = () => true

    beforeEach(() => {
      printd = new Printd()
      window = printd.getIFrame().contentWindow

      spy = spyOn(window, 'addEventListener')
      window.addEventListener('beforeprint', onEvent)
      window.addEventListener('afterprint', onEvent)
    })

    it('should track all the arguments of its calls (beforeprint)', () => {
      expect(window.addEventListener).toHaveBeenCalledWith('beforeprint', onEvent)
    })

    it('should track all the arguments of its calls (afterprint)', () => {
      expect(window.addEventListener).toHaveBeenCalledWith('afterprint', onEvent)
    })

    it('should contain the given arguments (`beforeprint` event)', () => {
      const [ type, args ] = spy.calls.argsFor(0)

      expect(type).toBe('beforeprint')
      expect(args).toEqual(onEvent)
    })

    it('should contain the given arguments (`afterprint` event)', () => {
      const [ type, args ] = spy.calls.argsFor(1)

      expect(type).toBe('afterprint')
      expect(args).toEqual(onEvent)
    })
  })
})
