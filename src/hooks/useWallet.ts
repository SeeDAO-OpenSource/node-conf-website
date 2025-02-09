import { useState, useCallback, useEffect } from 'react';
import { checkSBTOwnership, claimSBT } from '../services/web3';
import {useSelector} from "react-redux";

import {useEthersProvider, useEthersSigner} from "./ethersNew";
import CHAIN from "../utils/chain.ts";
import {USE_NETWORK} from "../utils/constant.ts";

export function useWallet() {
  const [account, setAccount] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const address = useSelector((store:any) => store.account);
  const signer = useEthersSigner({chainId:CHAIN[USE_NETWORK].chainId });
  const provider = useEthersProvider({chainId:CHAIN[USE_NETWORK].chainId });

  // // Handle account changes
  // useEffect(() => {
  //   if (window.ethereum) {
  //     window.ethereum.on('accountsChanged', (accounts: string[]) => {
  //       setAccount(accounts[0] || null);
  //     });
  //
  //     window.ethereum.on('chainChanged', () => {
  //       window.location.reload();
  //     });
  //   }
  // }, []);

  // const connect = useCallback(async () => {
  //   setConnecting(true);
  //   try {
  //     const account = await connectWallet();
  //     setAccount(account);
  //     return !!account;
  //   } catch (error) {
  //     console.error('Failed to connect wallet:', error);
  //     return false;
  //   } finally {
  //     setConnecting(false);
  //   }
  // }, []);

  const claim = useCallback(async (contractAddress: string) => {
    if (!address) throw new Error('Wallet not connected');
    if(!signer)return;

    setClaiming(true);
    try {
      await claimSBT(contractAddress,signer);
      return true;
    } catch (error) {
      console.error('Failed to claim SBT:', error);
      throw error;
    } finally {
      setClaiming(false);
    }
  }, [address,signer]);

  const checkOwnership = useCallback(async (contractAddress: string, tokenId: string) => {
    if (!address) return false;
    if(!provider)return false;
    return checkSBTOwnership(contractAddress, tokenId, address,provider);
  }, [address,provider]);

  return {
    account,
    connecting,
    claiming,
    // connect,
    claim,
    checkOwnership,
  };
}
