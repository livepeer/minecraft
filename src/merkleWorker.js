import {
  createMerkleTree,
  getMerkleRoot,
  getMerkleProof,
  hexToArrayBuffer,
  indexOfArrayBuffer,
  arrayBufferToHex,
} from './utils'

self.onmessage = onMessage

console.log('merkleWorker is initialized!')

const PROOFS = new Map()
let INPUT, TREE
function onMessage(msg) {
  const data = typeof msg.data === 'string' ? JSON.parse(msg.data) : msg.data
  console.log(data)
  switch (data.type) {
    case 'proof': {
      console.log('got proof request', data.value)
      let proof = PROOFS.get(data.value)
      if (!proof) {
        const addr = hexToArrayBuffer(data.value)
        const index = indexOfArrayBuffer(TREE, addr)
        console.log('found at index', index)
        proof = getMerkleProof(TREE, index)
        PROOFS.set(data.value, proof)
      }
      self.postMessage({
        type: 'proof',
        value: {
          address: data.value,
          proof: arrayBufferToHex(proof),
        },
      })
      console.log('done! ✨')
      break
    }
    default: {
      console.log('got input buffer', msg.data)
      console.log('constructing merkle tree...')
      INPUT = msg.data
      TREE = createMerkleTree(INPUT, x => {
        self.postMessage(
          JSON.stringify({
            type: 'progress',
            value: x,
          }),
        )
      })
      const root = getMerkleRoot(TREE)
      const rootHex = arrayBufferToHex(root)
      console.log('done! ✨')
      self.postMessage({
        type: 'root',
        value: rootHex,
      })
    }
  }
}
