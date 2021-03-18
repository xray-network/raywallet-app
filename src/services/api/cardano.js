import axios from 'axios'
import { notification } from 'antd'

const apiClient = axios.create({
  baseURL: 'https://graphql-api.testnet.dandelion.link',
  // timeout: 1000,
  // headers: { 'X-Custom-Header': 'foobar' }
})

// apiClient.interceptors.request.use((request) => {
//   return request
// })

apiClient.interceptors.response.use(undefined, (error) => {
  // Errors handling
  const { response } = error
  const { data } = response
  if (data) {
    notification.warning({
      message: data,
    })
  }
})

export async function getWalletData(wallets) {
  console.log(wallets)
  return apiClient
    .post('/wallet', {
      query: `
        {
          cardanoDbMeta {
            initialized
            syncPercentage
          }
        }
      `
    })
    .then((response) => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch((err) => console.log(err))
}

export async function getGetStakeData(accountId) {
  return apiClient
    .post('/stake', {
      id: accountId,
    })
    .then((response) => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch((err) => console.log(err))
}
