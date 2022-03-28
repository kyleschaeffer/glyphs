import type { Component } from 'solid-js'
import { Search } from './Search'

export const App: Component = () => {
  return (
    <>
      <h1>Glyphs ({import.meta.env.VITE_UNICODE_VERSION})</h1>
      <Search />
    </>
  )
}
