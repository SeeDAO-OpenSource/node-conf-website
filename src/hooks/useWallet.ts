import { useState, useCallback } from 'react'
import { checkSBTOwnership, claimSBT, handleExpiration } from '../services/web3'
import { useSelector } from 'react-redux'

import { useEthersProvider, useEthersSigner } from './ethersNew'
import CHAIN from '../utils/chain.ts'
import { USE_NETWORK } from '../utils/constant.ts'
import InitState from '../store/initState.ts'

export function useWallet() {
  const [claiming, setClaiming] = useState(false)
  const address = useSelector((store: typeof InitState) => store.account)
  const signer = useEthersSigner({ chainId: CHAIN[USE_NETWORK].chainId })
  const provider = useEthersProvider({ chainId: CHAIN[USE_NETWORK].chainId })

  const claim = useCallback(
    async (contractAddress: string) => {
      if (!address) throw new Error('Wallet not connected')
      if (!signer) return

      setClaiming(true)
      try {
        await claimSBT(contractAddress, signer, address)
        return true
      } catch (error) {
        console.error('Failed to claim SBT:', error)
        throw error
      } finally {
        setClaiming(false)
      }
    },
    [address, signer]
  )

  const checkOwnership = useCallback(
    async (contractAddress: string) => {
      if (!address) return false
      if (!signer) return false
      return checkSBTOwnership(contractAddress, address, signer)
    },
    [address, signer]
  )

  const checkExpiration = useCallback(
    async (contractAddress: string) => {
      if (!address) return false
      if (!signer) return false
      return await handleExpiration(contractAddress, signer)
    },
    [address, provider]
  )

  return {
    claiming,
    checkExpiration,
    // connect,
    claim,
    checkOwnership,
  }
}
