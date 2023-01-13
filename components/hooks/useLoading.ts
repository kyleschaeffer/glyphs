import { useAppStore } from '../../store/app'

export function useLoading(): boolean {
  return useAppStore((store) => store.loading || !store.ready || store.debouncing)
}
