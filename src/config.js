export default process.env.REACT_APP_NETWORK === 'mainnet'
  ? {
      network: 'mainnet',
      graphql: 'https://api-mainnet-graphql.raynet.work',
    }
  : {
      network: 'testnet',
      graphql: 'https://api-testnet-graphql.raynet.work',
    }
