import createState from 'react-copy-write'

const { Provider, Consumer, createMutator } = createState({
  address: '',
  dataLoading: false,
  ethBalance: '',
  identicon: '',
  merkleProof: '',
  merkleRoot: '',
  tokenBalance: '',
  treeProgress: 0,
  txError: null,
  txHash: '',
  txReceipt: null,
})

export { Provider, Consumer, createMutator }
