import { Suspense } from 'react'
import { LoadingView } from './LoadingView'

export function App() {
  return (
    <Suspense fallback={<LoadingView />}>
      <h1>Glyphs</h1>
    </Suspense>
  )
}
