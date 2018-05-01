console.clear()
import 'babel-polyfill'
import fs from 'fs'
import React from 'react'
import { render } from 'react-dom'
import { injectGlobal } from 'styled-components'
import { Provider } from './state'
import App from './App'

injectGlobal`
* {
  box-sizing: border-box;
  margin: 0;
}
`

// Load stringified worker so we can keep all JS in a single file
const script = fs.readFileSync(__dirname + '/merkleWorker.min.js', 'utf8')
const scriptBlob = new Blob([script], { type: 'application/javascript' })
const scriptUrl = URL.createObjectURL(scriptBlob)

render(
  <Provider>
    <App worker={new Worker(scriptUrl)} />
  </Provider>,
  document.getElementById('root'),
)
