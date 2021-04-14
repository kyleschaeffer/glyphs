import { UNICODE_VERSION } from './config/unicode'

const app = document.getElementById('app')
if (app) {
  app.innerHTML = `Unicode: ${UNICODE_VERSION}`
}

console.log('Hi loaded')
