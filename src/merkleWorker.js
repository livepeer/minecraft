import { createMerkleTree, getMerkleRoot, arrayBufferToHex } from './utils'

self.onmessage = onMessage

console.log('merkleWorker is initialized!')

function onMessage(msg) {
  console.log('got input buffer', msg.data)
  console.log('constructing merkle tree...')
  const tree = createMerkleTree(msg.data, x => {
    self.postMessage(
      JSON.stringify({
        type: 'progress',
        value: x,
      }),
    )
  })
  const root = getMerkleRoot(tree)
  const rootHex = arrayBufferToHex(root)
  console.log('done! ✨')
  self.postMessage({
    type: 'proof',
    value: rootHex,
  })
}
