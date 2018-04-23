import createState from 'react-copy-write'
import Eth from 'ethjs-query'
import EthContract from 'ethjs-contract'
import MerkleMineArtifact from './artifacts/MerkleMine'
import ERC20Artifact from './artifacts/ERC20'
import { awaitMinedTx, sleep } from './utils'

const { Provider, Consumer, createMutator } = createState({
  mode: 'generateToken', // generateProof || generateRawTx
  address: window.web3.eth.accounts[0],
  tokenBalance: 0,
  proof: '0x000000',
  generateProof: {
    dataUrl: '',
    data: null,
    loading: false,
    generatingProof: false,
    errors: [],
  },
  generateToken: {
    txHash: '',
    txReceipt: null,
    errors: [],
  },
  generateRawTx: {
    rawTx: '',
    errors: [],
  },
})

const eth = (window.eth = new Eth(web3.currentProvider))
const contract = new EthContract(eth)

const MerkleMine = contract(MerkleMineArtifact.abi)
const merkleMine = MerkleMine.at('0x1bac05dbfa98f82ec2268b9a46e6ab429dcdb57b')

const ERC20 = contract(ERC20Artifact.abi)
const erc20 = ERC20.at('0xAcD07c5d6b4c90a56cd96b273c9045972Ca5aa94')

console.log(merkleMine, erc20)

export { Provider, Consumer }

export const changeMode = createMutator((state, e) => {
  const { value } = e.target
  state.mode = value
})

export const setGenerateTokenSubmitting = createMutator((state, submitting) => {
  state.generateToken = Object.assign(state.generateToken, { submitting })
  console.log(state.generateToken.submitting, submitting)
})

export const setTxHash = createMutator((state, hash) => {
  state.generateToken.txHash = hash
})

export const setTxReceipt = createMutator((state, receipt) => {
  state.generateToken.txReceipt = receipt
})

export const setGenerateTokenErrors = createMutator((state, errors) => {
  state.generateToken.errors = errors
})

export async function generateToken(address, proof, txParams) {
  try {
    setTxHash('')
    setTxReceipt(null)
    setGenerateTokenSubmitting(true)
    console.log(address, proof, txParams)
    const txHash = await merkleMine.generate(address, proof, txParams)
    setTxHash(txHash)
    console.log('Transaction sent!', txHash)
    const txReceipt = await awaitMinedTx(txHash)
    setTxReceipt(txReceipt)
    console.log('Transaction mined!', txReceipt)
    if (txReceipt.status === '0x0') {
      throw new Error('Transaction failed')
    }
  } catch (err) {
    console.error(err)
    setGenerateTokenErrors([err])
  } finally {
    setGenerateTokenSubmitting(false)
  }
}
