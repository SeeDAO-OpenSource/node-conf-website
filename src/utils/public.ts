import sns from '@seedao/sns-js'
import CHAIN from './chain.ts'
import { USE_NETWORK } from './constant.ts'
export function getStatus(type: number) {
  let str = ''
  switch (type) {
    case 0:
      str = '未提交'
      break
    case 1:
      str = '草稿'
      break
    case 2:
      str = '已撤回'
      break
    case 3:
      str = '已驳回'
      break
    case 4:
      str = '已通过'
      break
    case 5:
      str = '投票中'
      break
    case 6:
      str = '已通过'
      break
    case 7:
      str = '未通过'
      break
    case 8:
      str = '待执行'
      break
    case 9:
      str = '已通过'
      break
    case 10:
      str = '执行失败'
      break
    case 11:
      str = '被否决'
      break
    default:
      break
  }
  return str
}

export const splitWallets = async (wallets: string[]) => {
  const chunkSize = 300
  const result = []
  const resultArr = []

  for (let i = 0; i < wallets.length; i += chunkSize) {
    const chunk = wallets.slice(i, i + chunkSize)
    result.push(chunk)
  }

  for await (const chunk of result) {
    try {
      const data = await sns.names(chunk, CHAIN[USE_NETWORK].rpcUrls[0])
      resultArr.push(...data)
    } catch (error) {
      console.error(error)
    }
  }
  return resultArr
}
