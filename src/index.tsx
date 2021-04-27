import { enableMapSet } from 'immer'
import React from 'react'
import ReactDOM from 'react-dom'

import { App } from './components/App'
import { PUBLIC_URL } from './config/url'
import './styles/app.scss'

enableMapSet()

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      await navigator.serviceWorker.register(`${PUBLIC_URL}/sw.js`)
    } catch (e) {
      console.error('Failed to register service worker: ', e)
    }
  })
}
