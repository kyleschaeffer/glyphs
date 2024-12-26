import { Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import { Splash } from './Splash'
import { InputController } from './controllers/InputController'
import { ThemeController } from './controllers/ThemeController'
import { WorkerController } from './controllers/WorkerController'
import BlockRoute from './routes/BlockRoute'
import GlyphRoute from './routes/GlyphRoute'
import NotFoundRoute from './routes/NotFound'
import ScriptRoute from './routes/ScriptRoute'
import SearchRoute from './routes/SearchRoute'

export function App() {
  return (
    <Suspense fallback={<Splash />}>
      <BrowserRouter>
        <ThemeController />
        <WorkerController />
        <InputController />
        <Routes>
          <Route path="/" element={<SearchRoute />} />
          <Route path="/block/:block" element={<BlockRoute />} />
          <Route path="/script/:script" element={<ScriptRoute />} />
          <Route path="/:glyph" element={<GlyphRoute />} />
          <Route element={<NotFoundRoute />} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  )
}
