console.clear()
import 'babel-polyfill'
import fs from 'fs'
import * as React from 'react'
import { render } from 'react-dom'
import { injectGlobal } from 'styled-components'
import { Provider } from './state'
import { setMerkleRoot, setMerkleProof } from './mutations'
import App from './App'
// import testURL from './test.bin'
// import accountsURL from './accounts.bin'
// console.log(testURL)
// console.log(accountsURL)

render(
  <Provider>
    <App worker={new Worker('./merkleWorker.js')} />
  </Provider>,
  document.getElementById('root'),
)
