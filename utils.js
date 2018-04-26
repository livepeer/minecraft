const exp0rt = f => (exports[f.name] = f)

exp0rt(toHexString)
exp0rt(uint32ArrayToAddrs)
exp0rt(addrToUint32Array)
exp0rt(toArrayBuffer)

function toHexString(x) {
  return x.toString(16).padStart(8, '0')
}

function uint32ArrayToAddrs(xs) {
  const offset = 5
  let i = 0
  let addr = ''
  for (const x of xs) {
    addr += toHexString(x)
    if (++i % 5 === 0) addr += '\n'
  }
  return addr
}

function addrToUint32Array(addr) {
  const xs = new Uint32Array(5)
  const hex = addr.match(/.{8}/g)
  // console.log(hex)
  for (let i = 0; i < 5; i++) {
    xs[i] = parseInt(hex[i], 16)
  }
  return xs
}

function toArrayBuffer(buffer) {
  const ab = new ArrayBuffer(buffer.length)
  const view = new Uint8Array(ab)
  for (let i = 0; i < buffer.length; ++i) {
    view[i] = buffer[i]
  }
  return ab
}
