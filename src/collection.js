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
   * Character indicies map
   * @type {Map<string, number>}
   */
  charMap: new Map(),

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

    // Add to character map
    for (let i = 0; i < items.length; i++) {
      this.charMap.set(items[i].c, i)
    }

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
   * @return {object|null}
   */
  find (char) {
    const i = this.charMap.get(char)
    if (i !== undefined) {
      return { item: this.fuse._docs[i] }
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
