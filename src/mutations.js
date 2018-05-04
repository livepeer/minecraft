import Identicon from 'identicon.js'
import { createMutator } from './state'
import { erc20, merkleMine, provider } from './contracts'
import { promisify, getQueryVariable } from './utils'
import { createMerkleTree, getMerkleProof } from './worker-utils'

const useQueryString = !!getQueryVariable('address')

const getAccounts = !useQueryString
  ? promisify(window.web3.eth.getAccounts)
  : () => {
      let addr = '0x'.padEnd(20, '0')
      setState(state => {
        addr = state.address
      })
      return [addr]
    }

const getEthBalance = !useQueryString
  ? promisify(window.web3.eth.getBalance)
  : provider.getBalance.bind(provider)

const PROOFS = {}

export const setState = createMutator((state, f) => {
  f(state)
})

export async function initializeAccount(worker) {
  const [address] = await getAccounts()
  const ethBalance = await getEthBalance(address)
  const tokenBalance = await erc20.balanceOf(address)
  setState(state => {
    state.address = address
    state.ethBalance = ethBalance.toString(10)
    state.tokenBalance = tokenBalance.toString(10)
    state.identicon =
      'data:image/svg+xml;base64,' +
      new Identicon(address.substr(2), {
        background: [0, 0, 0, 0],
        size: 32,
        format: 'svg',
      }).toString()
    if (!(address in PROOFS) && state.treeProgress === 1) {
      generateProof(worker, address, state.merkleRoot)
    } else if (address in PROOFS) {
      state.merkleProof = PROOFS[address]
    }
  })
}

export async function fetchData(url, cb) {
  setState(state => {
    state.dataLoading = true
  })
  const res = await fetch(url)
  const buf = await res.arrayBuffer()
  setState(state => {
    state.dataLoading = false
  })
  cb(buf)
}

export async function generateTreeAndProof(worker, address, buf) {
  const initialProgress = 0.2
  setState(state => {
    // set initial progress percentage
    state.treeProgress = initialProgress
  })
  const merkleRoot = await createMerkleTree(worker, buf, n => {
    if (n <= initialProgress) return
    setState(state => {
      state.treeProgress = n
    })
  })
  generateProof(worker, address, merkleRoot)
}

export async function generateProof(worker, address, merkleRoot) {
  setState(state => {
    state.generatingProof = true
  })
  const merkleProof = await getMerkleProof(worker, address.substr(2))
  setState(state => {
    PROOFS[address] = merkleProof
    state.generatingProof = false
    state.merkleRoot = merkleRoot
    state.merkleProof = merkleProof
  })
}

export async function generateToken(address, proof) {
  try {
    setState(state => {
      state.txHash = ''
      state.txReceipt = null
      state.txError = null
    })
    console.log('Submitting transaction...', address, proof)
    const txRequest = await merkleMine.generate(address, proof)
    const txHash = txRequest.hash
    setState(state => {
      state.txHash = txHash
    })
    console.log('Transaction submitted!', txHash)
    console.log('Waiting for transaction to be mined...')
    const txResponse = await provider.waitForTransaction(txHash)
    console.log('Transaction accepted!', txResponse)
    console.log('Waiting for transaction receipt...')
    const txReceipt = await provider.getTransactionReceipt(txHash)
    setState(state => {
      state.txReceipt = txReceipt
    })
    console.log('Transaction mined!', txReceipt)
    if (!txReceipt.status) {
      throw new Error('Transaction failed')
    }
  } catch (err) {
    console.error(err)
    setState(state => {
      state.txError = err
    })
  }
}
