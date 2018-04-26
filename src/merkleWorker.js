import { createMerkleTree, getMerkleRoot, arrayBufferToHex } from './utils'

self.onmessage = onMessage

console.log('merkleWorker is initialized!')

function onMessage(msg) {
  console.log('got buffer', msg.data)
  const tree = createMerkleTree(msg.data)
  const root = getMerkleRoot(tree)
  const rootHex = arrayBufferToHex(root)
  self.postMessage(rootHex)
}
