import { ethers, Signer } from 'ethers'
import SBT_CONTRACT_ABI from '../abi/nodeContractAbi.json'
import { CURRENT_SEASON } from '../config/config.ts'
import { Provider } from '@ethersproject/abstract-provider'

// export const SBT_CONTRACT_ABI = [
//   'function balanceOf(address owner) view returns (uint256)',
//   'function ownerOf(uint256 tokenId) view returns (address)',
//   'function claim() external',
// ];

// export async function connectWallet() {
//   if (typeof window.ethereum !== 'undefined') {
//     try {
//       // Request account access
//       const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
//
//       // Check if we're on Polygon network
//       const chainId = await window.ethereum.request({ method: 'eth_chainId' });
//       if (chainId !== '0x89') { // 137 in hex
//         try {
//           // Try to switch to Polygon
//           await window.ethereum.request({
//             method: 'wallet_switchEthereumChain',
//             params: [{ chainId: '0x89' }],
//           });
//         } catch (switchError: any) {
//           // If the network is not added, add it
//           if (switchError.code === 4902) {
//             await window.ethereum.request({
//               method: 'wallet_addEthereumChain',
//               params: [{
//                 chainId: '0x89',
//                 chainName: 'Polygon Mainnet',
//                 nativeCurrency: {
//                   name: 'MATIC',
//                   symbol: 'MATIC',
//                   decimals: 18
//                 },
//                 rpcUrls: ['https://polygon-rpc.com/'],
//                 blockExplorerUrls: ['https://polygonscan.com/']
//               }]
//             });
//           } else {
//             throw switchError;
//           }
//         }
//       }
//
//       return accounts[0];
//     } catch (error) {
//       console.error('User denied account access or network switch failed');
//       return null;
//     }
//   } else {
//     window.open('https://metamask.io/download/', '_blank');
//     return null;
//   }
// }

export async function checkSBTOwnership(
  contractAddress: string,
  walletAddress: string,
  provider: Provider
) {
  // if (!window.ethereum) return false;

  // const provider = new ethers.providers.Web3Provider(window.ethereum);
  const sbtContract = new ethers.Contract(contractAddress, SBT_CONTRACT_ABI.abi, provider)

  try {
    // const owner = await sbtContract.ownerOf(tokenId);
    // return owner.toLowerCase() === walletAddress.toLowerCase();

    const status = await sbtContract.balanceOf(walletAddress, CURRENT_SEASON)

    return status.toNumber() > 0
  } catch (error) {
    return false
  }
}

export async function claimSBT(contractAddress: string, signer: Signer, address: string) {
  // if (!window.ethereum) {
  //   window.open('https://metamask.io/download/', '_blank');
  //   throw new Error('MetaMask is not installed');
  // }

  // const provider = new ethers.providers.Web3Provider(window.ethereum);
  // const signer = provider.getSigner();
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

    const tx = await sbtContract.claim(CURRENT_SEASON, proof)
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
