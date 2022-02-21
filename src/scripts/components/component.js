export class GlyphsComponent extends HTMLElement {
  constructor(initialState = {}) {
    super()
    this.state = initialState

    this._bindTemplate()
    this.onMount()
    this.render()
  }

  template() {
    return ''
  }

  style() {
    return ''
  }

  _bindTemplate() {
    const templateId = `${this.tagName.toLowerCase()}-template`
    let template = document.getElementById(templateId)
    if (!template) {
      template = document.createElement('template')
      template.id = templateId
      template.innerHTML = this.template()
      document.body.appendChild(template)

      const sheet = new CSSStyleSheet()
      sheet.replaceSync(this.style())
      document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet]
    }

    this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true))
    this.shadowRoot.adoptedStyleSheets = document.adoptedStyleSheets
  }

  onMount() {}

  setState(prop, value) {
    this.state = { ...this.state, [prop]: value }
    this.render()
  }

  render() {
    for (const el of this.shadowRoot.querySelectorAll('[-if]')) {
      const prop = el.getAttribute('-if')
      if (prop && this.state[prop]) el.style.display = 'block'
      else el.style.display = 'none'
    }

    for (const el of this.shadowRoot.querySelectorAll('[-ifnot]')) {
      const prop = el.getAttribute('-ifnot')
      if (prop && !this.state[prop]) el.style.display = 'block'
      else el.style.display = 'none'
    }
  }
}
