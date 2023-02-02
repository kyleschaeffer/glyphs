import Head from 'next/head'
import { useAppStore } from '../store/app'
import { SearchForm } from './SearchForm'
import { SearchResults } from './SearchResults'
import { Footer } from './Footer'

export function Search() {
  const hasQuery = useAppStore((store) => store.query.length > 0)

  return (
    <>
      <Head>
        <title>Glyphs — Unicode Character and Symbol Reference</title>
      </Head>
      <SearchForm />
      {hasQuery && <SearchResults />}
      <Footer />
    </>
  )
}
