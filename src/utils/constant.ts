export const SELECT_WALLET = 'SEEDAO_WALLET'

const net = import.meta.env.VITE_CHAIN

// export const USE_NETWORK: "ETHEREUM" | "POLYGON" = "ETHEREUM";

export const USE_NETWORK: 'ETHEREUM' | 'POLYGON' | 'SEPOLIA' =
  net === 'testnet' ? 'SEPOLIA' : 'ETHEREUM'
