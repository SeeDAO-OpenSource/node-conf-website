import sns from "@seedao/sns-js";
import CHAIN from "./chain.ts";
import {USE_NETWORK} from "./constant.ts";
export function getStatus(type:number) {
    let str = "";
    switch (type) {
        case 0:
            str="Pending Submit"
            break;
        case 1:
            str="Draft"
            break;
        case 2:
            str="Withdrawn"
            break;
        case 3:
            str="Rejected"
            break;
        case 4:
            str="Approved"
            break;
        case 5:
            str="Voting"
            break;
        case 6:
            str="Vote Passed"
            break;
        case 7:
            str="Vote Failed"
            break;
        case 8:
            str="Pending Execution"
            break;
        case 9:
            str="Executed"
            break;
        case 10:
            str="Execution Failed"
            break;
        case 11:
            str="Vetoed"
            break;
        default:
                break;
    }
    return str;
}

export const splitWallets = async(wallets:string[]) =>{
    const chunkSize = 300;
    const result = [];
    const resultArr = [];

    for (let i = 0; i < wallets.length; i += chunkSize) {
        const chunk = wallets.slice(i, i + chunkSize);
        result.push(chunk);
    }

    for await (const chunk of result) {
        try{
            const data = await sns.names(chunk, CHAIN[USE_NETWORK].rpcUrls[0]);
            resultArr.push(...data);
        }catch(error){
            console.error(error)
        }

    }
    return resultArr;
}

