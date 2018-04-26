const exp0rt = f => (exports[f.name] = f)

exp0rt(toArrayBuffer)
exp0rt(hexToArrayBuffer)
exp0rt(arrayBufferToHex)

function hexToArrayBuffer(addr) {
  const len = (addr.length / 2) >> 0
  const xs = new Uint8Array(len)
  const hex = addr.match(/.{2}/g)
  for (let i = 0; i < len; i++) {
    xs[i] = parseInt(hex[i], 16)
  }
  return xs.buffer
}

function arrayBufferToHex(buf) {
  const xs = new Uint8Array(buf)
  const { length } = xs
  let addr = ''
  for (let i = 0; i < length; i++) {
    addr += xs[i].toString(16).padStart(2, '0')
  }
  return addr
}

function toArrayBuffer(buffer) {
  const ab = new ArrayBuffer(buffer.length)
  const view = new Uint8Array(ab)
  for (let i = 0; i < buffer.length; ++i) {
    view[i] = buffer[i]
  }
  return ab
}
