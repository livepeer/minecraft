import createState from 'react-copy-write'

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

export { Provider, Consumer, createMutator }
