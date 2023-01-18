import Head from 'next/head'
import Image from 'next/image'
import { useAppStore } from '../store/app'
import { HashController } from './controllers/HashController'
import { Glyph } from './Glyph'
import { SearchForm } from './SearchForm'
import { SearchResults } from './SearchResults'
import { Summary } from './Summary'

export function App() {
  const hasGlyph = useAppStore((store) => !!store.char)
  const hasQuery = useAppStore((store) => store.query.length > 0)

  return (
    <>
      <Head>
        <title>Glyphs — Unicode Character and Symbol Reference</title>
      </Head>
      <HashController />
      {hasGlyph ? (
        <Glyph />
      ) : (
        <>
          <SearchForm />
          {hasQuery ? <SearchResults /> : <Summary />}
        </>
      )}
    </>
  )
}
