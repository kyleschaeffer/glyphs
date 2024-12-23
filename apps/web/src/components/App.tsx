import { Suspense } from 'react'
import { LoadingView } from './LoadingView'
import { SearchController } from './SearchController'

export function App() {
  return (
    <Suspense fallback={<LoadingView />}>
      <SearchController>
        <h1>Glyphs</h1>
      </SearchController>
    </Suspense>
  )
}
