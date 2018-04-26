import * as React from 'react'
import styled from 'styled-components'
import { Consumer } from './state'
import { changeMode, generateToken } from './mutations'
import { prop } from './utils'

const App = styled(({ className }) => {
  return (
    <div className={className}>
      <h1>Mine Livepeer Token</h1>
      <Consumer
        selector={[
          prop('address'),
          prop('mode'),
          prop('tokenBalance'),
          prop('merkleRoot'),
        ]}
      >
        {selectorController}
      </Consumer>
      <hr />
      <Consumer>{viewController}</Consumer>
    </div>
  )
})`
  // styles go here
`

const selectorController = ([address, mode, tokenBalance, merkleRoot]) => {
  // console.log(address, mode)
  return (
    <React.Fragment>
      <p>address: {address}</p>
      <p>token balance: {(tokenBalance / 10e18).toFixed(2)} LPT</p>
      <p>merkle root: 0x{merkleRoot}</p>
      <ModeSelector mode={mode} />
    </React.Fragment>
  )
}

const ModeSelector = styled(({ className, mode }) => (
  <select className={className} onChange={changeMode} value={mode}>
    <option value="generateProof" disabled>
      Generate Proof
    </option>
    <option value="generateToken">Generate Token</option>
    <option value="generateRawTx" disabled>
      Generate Raw Transaction
    </option>
  </select>
))`
  // styles go here
`

const viewController = state => {
  const { mode, address, proof } = state
  const props = Object.assign(
    {
      address,
      proof,
    },
    state[mode],
  )
  // console.log(props)
  if (mode === 'generateToken') return <GenerateTokenMode {...props} />
  return null
}

// const GenerateTokenProof = styled(

// )`
//   // styles go here...
// `

const GenerateTokenMode = styled(
  ({ className, address, errors, proof, submitting, txHash, txReceipt }) => (
    <div className={className}>
      <p>Submit your proof to generate LPT.</p>
      {!errors.length ? null : <p className="error">{errors[0].message}</p>}
      <div>
        <label>Address</label>
        <br />
        <input
          id="addr"
          type="text"
          defaultValue={address}
          disabled={!!txHash}
        />
        <br />
        <label>Proof</label>
        <br />
        <input
          id="proof"
          type="text"
          defaultValue={proof}
          disabled={!!txHash}
        />
        <button
          disabled={!((txHash && txReceipt) || (!txHash && !txReceipt))}
          onClick={async e => {
            const $addr = document.getElementById('addr')
            const $proof = document.getElementById('proof')
            generateToken($addr.value, $proof.value, { from: address })
          }}
        >
          {(txHash && txReceipt) || (!txHash && !txReceipt)
            ? 'Submit'
            : 'Submitting...'}
        </button>
        {!txReceipt ? null : (
          <pre>
            <code>{JSON.stringify(txReceipt, null, 2)}</code>
          </pre>
        )}
      </div>
    </div>
  ),
)`
  .error {
    font-weight: bold;
    color: red;
  }
`

export default App
