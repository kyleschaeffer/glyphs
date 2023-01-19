import Head from 'next/head'
import { useAppStore } from '../store/app'
import { HashController } from './controllers/HashController'
import { Glyph } from './Glyph'
import { Inspector } from './Inspector'
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
          <Inspector />
          {hasQuery ? <SearchResults /> : <Summary />}
        </>
      )}
    </>
  )
}
