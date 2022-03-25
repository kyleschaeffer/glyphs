export class Search {
  /**
   * @type {Map<string, Set<string>>}
   */
  #index = new Map()

  /**
   * Get keys for a search term
   * @param {string} term Search term
   * @returns {string[]}
   */
  #keys(term) {
    return [...(this.#index.get(term) ?? [])]
  }

  /**
   * Normalize term string(s) by converting to lowercase and splitting on spaces, hyphens, and commas
   * @param {string} term Term string(s)
   * @returns {string[]}
   */
  normalize(term) {
    if (term.length <= 1) return [term.toLowerCase()]
    return term
      .split(/\s|-|,/)
      .filter((term) => term.length > 0)
      .map((term) => term.toLowerCase())
  }

  /**
   * Add a keyword to the search index
   * @param {string} key      Resolved key
   * @param {string[]} keywords Search keyword
   * @returns {void}
   */
  add(key, ...keywords) {
    keywords
      .map(this.normalize)
      .flat()
      .forEach((keyword) => {
        let keys = this.#index.get(keyword)
        if (!keys) {
          keys = new Set()
          this.#index.set(keyword, keys)
        }
        keys.add(key)
      })
  }

  /**
   * Search for keys by keyword query
   * @param {string} query Search query
   * @returns {string[]}
   */
  search(query) {
    const terms = this.normalize(query)
    return terms.map((term) => this.#keys(term)).flat()
  }
}
