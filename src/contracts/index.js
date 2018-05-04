import ethers from 'ethers'
import * as MerkleMine from './MerkleMine'
import * as ERC20 from './ERC20'
import { promisify } from '../utils'

export const provider = window.web3
  ? new ethers.providers.Web3Provider(web3.currentProvider)
  : ethers.providers.getDefaultProvider('homestead')

export const signer =
  typeof provider.getSigner === 'function' ? provider.getSigner() : provider

export const merkleMine = new ethers.Contract(
  MerkleMine.address,
  MerkleMine.abi,
  signer,
)

export const erc20 = new ethers.Contract(ERC20.address, ERC20.abi, signer)
