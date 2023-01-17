import { useAppStore } from '../../store/app'

export function useLoading(): boolean {
  return useAppStore(
    (store) =>
      !store.ready || store.loadingResults || store.loadingGlyph || store.debouncingQuery || store.debouncingChar
  )
}
