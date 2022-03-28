import { Component } from 'solid-js'
import { search } from '../store'

export const Search: Component = () => {
  return (
    <div>
      <input type="search" value={search.state.query} onChange={(e) => search.setQuery(e.currentTarget.value)} />
    </div>
  )
}
