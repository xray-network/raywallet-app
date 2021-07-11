import CardanoWeb3 from 'cardano-web3-browser'
import { notification } from 'antd'

const Cardano = new CardanoWeb3({
  crypto: {
    network: 'testnet',
  },
  explorer: {
    url: 'https://graphql-testnet.rraayy.com',
    responseHandler: (response) => {
      const { data } = response
      if (data.errors) {
        data.errors.forEach(() => {
          notification.warning({
            message: 'Something went wrong :(',
            description: 'Please try to update your wallet data or reload the app',
          })
        })
        return false
      }
      return response.data
    },
    errorHandler: () => {
      notification.warning({
        message: 'Something went wrong :(',
      })
    },
  },
})

// Cardano.addProvider('helper', function Helper(pkg) {
//   this.settings = pkg.settings
// })

export default Cardano
