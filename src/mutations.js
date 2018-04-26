import { createMutator } from './state'
import { merkleMine, provider } from './contracts'

export const changeMode = createMutator((state, e) => {
  const { value } = e.target
  state.mode = value
})

export const setViewState = createMutator((state, key, nextState) => {
  if (!(key in state)) throw new Error(`View "${key}" is not part of the state`)
  state[key] = Object.assign(state[key], nextState)
})

export async function generateToken(address, proof, txParams) {
  try {
    setViewState('generateToken', {
      txHash: '',
      txReceipt: null,
      errors: [],
    })
    console.log('Submitting transaction...', address, proof)
    const txRequest = await merkleMine.generate(address, proof)
    const txHash = txRequest.hash
    setViewState('generateToken', {
      txHash,
    })
    console.log('Transaction submitted!', txHash)
    console.log('Waiting for transaction to be mined...')
    const txResponse = await provider.waitForTransaction(txHash)
    console.log('Transaction accepted!', txResponse)
    console.log('Waiting for transaction receipt...')
    const txReceipt = await provider.getTransactionReceipt(txHash)
    setViewState('generateToken', {
      txReceipt,
    })
    console.log('Transaction mined!', txReceipt)
    if (!txReceipt.status) {
      throw new Error('Transaction failed')
    }
  } catch (err) {
    console.error(err)
    setViewState('generateToken', {
      errors: [err],
    })
  }
}
