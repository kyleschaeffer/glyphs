import { Component, onCleanup, onMount } from 'solid-js'
import { search } from '../store'

export const SearchProvider: Component = () => {
  onMount(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || e.shiftKey || e.metaKey || e.ctrlKey) return
      if (search.state.selected !== null) {
        e.preventDefault()
        search.setSelected(null)
      } else if (search.state.query.length) {
        e.preventDefault()
        search.setQuery('')
      }
    }
    window.addEventListener('keydown', onKeyDown)

    const onHashChange = (e: HashChangeEvent) => search.hydrateHash(new URL(e.newURL).hash)
    window.addEventListener('hashchange', onHashChange)

    onCleanup(() => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('hashchange', onHashChange)
    })
  })

  return null
}
