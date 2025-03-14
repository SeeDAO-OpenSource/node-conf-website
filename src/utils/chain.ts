interface objProp {
  chainId: number
  chainName: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  rpcUrls: string[]
}

const CHAIN: Record<string, objProp> = {
  BSC_TESTNET: {
    chainId: 97,
    chainName: 'BNB Smart Chain Testnet',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: [],
  },
  SEPOLIA: {
    chainId: 11155111,
    chainName: 'Sepolia',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://gateway.tenderly.co/public/sepolia', 'https://rpc.sepolia.io'],
  },
  POLYGON: {
    chainId: 137,
    chainName: 'Polygon',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrls: ['https://rpc-mainnet.maticvigil.com'],
  },
  ETHEREUM: {
    chainId: 1,
    chainName: 'Ethereum Mainnet',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://cloudflare-eth.com', 'https://rpc.flashbots.net/'],
  },
}
export default CHAIN
