# Minecraft: Livepeer Token Miner

<img src="media/generated_proof.png" width="320">

## Getting Started

To install dependencies and start this dApp locally, run the following command:

```
yarn && yarn start
```

The command line output should display the url to visit in order to use this dApp.

## How to Mine LPT

<details><summary>Step 1: Load Your Account</summary><p>

Once you are logged into web3 wallet, the Dapp will automatically pull in the address, ETH, and LPT balances for your wallet.

<img src="media/load_your_account.png" width="720">

</p></details>

<details><summary>Step 2: Load Merkle Input Data</summary><p>

Input the url for the data, a compressed binary of all account addresses sorted. This is a big file and will take a while to load.

Click Load, it will start loading data, and simultaneously generating proof. This will take a long time - its a 50mb file.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<img src="media/generating_merkle_proof.gif" width="630">

Once loading completes, **and** if your selected account is eligible to mine, the proof will appear in the textarea below the url input.

<img src="media/generated_proof.png" width="720">

</p></details>

<details><summary>Step 3: Mine Your Token</summary><p>

You may now mine your LPT by clicking “Submit Proof”. Confirm your transaction details, submit, and once the transaction completes successfully, your LPT balance should show a value greater than “0.0”.

Congratulations, you’ve mined your token and may now participate as a delegator in the Livepeer protocol! 🎉

</p></details>

## Troubleshooting

<details><summary>It’s telling me Web3 is not enabled</summary><p>

In order to mine LPT, you will need to use a web3-enabled browser such as Mist or a browser extension such as MetaMask.

<img src="media/web3_not_enabled.png" width="720">

</p></details>

<details><summary>My account never loads</summary><p>

You may need to unlock your account through your browser extension or plugin. Also be sure you are connected to the Ethereum Main Network (not Rinkeby, Ropsten, etc).

<img src="media/stuck_loading.png" width="720">

</p></details>

<details><summary>I couldn’t generate a proof</summary><p>

Only account address with a balance >= .1 ETH prior at Ethereum block #5264265 are able to generate LPT through this dapp. If your address does not fit that criteria, you won’t be able to mine LPT with this dapp.

<img src="media/generate_proof_error.png" width="720">

> **Note**: There is also a possibility the input data you are providing is incorrect or not sorted properly. If you think this may be the case, please refer to the mining specification for more information: https://github.com/livepeer/merkle-mine/blob/master/SPEC.md

</p></details>
