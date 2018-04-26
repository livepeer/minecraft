const exp0rt = f => (exports[f.name] = f)

exp0rt(toArrayBuffer)
exp0rt(hexToArrayBuffer)
exp0rt(arrayBufferToHex)
exp0rt(sortArrayBuffers)

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

function sortArrayBuffers(xBuf, yBuf) {
  const { byteLength } = xBuf
  const xs = new Uint8Array(xBuf)
  const ys = new Uint8Array(yBuf)
  let x, y
  for (let i = 0; i < byteLength; i++) {
    x = xs[i]
    y = ys[i]
    if (x < y) return -1 // xBuf, yBuf
    if (x > y) return 1 // yBuf, xBuf
  }
  return 0
}

function toArrayBuffer(buffer) {
  const ab = new ArrayBuffer(buffer.length)
  const view = new Uint8Array(ab)
  for (let i = 0; i < buffer.length; ++i) {
    view[i] = buffer[i]
  }
  return ab
}
