import Head from 'next/head'
import Image from 'next/image'
import { Glyph } from '../components/Glyph'
import { SearchForm } from '../components/SearchForm'
import { SearchResults } from '../components/SearchResults'
import { useAppStore } from '../store/app'

export default function AppRoute() {
  const hasGlyph = useAppStore((store) => !!store.glyph)
  const hasQuery = useAppStore((store) => store.query.length > 0)

  return (
    <>
      <Head>
        <title>Glyphs</title>
      </Head>
      <h1>
        <Image src="/favicon.svg" width={40} height={40} alt="Glyphs" />
        <span>Glyphs</span>
      </h1>
      {hasGlyph ? (
        <Glyph />
      ) : (
        <>
          <SearchForm />
          {hasQuery && <SearchResults />}
        </>
      )}
    </>
  )
}
