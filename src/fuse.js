import Fuse from 'fuse.js';

export default {
  // Fuse instance
  fuse: null,

  // Fuse config
  config: {
    shouldSort: true,
    threshold: 0.2,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: [
      'name',
      'entity',
      'hex',
    ],
  },

  // Initialize fuse array
  init(items) {
    this.fuse = new Fuse(items, this.config);
    return this;
  },

  // Execute search query on this collection
  search(query) {
    // Character query
    if (query.length === 1) {
      const foundChar = this.find(query);
      return foundChar ? [foundChar] : [];
    }

    // Keyword query
    return this.fuse.search(query);
  },

  // Find single character
  find(char) {
    for (let i = 0; i < this.fuse.list.length; i++) {
      if (this.fuse.list[i].char === char) return this.fuse.list[i];
    }
    return null;
  },
}
