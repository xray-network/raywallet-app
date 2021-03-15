import apiClient from 'services/axios'

export async function getWalletData(accountId) {
  return apiClient
    .post('/wallet', {
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
