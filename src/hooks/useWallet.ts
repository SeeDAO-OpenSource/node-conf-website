import { useState, useCallback, useEffect } from 'react';
import { connectWallet, checkSBTOwnership, claimSBT } from '../services/web3';
import {useSelector} from "react-redux";

export function useWallet() {
  const [account, setAccount] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const address = useSelector((store:any) => store.account);

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

  const connect = useCallback(async () => {
    setConnecting(true);
    try {
      const account = await connectWallet();
      setAccount(account);
      return !!account;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      return false;
    } finally {
      setConnecting(false);
    }
  }, []);

  const claim = useCallback(async (contractAddress: string) => {
    if (!address) throw new Error('Wallet not connected');

    setClaiming(true);
    try {
      await claimSBT(contractAddress);
      return true;
    } catch (error) {
      console.error('Failed to claim SBT:', error);
      throw error;
    } finally {
      setClaiming(false);
    }
  }, [address]);

  const checkOwnership = useCallback(async (contractAddress: string, tokenId: string) => {
    if (!address) return false;
    return checkSBTOwnership(contractAddress, tokenId, address);
  }, [address]);

  return {
    account,
    connecting,
    claiming,
    connect,
    claim,
    checkOwnership,
  };
}
