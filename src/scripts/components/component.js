/**
 * Glyphs base web component class
 * @template S
 */
export class GlyphsComponent extends HTMLElement {
  /**
   * @type {Map<string, NodeListOf<HTMLElement>>}
   */
  #templateElements = new Map()

  /**
   * HTML template
   */
  template = ''

  /**
   * CSS stylesheet
   */
  style = ''

  /**
   * Component state
   * @type {S}
   */
  state = {}

  constructor() {
    super()
    window.requestAnimationFrame(() => this.#mount())
  }

  /**
   * Called on component mount, just before the first render
   */
  onMount() {}

  /**
   * Called on each state update, just after rendering
   */
  onUpdate() {}

  /**
   * Set component state and trigger a new render
   * @template T
   * @param {string} key   State prop key
   * @param {T}      value New state prop value
   */
  setState(key, value) {
    this.state = { ...this.state, [key]: value }
    this.render()
  }

  /**
   * Render the component, updating template elements as needed
   */
  render() {
    for (const el of this.#templateElements.get('if')) {
      const prop = el.getAttribute('-if')
      if (prop && this.state[prop]) el.style.display = 'block'
      else el.style.display = 'none'
    }

    for (const el of this.#templateElements.get('ifnot')) {
      const prop = el.getAttribute('-ifnot')
      if (prop && !this.state[prop]) el.style.display = 'block'
      else el.style.display = 'none'
    }

    for (const el of this.#templateElements.get('value')) {
      const prop = el.getAttribute('-value')
      if (prop && this.state[prop] !== undefined) el.value = this.state[prop]
    }

    for (const el of this.#templateElements.get('bind')) {
      const prop = el.getAttribute('-bind')
      if (!prop) continue
      el.innerHTML = this.#getSerializedPropValue(prop)
    }

    for (const el of this.#templateElements.get('bind-attr')) {
      const attr = el.getAttribute('-bind-attr')
      if (!attr) continue
      const prop = el.getAttribute('-bind-attr-value')
      if (!prop) continue
      el.setAttribute(attr, this.#getSerializedPropValue(prop))
    }

    this.onUpdate()
  }

  #mount() {
    this.#bindTemplate()
    this.onMount()
    this.render()
  }

  #bindTemplate() {
    const templateId = `${this.tagName.toLowerCase()}-template`
    let template = document.getElementById(templateId)
    if (!template) {
      template = document.createElement('template')
      template.id = templateId
      template.innerHTML = this.template
      document.body.appendChild(template)

      const sheet = new CSSStyleSheet()
      sheet.replaceSync(this.style)
      document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet]
    }

    this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true))
    this.shadowRoot.adoptedStyleSheets = document.adoptedStyleSheets

    this.#templateElements.set('if', this.shadowRoot.querySelectorAll('[-if]') || [])
    this.#templateElements.set('ifnot', this.shadowRoot.querySelectorAll('[-ifnot]') || [])
    this.#templateElements.set('bind', this.shadowRoot.querySelectorAll('[-bind]') || [])
    this.#templateElements.set('value', this.shadowRoot.querySelectorAll('[-value]') || [])
    this.#templateElements.set('bind-attr', this.shadowRoot.querySelectorAll('[-bind-attr]') || [])

    this.#templateElements.get('value').forEach((el) => {
      const prop = el.getAttribute('-value')
      if (!prop) return
      el.oninput = (e) => this.setState(prop, e.target.value)
    })
  }

  #getSerializedPropValue(prop) {
    const value = this.state[prop]
    if (value === null || value === undefined) {
      return ''
    } else if (typeof value === 'object') {
      return JSON.stringify(value)
    } else {
      return value.toString()
    }
  }
}
