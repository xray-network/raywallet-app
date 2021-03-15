import mock from '../mock'

const wallets = [
  {
    id: '1f2d47627ae826e6b7d442dcf45d5a08efa8ad13040a3af0bc148612',
    assets: [
      {
        hash: 'lovelace',
        ticker: 'ADA',
        amount: 1515829.82,
      },
      {
        hash: '7a920d21f8b6a7edbd8db5d30c36f009fa8ae9028698359697b8a34647ab7b17.ray',
        ticker: 'RAY',
        amount: 1000000,
      },
      {
        hash: '09fa8ae9028698359697b8a34647ab7b177a920d21f8b6a7edbd8db5d30c36f0.ergo',
        ticker: 'ERGO',
        amount: 500,
      },
    ],
    transactions: [
      {
        id: '59697b8a34647ab7b177a920d21f8b6a7edbd8db5d30c36f009fa8ae90286983',
        date: '12/06/2020, 08:04:12',
        type: 'receive',
        fee: 0.172761,
        assets: [
          {
            hash: 'lovelace',
            ticker: 'ADA',
            amount: 1515829.82,
          },
          {
            hash: '7a920d21f8b6a7edbd8db5d30c36f009fa8ae9028698359697b8a34647ab7b17.ray',
            ticker: 'RAY',
            amount: 1000000,
          },
          {
            hash: '09fa8ae9028698359697b8a34647ab7b177a920d21f8b6a7edbd8db5d30c36f0.egor',
            ticker: 'EGOR',
            amount: 500,
          },
        ],
      },
      {
        id: '8359698b6a7ed7b8a34647ab7b177a920d21fbd8db5d30c36f009fa8ae902869',
        date: '12/06/2020, 12:08:43',
        type: 'send',
        fee: 0.172761,
        assets: [
          {
            hash: 'lovelace',
            ticker: 'ADA',
            amount: 4.12,
          },
        ],
      },
      {
        id: 'bd8db5d30c36f009fa8ae9028698359697b8a34647ab7b177a920d21f8b6a7ed',
        date: '12/06/2020, 14:14:40',
        type: 'send',
        amount: 2.180285,
        fee: 0.172761,
        assets: [
          {
            hash: 'lovelace',
            ticker: 'ADA',
            amount: 2.180285,
          },
        ],
      },
    ],
    created: 1611210700730,
  },
  {
    id: '17627ae826e6b7d442dcf45d5a08c148612efa8ad13040a3af0b1f2d',
    assets: [
      {
        hash: 'lovelace',
        ticker: 'ADA',
        amount: 10020.82,
      },
    ],
    transactions: [
      {
        id: 'bd8db5d30c36f009fa8ae9028698359697b8a34647ab7b177a920d21f8b6a7ed',
        date: '12/06/2020, 14:14:40',
        type: 'send',
        fee: 0.172761,
        assets: [
          {
            hash: 'lovelace',
            ticker: 'ADA',
            amount: 2.180285,
          },
        ],
      },
      {
        id: '59697b8a34647ab7b177a920d21f8b6a7edbd8db5d30c36f009fa8ae90286983',
        date: '12/06/2020, 08:04:12',
        type: 'receive',
        fee: 0.172761,
        assets: [
          {
            hash: 'lovelace',
            ticker: 'ADA',
            amount: 10,
          },
        ],
      },
    ],
    created: 1611218700730,
  },
]

mock.onPost('/api/wallet').reply((request) => {
  const { id } = JSON.parse(request.data)
  const wallet = wallets.find((item) => item.id === id)

  if (wallet) {
    return [200, wallet]
  }

  return [404, 'Something went wrong.']
})
