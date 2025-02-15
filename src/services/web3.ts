import { ethers, Signer } from 'ethers'
import SBT_CONTRACT_ABI from '../abi/nodeContractAbi.json'
import { CURRENT_SEASON } from '../config/config.ts'

export async function checkSBTOwnership(
  contractAddress: string,
  walletAddress: string,
  provider: Signer
) {
  const sbtContract = new ethers.Contract(contractAddress, SBT_CONTRACT_ABI.abi, provider)

  try {
    const tokenId = import.meta.env.VITE_CHAIN === 'testnet' ? 1 : CURRENT_SEASON

    const status = await sbtContract.balanceOf(walletAddress, tokenId)

    return status.toNumber() > 0
  } catch (error) {
    return false
  }
}

export async function claimSBT(contractAddress: string, signer: Signer, address: string) {
  const sbtContract = new ethers.Contract(contractAddress, SBT_CONTRACT_ABI.abi, signer)

  try {
    const nodesRT =
      import.meta.env.VITE_CHAIN === 'testnet'
        ? await import(`../data/test-node/s${CURRENT_SEASON}Nodes.json`)
        : await import(`../data/node/s${CURRENT_SEASON}Nodes.json`)

    let proof = []
    const index = nodesRT.leaves.findIndex((info: Record<string, string>) => {
      return address.toLocaleLowerCase() === info.account.toLocaleLowerCase()
    })

    if (index >= 0) {
      proof = nodesRT.leaves[index].proof
    } else {
      throw new Error(`no proof`)
    }

    const tokenId = import.meta.env.VITE_CHAIN === 'testnet' ? 1 : CURRENT_SEASON

    const tx = await sbtContract.claim(tokenId, proof)
    await tx.wait()
    return true
  } catch (error: unknown) {
    if ((error as { code?: number }).code === 4001) {
      throw new Error('User rejected the transaction')
    }
    throw error
  }
}

export const handleExpiration = async (contractAddress: string, signer: Signer) => {
  const sbtContract = new ethers.Contract(contractAddress, SBT_CONTRACT_ABI.abi, signer)

  try {
    return await sbtContract.expirations(CURRENT_SEASON)
  } catch (error) {
    return 0
  }
}
