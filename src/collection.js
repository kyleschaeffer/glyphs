import Fuse from 'fuse.js'

export const Collection = {
  /**
   * Fuse.js configuration
   * @type {Fuse.FuseOptions}
   */
  config: {
    shouldSort: true,
    threshold: 0.2,
    location: 0,
    distance: 100,
    minMatchCharLength: 1,
    keys: [
      'c',
      'n',
      'k',
      'e',
      'h',
    ],
  },

  /**
   * Fuse.js instance
   * @type {Fuse|null}
   */
  fuse: null,

  /**
   * Initialize collection with items
   * @param {any[]} items - Items in the collection
   * @return {Collection}
   */
  init (items) {
    this.fuse = new Fuse(items, this.config)
    return this
  },

  /**
   * Execute search query on item collection
   * @param {string} query - Search query
   * @return {any[]}
   */
  search (query) {
    // Character query
    if (query.length === 1) {
      const foundChar = this.find(query)
      return foundChar ? [foundChar] : []
    }

    // Keyword query
    return this.fuse.search(query)
  },

  /**
   * Search item collection for a single character match
   * @param {string} char - Character query
   * @return {string|null}
   */
  find (char) {
    for (let i = 0; i < this.fuse._docs.length; i++) {
      if (this.fuse._docs[i].c === char) return this.fuse._docs[i]
    }
    return null
  },

  /**
   * Get items in the collection
   * @return {any[]}
   */
  items () {
    return this.fuse && this.fuse._docs ? this.fuse._docs : []
  },
}
