/**
 * Copyright (c) 2021, Ray Network <hello@rraayy.com>
 * https://rraayy.com, https://raywallet.io
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

import axios from 'axios'
import { notification } from 'antd'

const CARDANO_NETWORK = process.env.REACT_APP_NETWORK || 'testnet'

const apiClient = axios.create({
  baseURL: CARDANO_NETWORK === 'testnet' ? 'http://localhost:3100' : 'https://graphql.rraayy.com', // testnet
  // timeout: 100,
  // headers: { 'X-Custom-Header': 'foobar' }
})

// apiClient.interceptors.request.use((request) => {
//   return request
// })

apiClient.interceptors.response.use(
  (response) => {
    const { data } = response
    if (data.errors) {
      data.errors.forEach((item) => {
        notification.warning({
          message: 'Something went wrong :(',
          description: 'Please try to update your wallet data or reload the app',
        })
        console.log(item)
      })
      return false
    }
    return response
  },
  (error) => {
    // Errors handling
    console.log(error)
    notification.warning({
      message: 'Something went wrong :(',
    })
  },
)

export async function GetNetworkInfo() {
  return apiClient
    .post('/', {
      query: `
         {
           cardano {
             tip {
               number
               slotNo
             }
             currentEpoch {
               number
               startedAt
               blocksCount
             }
           }
         }
       `,
    })
    .then((response) => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch((err) => console.log(err))
}

export async function GetAdressesUTXO(addresses) {
  return apiClient
    .post('/', {
      query: `
         query utxoSetForAddress($addresses: [String]) {
           utxos(order_by: { value: desc }, where: { address: { _in: $addresses } }) {
             transaction {
               hash
             }
             address
             value
             index
             tokens {
               quantity
               asset {
                 assetId
                 assetName
                 description
                 fingerprint
                 logo
                 name
                 ticker
                 url
                 policyId
               }
             }
           }
         }
       `,
      variables: {
        addresses,
      },
    })
    .then((response) => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch((err) => console.log(err))
}

export async function GetTransactionsByInputs(addresses) {
  return apiClient
    .post('/', {
      query: `
         query getTxs($addresses: [String]) {
           transactions(
             limit: 100
             order_by: { includedAt: desc }
             offset: 0
             where: {
               inputs: {
                 address: {
                   _in: $addresses
                 }
               }
             }
           ) {
             fee
             hash
             includedAt
           }
         }
       `,
      variables: {
        addresses,
      },
    })
    .then((response) => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch((err) => console.log(err))
}

export async function GetTransactionsByOutputs(addresses) {
  return apiClient
    .post('/', {
      query: `
         query getTxs($addresses: [String]) {
           transactions(
             limit: 100
             order_by: { includedAt: desc }
             offset: 0
             where: {
               outputs: {
                 address: {
                   _in: $addresses
                 }
               }
             }
           ) {
             fee
             hash
             includedAt
           }
         }
       `,
      variables: {
        addresses,
      },
    })
    .then((response) => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch((err) => console.log(err))
}

export async function GetTransactionsIO(hashes) {
  return apiClient
    .post('/', {
      query: `
         query getTxsInfo($hashes: [Hash32Hex]!) {
           transactions(
             limit: 100
             order_by: { includedAt: desc }
             offset: 0
             where: {
               hash: {
                 _in: $hashes
               }
             }
           ) {
             fee
             hash
             includedAt
             inputs {
               address
               value
               tokens {
                 quantity
                 asset {
                   assetId
                   assetName
                   description
                   fingerprint
                   logo
                   name
                   ticker
                   url
                   policyId
                 }
               }
             }
             outputs {
               address
               value
               tokens {
                 quantity
                 asset {
                   assetId
                   assetName
                   description
                   fingerprint
                   logo
                   name
                   ticker
                   url
                   policyId
                 }
               }
             }
           }
         }
       `,
      variables: {
        hashes,
      },
    })
    .then((response) => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch((err) => console.log(err))
}

export async function GetPoolsInfo(ids, epoch) {
  return apiClient
    .post('/', {
      query: `
         query allStakePoolFields($ids: [StakePoolID], $epoch: Int) {
           stakePools(where: { id: { _in: $ids } }) {
             activeStake_aggregate(where: { epoch: { number: { _eq: $epoch } } }) {
               aggregate {
                 count
                 sum {
                   amount
                 }
               }
             }
             fixedCost
             hash
             id
             margin
             pledge
             url
           }
         }
       `,
      variables: {
        ids,
        epoch,
      },
    })
    .then((response) => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch((err) => console.log(err))
}

export async function SendTransaction(transaction) {
  return apiClient
    .post('/', {
      query: `
        mutation submitTransaction($transaction: String!) {
          submitTransaction(transaction: $transaction) {
            hash
          }
        }
       `,
      variables: {
        transaction,
      },
    })
    .then((response) => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch((err) => console.log(err))
}

// export async function GetActiveStake(address, epoch) {
//   return apiClient
//     .post('/', {
//       query: `
//          query activeStakeForAddress($epoch: Int, $address: StakeAddress) {
//            activeStake(
//              where: { epochNo: { _eq: $epoch }, address: { _eq: $address } }
//            ) {
//              amount
//              epochNo
//            }
//          }
//        `,
//       variables: {
//         address,
//         epoch,
//       },
//     })
//     .then((response) => {
//       if (response) {
//         return response.data
//       }
//       return false
//     })
//     .catch((err) => console.log(err))
// }

// export async function GetStakeAddressDelegations(address) {
//   return apiClient
//     .post('/', {
//       query: `
//          query delegationsForAddress($address: StakeAddress) {
//            delegations(
//              limit: 1
//              where: { address: { _eq: $address } }
//              order_by: { transaction: { includedAt: desc } }
//            ) {
//              address
//              stakePool {
//                id
//              }
//              transaction {
//                includedAt
//              }
//            }
//          }
//        `,
//       variables: {
//         address,
//       },
//     })
//     .then((response) => {
//       if (response) {
//         return response.data
//       }
//       return false
//     })
//     .catch((err) => console.log(err))
// }

// export async function GetRewardsForAddress(address) {
//   return apiClient
//     .post('/', {
//       query: `
//          query rewardsForAddress($address: StakeAddress) {
//            rewards(
//              limit: 100
//              order_by: { earnedIn: { number: desc } }
//              where: { address: { _eq: $address } }
//            ) {
//              address
//              amount
//              earnedIn {
//                number
//                lastBlockTime
//              }
//            }
//            withdrawals(
//              limit: 100
//              order_by: { transaction: { includedAt: desc } }
//              where: { address: { _eq: $address } }
//            ) {
//              address
//              amount
//              transaction {
//                includedAt
//              }
//            }
//          }
//        `,
//       variables: {
//         address,
//       },
//     })
//     .then((response) => {
//       if (response) {
//         return response.data
//       }
//       return false
//     })
//     .catch((err) => console.log(err))
// }
