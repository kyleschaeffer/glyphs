# Glyphs

The handy developer’s glyph reference

[https://glyphs.io](https://glyphs.io/)

---

## Development

Glyphs consists of two main features: a [Parcel](https://parceljs.org/) static web application and a [Node.js](https://nodejs.org/) command-line scraping utility.

### Web Application

Build the web application using [Parcel](https://parceljs.org/) and [Yarn](https://yarnpkg.com/):

```sh
# Build in "watch" mode, launch local dev server
yarn run dev

# Build the app in production mode
yarn run build
```

Be sure to run in production mode before making any pull requests, as the `docs` folder is used by GitHub to host all content for [glyphs.io](https://glyphs.io/).

### Scraping Utility

Glyphs uses data published in the [Unicode 13.0.0](http://unicode.org/versions/Unicode13.0.0/) standard.

```sh
# Update Unicode JSON data
yarn run scrape
```
