import * as React from 'react'
import styled from 'styled-components'
import { formatEther } from 'ethers/utils'
import { Consumer } from './state'
import {
  initializeAccount,
  fetchData,
  generateToken,
  generateTreeAndProof,
} from './mutations'
import { prop, promisify } from './utils'

const App = styled(
  class AppComponent extends React.Component {
    componentDidMount() {
      this.id = setInterval(() => initializeAccount(this.props.worker), 1000)
    }
    componentWillUnmount() {
      clearInterval(this.id)
    }
    render() {
      const {
        address,
        className,
        dataLoading,
        ethBalance,
        identicon,
        merkleRoot,
        merkleProof,
        mode,
        tokenBalance,
        treeProgress,
        txError,
        txHash,
        txReceipt,
        worker,
      } = this.props
      return (
        <main className={className}>
          <h1 style={{ display: 'flex', alignItems: 'center' }}>
            <Logo style={{ width: 32, marginRight: 16 }} /> Livepeer Token Miner
          </h1>
          <Card>
            <H2>Account</H2>
            {!address ? (
              <p style={{ margin: 0 }}>
                Loading...<br />
                <br />
                <small>
                  <strong>Note:</strong> if this takes a while, you may need to
                  unlock your web3 account
                </small>
              </p>
            ) : (
              <AccountCard
                address={address}
                ethBalance={ethBalance}
                src={identicon}
                tokenBalance={tokenBalance}
              />
            )}
            <hr />
            <H2>Merkle Data</H2>
            <MerkleDataLoader
              loading={dataLoading}
              treeProgress={treeProgress}
              onLoad={res => {
                generateTreeAndProof(worker, address, res)
              }}
            />
            <LoadingBar
              progress={treeProgress}
              fail={!merkleProof && treeProgress === 1}
            />
            <MerkleCard
              message={
                treeProgress > 0 && treeProgress < 1
                  ? 'Generating...'
                  : !merkleProof && treeProgress
                    ? 'Could not generate a proof for this account address :('
                    : ''
              }
              proof={merkleProof}
              root={merkleRoot}
              txReceipt={txReceipt}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              {!merkleProof ? null : (
                <React.Fragment>
                  {!txError ? null : (
                    <p
                      style={{
                        color: 'red',
                        fontWeight: 'bold',
                        width: '100%',
                      }}
                    >
                      ❗{txError.message}
                    </p>
                  )}
                  <SubmitButton
                    disabled={txHash && !txReceipt}
                    onClick={() => {
                      generateToken(address, `0x${merkleProof}`)
                    }}
                  >
                    {txHash && !txReceipt ? 'Submitting...' : 'Submit Proof'}
                  </SubmitButton>
                </React.Fragment>
              )}
            </div>
          </Card>
        </main>
      )
    }
  },
)`
  max-width: 720px;
  margin: 32px auto;
`

const Logo = props => (
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    viewBox="0 0 150 150"
    {...props}
  >
    <g>
      <path d="M150,88.7V61.3h-27.3v27.4H150z" />
      <g>
        <path d="M0,88.7h27.4V61.3H0V88.7z" />
        <path d="M0,27.3h27.4V0H0V27.3z" />
        <path d="M0,150h27.4v-27.3H0V150z" />
      </g>
      <g>
        <path d="M61.3,57.5h27.4V30.2H61.3V57.5z" />
        <path d="M61.3,118.8h27.4V91.5H61.3V118.8z" />
      </g>
    </g>
  </svg>
)

const Card = styled.div`
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.25);
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
`

const H2 = styled.h2`
  margin: 0;
  padding-bottom: 8px;
`

const LoadingBar = styled.div`
  width: ${({ progress }) => progress * 100}%;
  height: ${({ progress }) => (progress ? 8 : 0)}px;
  background: ${({ fail }) => (fail ? 'red' : 'green')};
  transition: width ${({ progress }) => (progress > 0.2 ? '.3s' : '30s')} linear;
  margin-bottom: 8px;
`

const SubmitButton = styled.button`
  padding: 16px;
  font-size: 18px;
  clear: both;
  color: #fff;
  background: #000;
  border: none;
  border-radius: 0px;
  cursor: pointer;
  width: 320px;
  :disabled {
    opacity: 0.75;
  }
`

const MerkleDataLoader = styled(
  class MerkleDataLoaderComponent extends React.Component {
    constructor(props) {
      super(props)
      this.dataUrl = ''
      this.onLoad = this.onLoad.bind(this)
    }
    onLoad() {
      fetchData(this.dataUrl, this.props.onLoad)
    }
    render() {
      const { className, loading, treeProgress } = this.props
      const disabled = loading || (treeProgress > 0 && treeProgress < 1)
      return (
        <div className={className}>
          <label>Input Data URL</label>
          <div className="form">
            <input
              type="text"
              placeholder="Enter a url with sorted ETH address data to generate your proof"
              disabled={disabled}
              onBlur={e => {
                this.dataUrl = e.target.value
              }}
              onKeyDown={e => {
                this.dataUrl = e.target.value
                if (e.keyCode === 13) this.onLoad()
              }}
            />
            <button disabled={disabled} onClick={this.onLoad}>
              {disabled ? 'Loading...' : 'Load'}
            </button>
          </div>
        </div>
      )
    }
  },
)`
  margin-bottom: 8px;
  > label {
    display: block;
    padding-bottom: 8px;
  }
  .form {
    display: flex;
    input {
      width: 100%;
      height: 32px;
    }
    button {
      font-size: 16px;
      width: 100px;
      height: 32px;
    }
  }
`

const AccountCard = styled(
  ({ address, className, ethBalance, src, tokenBalance }) => (
    <Card className={className}>
      <div className="identity">
        <img src={src} />{' '}
        <h3>
          <code>{address}</code>
        </h3>
      </div>
      <div className="info">
        <table>
          <tbody>
            <tr>
              <td>ETH</td>
              <td>
                <code>{formatEther(ethBalance)}</code>
              </td>
            </tr>
            <tr>
              <td>LPT</td>
              <td>
                <code>{formatEther(tokenBalance)}</code>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  ),
)`
  > .identity {
    display: flex;
    align-items: center;
    padding-bottom: 7px;
    border-bottom: 1px solid #eee;
    white-space: nowrap;
    overflow: hidden;
    > img {
      height: 40px;
      width: 40px;
      padding-right: 8px;
    }
    > h3 {
      margin: 0;
      overflow: auto;
    }
  }
  > .info {
    padding-top: 8px;
    code {
      font-size: 16px;
      padding: 0 8px;
    }
  }
`

const MerkleCard = styled(
  ({ className, message, proof = '', root = '', txReceipt }) => (
    <Card className={className}>
      <table>
        <tbody>
          {/*<tr>
          <td>Root</td>
          <td>
            <input
              readOnly
              type="text"
              value={`0x${root}`}
              className="merkleRoot"
            />
          </td>
          </tr>*/}
          <tr>
            <td>Proof</td>
            <td>
              <textarea
                readOnly
                value={message ? message : proof ? `0x${proof}` : 'N/A'}
                className="merkleProof"
              />
            </td>
          </tr>
          {!txReceipt ? null : (
            <tr>
              <td>txReceipt</td>
              <td>
                <textarea
                  readOnly
                  value={JSON.stringify(txReceipt, null, 2)}
                  className="txReceipt"
                />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </Card>
  ),
)`
  table {
    width: 100%;
    tr {
      min-height: 32px;
      td:first-child {
        width: 50px;
      }
    }
  }

  textarea,
  input {
    display: block;
    width: 100%;
  }

  textarea.merkleProof {
    background: ${({ proof }) => (proof ? 'rgba(0, 255, 0, .1)' : 'inherit')};
  }

  textarea.txReceipt {
    min-height: 320px;
    background: ${({ txReceipt }) =>
      txReceipt && !txReceipt.status ? 'rgba(255, 0, 0, .1)' : 'inherit'};
  }
`

export default function(deps) {
  return <Consumer>{props => <App {...props} {...deps} />}</Consumer>
}
