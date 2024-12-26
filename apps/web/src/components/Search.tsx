import { useAppStore } from '../store/app'
import { Footer } from './Footer'
import { SearchForm } from './SearchForm'
import { SearchResults } from './SearchResults'

export function Search() {
  const hasQuery = useAppStore((store) => store.query.length > 0)

  return (
    <>
      <SearchForm />
      {hasQuery && <SearchResults />}
      <Footer />
    </>
  )
}
