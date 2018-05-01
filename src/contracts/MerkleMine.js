export const address = '0x8e306b005773bee6ba6a6e8972bc79d766cc15c8'

export const name = 'MerkleMine'

export const abi = [
  {
    constant: true,
    inputs: [],
    name: 'started',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'genesisBlock',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    name: 'generated',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'totalGenesisTokens',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'tokensPerAllocation',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'balanceThreshold',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'genesisRoot',
    outputs: [
      {
        name: '',
        type: 'bytes32',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'callerAllocationStartBlock',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'callerAllocationEndBlock',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'callerAllocationPeriod',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'token',
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'totalGenesisRecipients',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        name: '_token',
        type: 'address',
      },
      {
        name: '_genesisRoot',
        type: 'bytes32',
      },
      {
        name: '_totalGenesisTokens',
        type: 'uint256',
      },
      {
        name: '_totalGenesisRecipients',
        type: 'uint256',
      },
      {
        name: '_balanceThreshold',
        type: 'uint256',
      },
      {
        name: '_genesisBlock',
        type: 'uint256',
      },
      {
        name: '_callerAllocationStartBlock',
        type: 'uint256',
      },
      {
        name: '_callerAllocationEndBlock',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: '_recipient',
        type: 'address',
      },
      {
        indexed: true,
        name: '_caller',
        type: 'address',
      },
      {
        indexed: false,
        name: '_recipientTokenAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        name: '_callerTokenAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        name: '_block',
        type: 'uint256',
      },
    ],
    name: 'Generate',
    type: 'event',
  },
  {
    constant: false,
    inputs: [],
    name: 'start',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_recipient',
        type: 'address',
      },
      {
        name: '_merkleProof',
        type: 'bytes',
      },
    ],
    name: 'generate',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '_blockNumber',
        type: 'uint256',
      },
    ],
    name: 'callerTokenAmountAtBlock',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
]
