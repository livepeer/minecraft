import 'babel-polyfill'
import fs from 'fs'
import * as React from 'react'
import { render } from 'react-dom'
import { injectGlobal } from 'styled-components'
import { Provider } from './state'
import { setMerkleRoot } from './mutations'
import App from './App'
import accountsURL from './test.bin'
// import accountsURL from './accounts.bin'

console.clear()

const merkleWorker = new Worker('./merkleWorker.js')

let last = 0
fetch(accountsURL)
  .then(res => res.arrayBuffer())
  .then(accountsBuffer =>
    createMerkleProofWithWorker(merkleWorker, accountsBuffer, prog => {
      if (prog - last > 0.01 || prog === 1 || prog === 0) {
        injectGlobal`
        :root {
          --progress: ${prog * 100}%;
        }
        `
        last = prog
      }
    }),
  )
  .then(setMerkleRoot)

export function createMerkleProofWithWorker(
  w: Worker,
  buf: ArrayBuffer,
  onMessage?: number => void,
): string {
  w.postMessage(buf, [buf])
  return new Promise((resolve, reject) => {
    w.addEventListener('message', returnProof)
    function returnProof(msg) {
      const data =
        typeof msg.data === 'string' ? JSON.parse(msg.data) : msg.data
      if (data.type === 'proof') {
        w.removeEventListener('message', returnProof)
        resolve(data.value)
      } else {
        onMessage && onMessage(data.value)
      }
    }
  })
}

render(
  <Provider>
    <App />
  </Provider>,
  document.getElementById('root'),
)
