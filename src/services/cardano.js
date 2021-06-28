import CardanoWeb3 from 'services/CardanoWeb3'

const Cardano = new CardanoWeb3({
  crypto: {
    network: 'mainnet',
  },
  explorer: {
    url: 'https://graphql.rraayy.com/test',
  },
})

// Cardano.addProvider('helper', function Helper(pkg) {
//   this.settings = pkg.settings
// })

window.ww = Cardano

export default Cardano
