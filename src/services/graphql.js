import axios from 'axios'

const client = axios.create({
  baseURL: 'https://api-mainnet-graphql.raynet.work/',
})

export const getNetworkInfo = async () => {
  return client.post('/', {
    query: `
      {
        cardano {
          tip {
            number
            slotNo
          }
          currentEpoch {
            number
            startedAt
            blocksCount
          }
        }
      }
    `,
  })
}

export const getStakeRegistrations = async (key) => {
  return client.post('/', {
    query: `
      query stakeRegistrationsSample($key: StakeAddress) {
        stakeRegistrations(
          order_by: { transaction: { block: { number: desc } } }
          where: { address: { _eq: $key } }
        ) {
          address
          transaction {
            hash
            includedAt
            block {
              number
            }
          }
        }
        stakeDeregistrations(
          order_by: { transaction: { block: { number: desc } } }
          where: { address: { _eq: $key } }
        ) {
          address
          transaction {
            hash
            includedAt
            block {
              number
            }
          }
        }
        delegations(
          order_by: { transaction: { block: { number: desc } } }
          where: { address: { _eq: $key } }
          limit: 1
        ) {
          address
          stakePool {
            id
          }
          transaction {
            block {
              number
            }
          }
        }
        rewards_aggregate(where: { address: { _eq: $key } }) {
          aggregate {
            sum {
              amount
            }
          }
        }
        rewards(where: { address: { _eq: $key } }) {
          amount
          earnedIn {
            number
          }
        }
        withdrawals_aggregate(where: { address: { _eq: $key } }) {
          aggregate {
            sum {
              amount
            }
          }
        }
        withdrawals(where: { address: { _eq: $key } }) {
          amount
        }
      }
    `,
    variables: {
      key,
    },
  })
}
