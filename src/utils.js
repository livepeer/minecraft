import * as React from 'react'

export const consumeWith = Component => {
  return state => <Component {...state} />
}

export const prop = k => o => o[k]

export async function awaitMinedTx(txHash) {
  let txReceipt
  while (!txReceipt) {
    try {
      txReceipt = await eth.getTransactionReceipt(txHash)
    } catch (err) {
      throw err
    }
  }
  return txReceipt
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
