import { Printd, PrintdCallback } from '../src'

describe('Printd test suite', () => {
  describe('api', () => {
    let printd: Printd
    let iframe: HTMLIFrameElement
    let el: HTMLElement
    let URL: string
    let printSpy: jasmine.Spy
    let printURLSpy: jasmine.Spy
    let printCallbackSpy: jasmine.Spy

    beforeEach(() => {
      printd = new Printd()
      iframe = printd.getIFrame()
      el = document.createElement('div')
      URL = 'http://127.0.0.1'
      el.innerHTML = '<b>Bold text!</b>'
    })

    it('should contain the Printd object', () => {
      expect(printd).toBeTruthy()
      expect(typeof printd).toBe('object')
      expect(printd instanceof Printd).toBeTruthy()
    })

    it('should track all the arguments of its calls (print)', function () {
      printSpy = spyOn(printd, 'print')
      printd.print(el, 'b{}')
      expect(printSpy).toHaveBeenCalledWith(el, 'b{}')
    })

    it('should track all the arguments of its calls (printURL)', function () {
      printURLSpy = spyOn(printd, 'printURL')
      printd.printURL(URL)
      expect(printURLSpy).toHaveBeenCalledWith('http://127.0.0.1')
    })

    it('should track all the arguments of its calls (printCallback)', function (done) {
      const printCallback: PrintdCallback = (argObj) => {
        printCallbackSpy(argObj)

        expect(printCallbackSpy).toHaveBeenCalled()
        expect(printCallbackSpy.calls.count()).toEqual(1)
        expect(typeof argObj).toBe('object')

        const args = Object.keys(argObj)

        expect(args).toContain('iframe')
        expect(args).toContain('element')
        expect(args).toContain('launchPrint')
        expect(typeof argObj.iframe).toBe('object')
        expect(typeof argObj.element).toBe('object')
        expect(typeof argObj.launchPrint).toBe('function')

        done()
      }

      printCallbackSpy = jasmine.createSpy('printCallback', printCallback)
      printd.print(el, '', printCallback)
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
