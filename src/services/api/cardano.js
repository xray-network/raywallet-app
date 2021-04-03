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

const apiClient = axios.create({
  // baseURL: 'https://graphql-api.mainnet.dandelion.link', // mainnet
  baseURL: 'https://graphql-api.testnet.dandelion.link', // testnet
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
          description: item.message,
        })
      })
      return false
    }
    return response
  },
  (error) => {
    // Errors handling
    const { response } = error
    const { data } = response
    if (data.errors) {
      data.errors.forEach((item) => {
        notification.warning({
          message: 'Something went wrong :(',
          description: item.message,
        })
      })
    }
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
            address
            value
            tokens {
              assetId
              assetName
              policyId
              quantity
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

export async function GetTransactions(addresses) {
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
                assetId
                assetName
                quantity
              }
            }
            outputs {
              address
              value
              tokens {
                assetId
                assetName
                quantity
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

export async function GetStakeAddressInfo(address, epoch) {
  return apiClient
    .post('/', {
      query: `
        query activeStakeForAddress($epoch: Int, $address: StakeAddress) {
          activeStake(
            limit: 1
            where: { epochNo: { _eq: $epoch }, address: { _eq: $address } }
          ) {
            amount
            stakePoolHash
          }
        }
      `,
      variables: {
        address,
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

export async function GetPoolsInfo(hashes, epoch) {
  return apiClient
    .post('/', {
      query: `
        query allStakePoolFields($hashes: [Hash28Hex], $epoch: Int) {
          stakePools(where: { hash: { _in: $hashes } }) {
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
        hashes,
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

export async function GetRewardsForAddress(address) {
  return apiClient
    .post('/', {
      query: `
        query rewardsForAddress($address: StakeAddress) {
          rewards(limit: 10, where: { address: { _eq: $address } }) {
            address
            amount
            earnedIn {
              number
              startedAt
              lastBlockTime
            }
          }
        }
      `,
      variables: {
        address,
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
