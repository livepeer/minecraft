export function createMerkleTree(
  w: Worker,
  buf: ArrayBuffer,
  onMessage?: number => void,
): string {
  w.postMessage(buf, [buf])
  return new Promise((resolve, reject) => {
    w.addEventListener('message', handler)
    function handler(msg) {
      const data =
        typeof msg.data === 'string' ? JSON.parse(msg.data) : msg.data
      if (data.type === 'root') {
        w.removeEventListener('message', handler)
        resolve(data.value)
      } else {
        onMessage && onMessage(data.value)
      }
    }
  })
}

export function getMerkleProof(w: Worker, addr: string): string {
  w.postMessage(
    JSON.stringify({
      type: 'proof',
      value: addr,
    }),
  )
  return new Promise((resolve, reject) => {
    w.addEventListener('message', handler)
    function handler(msg) {
      const data =
        typeof msg.data === 'string' ? JSON.parse(msg.data) : msg.data
      if (data.type === 'proof') {
        w.removeEventListener('message', handler)
        console.log(data)
        resolve(data.value)
      }
    }
  })
}