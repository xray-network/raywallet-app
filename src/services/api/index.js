import apiClient from 'services/axios'

export async function getWalletData(walletId) {
  return apiClient
    .post('/wallet', {
      id: walletId,
    })
    .then((response) => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch((err) => console.log(err))
}

export async function getGetStakeData(walletId) {
  return apiClient
    .post('/stake', {
      id: walletId,
    })
    .then((response) => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch((err) => console.log(err))
}
