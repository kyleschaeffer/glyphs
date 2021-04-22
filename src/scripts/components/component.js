export class GlyphsComponent extends HTMLElement {
  constructor() {
    super()

    this.bindTemplate()
    this.onMount()
  }

  bindTemplate() {
    const templateId = `${this.tagName.toLowerCase()}-template`
    const template = document.getElementById(templateId)
    if (!template) {
      throw new Error(`Template not found: #${templateId}`)
    }

    this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true))
  }

  onMount() {}
}
