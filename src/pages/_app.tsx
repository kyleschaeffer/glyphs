import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useEffect, useRef } from 'react'
import '../styles/globals.css'
import { registerSearchWorker } from '../workers/search'
import { registerServiceWorker } from '../workers/sw'

const App = ({ Component, pageProps }: AppProps) => {
  const isMounted = useRef(false)

  const requestGlyphRef = useRef<(char: string) => void>()
  const requestQueryRef = useRef<(query: string) => void>()

  useEffect(() => {
    if (isMounted.current) {
      return
    }
    isMounted.current = true

    registerServiceWorker()

    const { requestGlyph, requestQuery } = registerSearchWorker({
      onGlyphResponse: (glyph) => console.log('Glyph:', glyph),
      onQueryResponse: (results) => console.log('Results:', results),
      onWorkerReady: () => console.log('Worker ready!'),
    })

    requestGlyphRef.current = requestGlyph
    requestQueryRef.current = requestQuery
  }, [])

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
      </Head>
      <Component {...pageProps} />
      <button onClick={() => requestGlyphRef.current?.('🇺🇦')}>Get: 🇺🇦</button>
      <button onClick={() => requestQueryRef.current?.('food')}>Query: food</button>
    </>
  )
}
export default App
