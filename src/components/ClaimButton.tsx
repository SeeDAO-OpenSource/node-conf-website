import React, { useState, useEffect } from 'react';
import { useWallet } from '../hooks/useWallet';
import {useAccount,useDisconnect} from "wagmi";
import LoginModal from "./login/login.tsx";
import {useSelector} from "react-redux";
import {saveAccount} from "../store/reducer.ts";
import store from "../store";

interface Props {
  contractAddress: string;
  tokenId: string;
  candidates: string[];
}

export default function ClaimButton({ contractAddress, tokenId, candidates }: Props) {
  const { claiming, checkOwnership } = useWallet();
  const { address,isConnecting,isConnected } = useAccount();
  const {disconnect} = useDisconnect();

  const account = useSelector((store:any) => store.account);
  const [status, setStatus] = useState<'unclaimed' | 'claimed' | 'not-eligible'>('unclaimed');
  const [loading, setLoading] = useState(true);
  const [show,setShow] = useState<boolean>(false);

  useEffect(() => {
    async function checkStatus() {
      if (!account) {
        setStatus('unclaimed');
        setLoading(false);
        return;
      }

      try {
        // Check if wallet is in candidates list
        const isEligible = candidates.some(
          address => address.toLowerCase() === account.toLowerCase()
        );

        if (!isEligible) {
          setStatus('not-eligible');
          setLoading(false);
          return;
        }

        // Check if already claimed
        const hasToken = await checkOwnership(contractAddress, tokenId);
        setStatus(hasToken ? 'claimed' : 'unclaimed');
      } catch (error) {
        console.error('Error checking claim status:', error);
      } finally {
        setLoading(false);
      }
    }

    checkStatus();
  }, [account, candidates, contractAddress, tokenId, checkOwnership]);

  const handleClick = async () => {
    // if (!account) {
    //   await connect();
    //   return;
    // }
    //
    // if (status === 'unclaimed') {
    //   try {
    //     await claim(contractAddress);
    //     setStatus('claimed');
    //   } catch (error) {
    //     console.error('Failed to claim:', error);
    //   }
    // }
    setShow(true)
  };
  const handleClose = () => {
    setShow(false)
  }

  const handleDisconnect = () => {
    disconnect()
    store.dispatch(saveAccount(null));
  }
  return (
      <>
        <LoginModal showModal={show} handleClose={handleClose} />


        {
          loading &&    <button
                disabled
                className="btn btn-primary text-lg px-12 py-4 opacity-50 cursor-not-allowed"
            >
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              加载中...
            </button>
        }
        --{account}--{JSON.stringify(isConnected)}--{address}

        {
            !loading &&<>
              { !!account && status === 'not-eligible' && <button
                  disabled
                  className="btn btn-secondary text-lg px-12 py-4 cursor-not-allowed"
              >
                您不是本季节点候选人
              </button>}
              {
                  !!account && status === 'claimed' && <button
                      disabled
                      className="btn btn-secondary text-lg px-12 py-4 cursor-not-allowed"
                  >
                    已领取
                  </button>
              }
              {
                  ( status !== 'not-eligible' &&  status !== 'claimed' ) &&  <button
                      onClick={handleClick}
                      disabled={isConnecting || claiming}
                      className="btn btn-primary text-lg px-12 py-4 hover:scale-105 transition-transform duration-200 shadow-xl hover:shadow-2xl bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isConnecting || claiming ? (
                        <>
                          <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          {isConnecting ? '连接钱包中...' : '领取中...'}
                        </>
                    ) : account ? (
                        '领取'
                    ) : (
                        '连接钱包'
                    )}
                  </button>
              }
          </>
        }
        <div onClick={()=>handleDisconnect()}>断开连接</div>

      </>
  );
}
