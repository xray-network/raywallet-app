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
  baseURL:
    CARDANO_NETWORK === 'testnet' ? 'http://localhost:8080' : 'https://graphql-helper.rraayy.com', // testnet
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
    console.log(error)
    notification.warning({
      message: 'Something went wrong :(',
    })
  },
)

export async function GetStakeInfo(account) {
  return apiClient
    .get(`/account/stake/${account}`)
    .then((response) => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch((err) => console.log(err))
}

export async function GetRewardsInfo(stakeKey) {
  return apiClient
    .get(`/rewards/ray/${stakeKey}`)
    .then((response) => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch((err) => console.log(err))
}

export async function GetPoolsInfo(poolsIds, currentEpoch) {
  return apiClient
    .post('/pools/info/', {
      poolsIds,
      currentEpoch,
    })
    .then((response) => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch((err) => console.log(err))
}

export const dummy = () => null
