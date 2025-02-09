
import { ethers } from 'ethers';

import {splitWallets} from "../utils/public.ts";

import {useSelector} from "react-redux";
import store from "../store";
import {saveSnsMap} from "../store/reducer.ts";

export default function useQuerySNS() {

  const snsMap = useSelector((store:any) => store.snsMap);




  const getMultiSNS = async (wallets: string[]) => {
    const wallet_sns_map:any = {};
    const _wallets = wallets.map((w) => w.toLocaleLowerCase());
    const _to_be_queried = _wallets.filter((w) => !snsMap[w]);

    const _snsMap = {...snsMap};
    if (_to_be_queried.length) {
      try {
        const data = await splitWallets(_to_be_queried);


        data.map((d, idx) => {
          if(!d)return;
          _snsMap[_to_be_queried[idx]] = d || ethers.utils.getAddress(_to_be_queried[idx]);

        });
      } catch (error) {
        console.log(error);
      }
    }

    store.dispatch(saveSnsMap(_snsMap));


    _wallets.forEach((w) => {
      wallet_sns_map[w] = _snsMap[w] || w
    });
    return wallet_sns_map;

  };

  return {getMultiSNS };
}
