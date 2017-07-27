let elWin
let elDoc

function createFrame () {
  const el = window.document.createElement('iframe')
  const css =
    'visibility:hidden;width:0;height:0;position:absolute;z-index:-9999;bottom:0;'

  el.setAttribute('style', css)
  el.setAttribute('width', '0')
  el.setAttribute('height', '0')
  el.setAttribute('wmode', 'opaque')

  window.document.body.appendChild(el)

  elWin = el.contentWindow || el.contentDocument || el
  elDoc = elWin.document || elWin.contentDocument || elWin
  elDoc.write(
    '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body></body></html>'
  )

  return el
}

function createStyle (cssText) {
  const style = elDoc.createElement('style')
  style.type = 'text/css'

  if (style.styleSheet) {
    style.styleSheet.cssText = cssText
  } else {
    style.appendChild(window.document.createTextNode(cssText))
  }

  return style
}

export default function print (el, cssText = '') {
  if (!el && !(el instanceof window.HTMLElement)) return
  if (!elWin) createFrame()

  const contentNode = el.cloneNode(true)

  if (cssText) elDoc.head.appendChild(createStyle(cssText))

  elDoc.body.innerHTML = ''
  elDoc.body.appendChild(contentNode)
  elDoc.close()

  elWin.print()
}
