import { assertNonNullable } from '@glyphs/core'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './components/App'
import './styles/globals.css'
import { registerServiceWorker } from './workers/sw'

const app = assertNonNullable(document.getElementById('app'))

ReactDOM.createRoot(app).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

void registerServiceWorker()
