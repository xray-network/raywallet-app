const networkRelated = process.env.REACT_APP_NETWORK === 'mainnet'
  ? {
    network: 'mainnet',
    api: {
      graphql: 'https://api-mainnet-graphql.rraayy.com',
      helper: 'https://api-mainnet-helper.rraayy.com',
    },
    pools: {
      '1c8cd022e993a8366be641c17cb6d9c5d8944e00bfce3189d8b1515a': {
        delegateId: 'pool1rjxdqghfjw5rv6lxg8qhedkechvfgnsqhl8rrzwck9g45n43yql',
        ticker: 'RAY',
        name: 'RAY Network Pool #1',
      },
      '9ad2692a4865c5999f27d65baf170be5ba38b25489c8e21007193edd': {
        delegateId: 'pool1ntfxj2jgvhzen8e86ed679ctukar3vj538ywyyq8ryld66jj4sx',
        ticker: 'RAY2',
        name: 'RAY Network Pool #2',
      },
      '22cfa3b8612c146a0737c974dcfcbb8cddd86f3a511cf531ce8d91a1': {
        delegateId: 'pool1yt868wrp9s2x5pehe96del9m3nwasme62yw02vww3kg6zwzspcz',
        ticker: 'RAY3',
        name: 'RAY Network Pool #3',
      },
    },
  }
  : {
    network: 'testnet',
    api: {
      graphql: 'https://api-testnet-graphql.rraayy.com',
      helper: 'https://api-testnet-helper.rraayy.com',
    },
    pools: {
      '58e3124fbd0e33188658a616c97932e50ba40430d81d3ed61b33d2ab': {
        delegateId: 'pool15sfcpy4tps5073gmra0e6tm2dgtrn004yr437qmeh44sgjlg2ex',
        ticker: 'JUNO [RAY]',
        name: 'Testpool #1',
      },
      '48794370608c8d41cf4ad665833da210ad4fed6c6fd40b48bfad9ca8': {
        delegateId: 'pool1d03p2xfdcq09efx0hgy4jkr0tqdgvklues5cg3ud45t9wndafmm',
        ticker: 'ANGEL [RAY2]',
        name: 'Testpool #2',
      },
      '683e89fa1bcde139504b11fbfd914f8ebe9b8db2678b3da0abdcb2f1': {
        delegateId: 'pool1tzmx7k40sm8kheam3pr2d4yexrp3jmv8l50suj6crnvn6dc2429',
        ticker: 'WURST [RAY3]',
        name: 'Testpool #3',
      },
    },
  }

export default {
  ...networkRelated,
}