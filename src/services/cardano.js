import CardanoWeb3 from 'cardano-web3-browser'

const Cardano = new CardanoWeb3({
  crypto: {
    network: 'mainnet',
  },
  explorer: {
    url: 'https://graphql.rraayy.com',
  },
})

// Cardano.addProvider('helper', function Helper(pkg) {
//   this.settings = pkg.settings
// })

export default Cardano
