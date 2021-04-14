import { UNICODE_VERSION } from './config/unicode'

const app = document.getElementById('app')
if (app) {
  app.innerHTML = `Unicode: <a href="#">${UNICODE_VERSION}</a>`
}

console.log('Hi loaded')
