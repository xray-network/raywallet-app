import axios from 'axios'
import { notification } from 'antd'

const apiClient = axios.create({
  baseURL: '/api',
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

export default apiClient
