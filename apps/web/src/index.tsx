import { assertNonNullable } from '@glyphs/core'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './components/App'
import './styles/globals.css'

const app = assertNonNullable(document.getElementById('app'))

ReactDOM.createRoot(app).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
