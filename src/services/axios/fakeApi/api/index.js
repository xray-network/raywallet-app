import mock from '../mock'

const wallets = [
  {
    id: '1f2d47627ae826e6b7d442dcf45d5a08efa8ad13040a3af0bc148612',
    amount: 1515829.82,
    ticker: 'RAY',
    transactions: ['1', '2', '3', '4', '5'],
    registered: 1611210700730,
  },
  {
    id: 'efa8ad13040a3af0b1f2d47627ae826e6b7d442dcf45d5a08c148612',
    amount: 129.0,
    ticker: 'ADA',
    transactions: ['1', '2', '3', '4', '5', '6', '7'],
    registered: 1611218700730,
  },
  {
    id: 'cf45d5a08c14861247627ae8efa8ad130b1f2d26e6b7d442d040a3af',
    amount: 12525.821241,
    ticker: 'ADA',
    transactions: ['1', '2', '3', '4', '5'],
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
