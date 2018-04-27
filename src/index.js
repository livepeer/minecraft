import 'babel-polyfill'
import fs from 'fs'
import * as React from 'react'
import { render } from 'react-dom'
import { injectGlobal } from 'styled-components'
import { Provider } from './state'
import { setMerkleRoot, setMerkleProof } from './mutations'
import App from './App'
import accountsURL from './test.bin'
// import accountsURL from './accounts.bin'

console.clear()

const merkleWorker = new Worker('./merkleWorker.js')

let last = 0
fetch(accountsURL)
  .then(res => res.arrayBuffer())
  .then(accountsBuffer =>
    createMerkleTreeWithWorker(merkleWorker, accountsBuffer, prog => {
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
  .then(x => {
    setMerkleRoot(x)
    const addr = window.web3.eth.accounts[0].substr(2)
    return getMerkleProofWithWorker(merkleWorker, addr)
  })
  .then(({ addr, proof }) => setMerkleProof(proof))

export function createMerkleTreeWithWorker(
  w: Worker,
  buf: ArrayBuffer,
  onMessage?: number => void,
): string {
  w.postMessage(buf, [buf])
  return new Promise((resolve, reject) => {
    w.addEventListener('message', returnRoot)
    function returnRoot(msg) {
      const data =
        typeof msg.data === 'string' ? JSON.parse(msg.data) : msg.data
      if (data.type === 'root') {
        w.removeEventListener('message', returnRoot)
        resolve(data.value)
      } else {
        onMessage && onMessage(data.value)
      }
    }
  })
}

export function getMerkleProofWithWorker(w: Worker, addr: string): string {
  w.postMessage(
    JSON.stringify({
      type: 'proof',
      value: addr,
    }),
  )
  return new Promise((resolve, reject) => {
    w.addEventListener('message', returnProof)
    function returnProof(msg) {
      const data =
        typeof msg.data === 'string' ? JSON.parse(msg.data) : msg.data
      if (data.type === 'proof') {
        w.removeEventListener('message', returnProof)
        resolve(data.value)
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
