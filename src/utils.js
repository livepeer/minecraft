import * as React from 'react'
import { utils } from 'ethers'
import { keccak_256 as keccak256 } from 'js-sha3'

export const consumeWith = Component => {
  return state => <Component {...state} />
}

export const prop = k => o => o[k]

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function promisify(f) {
  return (...args) =>
    new Promise((resolve, reject) => {
      f(...args, (err, res) => {
        if (err) return reject(err)
        resolve(res)
      })
    })
}

export const hashLeaf = keccak256.buffer

export function hashParent(a: ArrayBuffer, b: ArrayBuffer): ArrayBuffer {
  return hashLeaf(
    sortArrayBuffers(a, b) === 1
      ? // b < a
        mergeArrayBuffers(b, a)
      : // a < b || a ===
        mergeArrayBuffers(a, b),
  )
}

export function verifyProof(
  /** a */
  leaf: ArrayBuffer,
  /** hashLeaf(b) */
  proof: ArrayBuffer,
  /** hashParent(a, b) */
  root: ArrayBuffer,
): boolean {
  const a = hashLeaf(leaf)
  const b = proof
  const c =
    sortArrayBuffers(a, b) === 1
      ? mergeArrayBuffers(b, a)
      : mergeArrayBuffers(a, b)
  // hash([hash(A), proof].sort(pairwise)) === root
  return arrayBufferEqualTo(hashLeaf(c), root)
}

export function hexToArrayBuffer(addr: string): ArrayBuffer {
  const len = (addr.length / 2) >> 0
  const xs = new Uint8Array(len)
  const hex = addr.match(/.{2}/g)
  for (let i = 0; i < len; i++) {
    xs[i] = parseInt(hex[i], 16)
  }
  return xs.buffer
}

export function arrayBufferToHex(buf: ArrayBuffer): string {
  const xs = new Uint8Array(buf)
  const { length } = xs
  let addr = ''
  for (let i = 0; i < length; i++) {
    addr += xs[i].toString(16).padStart(2, '0')
  }
  return addr
}

export function sortArrayBuffers(xBuf: ArrayBuffer, yBuf: ArrayBuffer): number {
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

export function mergeArrayBuffers(
  xBuf: ArrayBuffer,
  yBuf: ArrayBuffer,
): ArrayBuffer {
  const xLen = xBuf.byteLength
  const yLen = yBuf.byteLength
  const xs = new Uint8Array(xLen + yLen)
  xs.set(new Uint8Array(xBuf), 0)
  xs.set(new Uint8Array(yBuf), xLen)
  return xs.buffer
}

export function mergeAllArrayBuffers(...bufs: ArrayBuffer[]): ArrayBuffer {
  const { byteLength } = bufs[0]
  const { length } = bufs
  const totalBytes = byteLength * length
  const xs = new Uint8Array(totalBytes)
  for (let i = 0; i < length; i++) {
    xs.set(new Uint8Array(bufs[i]), i * byteLength)
  }
  return xs.buffer
}

export function arrayBufferEqualTo(buf0, buf1) {
  const { byteLength } = buf0
  if (buf0.byteLength !== buf1.byteLength) return false
  const a = new Uint8Array(buf0)
  const b = new Uint8Array(buf1)
  for (let i = 0; i < byteLength; i++) {
    if (a[i] !== b[i]) return false
  }
  return true
}

export function createMerkleTree(input: ArrayBuffer): ArrayBuffer[][] {
  const tree: ArrayBuffer[] = []
  // create outmost branch
  const addrLen = 20
  const inputByteLength = input.byteLength
  const len = (inputByteLength / addrLen) >> 0
  const totalBranches = Math.ceil(inputByteLength / addrLen / 2) + 1
  for (let i = 0; i < totalBranches; i++) {
    tree[i] = []
  }
  const xs = new Uint8Array(input)
  for (let i = 0; i < len; i++) {
    const a = i * addrLen
    const b = a + 20
    const buf = xs.slice(a, b).buffer
    tree[0][i] = hashLeaf(buf)
  }
  for (let i = 0; i < totalBranches - 1; i++) {
    const branch = tree[i]
    const { length } = branch
    const len = Math.ceil(length / 2)
    const nextBranch = tree[i + 1]
    for (let j = 0; j < len; j++) {
      const n = j * 2
      const a = branch[n]
      const b = branch[n + 1]
      if (!a || !b) {
        nextBranch[j] = a || b
      } else {
        nextBranch[j] = hashParent(a, b)
      }
    }
  }
  return tree
}

export function getMerkleRoot(tree: ArrayBuffer[][]): ArrayBuffer {
  const rootBranch = tree[tree.length - 1]
  const root = rootBranch[rootBranch.length - 1]
  return root
}