import mock from '../mock'

const wallets = [
  {
    id: '1f2d47627ae826e6b7d442dcf45d5a08efa8ad13040a3af0bc148612',
    amount: 1515829.82,
    ticker: 'RAY',
    transactions: [
      {
        id: '59697b8a34647ab7b177a920d21f8b6a7edbd8db5d30c36f009fa8ae90286983',
        date: '12/06/2020, 08:04:12',
        type: 'receive',
        amount: 10,
        fee: 0.172761,
      },
      {
        id: '8359698b6a7ed7b8a34647ab7b177a920d21fbd8db5d30c36f009fa8ae902869',
        date: '12/06/2020, 12:08:43',
        type: 'send',
        amount: 4.12,
        fee: 0.172761,
      },
      {
        id: 'bd8db5d30c36f009fa8ae9028698359697b8a34647ab7b177a920d21f8b6a7ed',
        date: '12/06/2020, 14:14:40',
        type: 'send',
        amount: 2.180285,
        fee: 0.172761,
      },
    ],
    registered: 1611210700730,
  },
  {
    id: 'efa8ad13040a3af0b1f2d47627ae826e6b7d442dcf45d5a08c148612',
    amount: 129.0,
    ticker: 'ADA',
    transactions: [
      {
        id: 'bd8db5d30c36f009fa8ae9028698359697b8a34647ab7b177a920d21f8b6a7ed',
        date: '12/06/2020, 14:14:40',
        type: 'send',
        amount: 2.180285,
        fee: 0.172761,
      },
      {
        id: '59697b8a34647ab7b177a920d21f8b6a7edbd8db5d30c36f009fa8ae90286983',
        date: '12/06/2020, 08:04:12',
        type: 'receive',
        amount: 10,
        fee: 0.172761,
      },
    ],
    registered: 1611218700730,
  },
  {
    id: 'cf45d5a08c14861247627ae8efa8ad130b1f2d26e6b7d442d040a3af',
    amount: 12525.821241,
    ticker: 'ADA',
    transactions: [],
    registered: 1611110700730,
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
