const axios = require('axios')

const Explorer = function Explorer(pkg, settings) {
  const Cardano = pkg
  const { BigNumber } = Cardano.crypto

  const errorHandler =
    settings.errorHandler ||
    ((error) => {
      return error.response
        ? error.response.data
        : {
            errors: [
              {
                name: error.name,
                message: error.message,
              },
            ],
          }
    })

  const client = axios.create({
    baseURL: settings.url,
    headers: { ...settings.headers },
  })

  client.interceptors.response.use(
    (response) => {
      return response?.data
    },
    (error) => {
      return errorHandler(error)
    },
  )

  this.query = (query) => {
    return client.post('/', query)
  }

  this.getNetworkInfo = () => {
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

  this.getAddressesUTXO = (addresses) => {
    return client.post('/', {
      query: `
         query utxoSetForAddress($addresses: [String]) {
           utxos(order_by: { value: desc }, where: { address: { _in: $addresses } }) {
             transaction {
               hash
             }
             address
             value
             index
             tokens {
               quantity
               asset {
                 assetId
                 assetName
                 description
                 fingerprint
                 logo
                 name
                 ticker
                 url
                 policyId
               }
             }
           }
         }
       `,
      variables: {
        addresses,
      },
    })
  }

  this.getTransactionsByInputs = (addresses) => {
    return client.post('/', {
      query: `
           query getTxsByInputs($addresses: [String]) {
             transactions(
               limit: 100
               order_by: { includedAt: desc }
               offset: 0
               where: {
                 inputs: {
                   address: {
                     _in: $addresses
                   }
                 }
               }
             ) {
               fee
               hash
               includedAt
             }
           }
         `,
      variables: {
        addresses,
      },
    })
  }

  this.getTransactionsByOutputs = (addresses) => {
    return client.post('/', {
      query: `
           query getTxsByOutputs($addresses: [String]) {
             transactions(
               limit: 100
               order_by: { includedAt: desc }
               offset: 0
               where: {
                 outputs: {
                   address: {
                     _in: $addresses
                   }
                 }
               }
             ) {
               fee
               hash
               includedAt
             }
           }
         `,
      variables: {
        addresses,
      },
    })
  }

  this.getTransactionsIO = (hashes) => {
    return client.post('/', {
      query: `
           query getTxsInfo($hashes: [Hash32Hex]!) {
             transactions(
               limit: 100
               order_by: { includedAt: desc }
               offset: 0
               where: {
                 hash: {
                   _in: $hashes
                 }
               }
             ) {
               fee
               hash
               deposit
               withdrawals {
                 amount
               }
               includedAt
               inputs {
                 address
                 value
                 tokens {
                   quantity
                   asset {
                     assetId
                     assetName
                     description
                     fingerprint
                     logo
                     name
                     ticker
                     url
                     policyId
                   }
                 }
               }
               outputs {
                 address
                 value
                 tokens {
                   quantity
                   asset {
                     assetId
                     assetName
                     description
                     fingerprint
                     logo
                     name
                     ticker
                     url
                     policyId
                   }
                 }
               }
             }
           }
         `,
      variables: {
        hashes,
      },
    })
  }

  this.txSend = (transaction) => {
    return client.post('/', {
      query: `
          mutation submitTransaction($transaction: String!) {
            submitTransaction(transaction: $transaction) {
              hash
            }
          }
         `,
      variables: {
        transaction,
      },
    })
  }

  this.getAccountState = function* getAccountState(publicKey) {
    const getAssetsSummary = (processAddresses) => {
      const assetsSummary = {
        value: new BigNumber(0),
        tokens: {},
      }

      processAddresses.forEach((addr) => {
        assetsSummary.value = assetsSummary.value.plus(addr.value)
        const { tokens } = addr
        if (tokens.length) {
          tokens.forEach((token) => {
            const { asset, quantity } = token
            const { assetId } = asset
            if (!assetsSummary.tokens[assetId]) {
              assetsSummary.tokens[assetId] = {
                quantity: new BigNumber(0),
              }
            }
            assetsSummary.tokens[assetId] = {
              ...assetsSummary.tokens[assetId],
              ...asset,
              ticker:
                asset.ticker || Buffer.from(asset.assetName || '', 'hex').toString('utf-8') || '?',
              quantity: new BigNumber(assetsSummary.tokens[assetId].quantity).plus(quantity),
            }
          })
        }
      })

      return {
        value: new BigNumber(assetsSummary.value).toFixed(),
        tokens: Object.keys(assetsSummary.tokens).map((key) => assetsSummary.tokens[key]),
      }
    }

    function* checkAddresses(type, pageSize, shift) {
      const tmpAddresses = yield Cardano.crypto.getAccountAddresses(
        publicKey,
        type,
        pageSize,
        shift,
      )

      const checkedAdresses = tmpAddresses.addresses
      const { data: tmpAddresssesUTXO } = yield Cardano.explorer.getAddressesUTXO(checkedAdresses)

      const adressesWithUTXOs = tmpAddresssesUTXO.utxos
        ? tmpAddresssesUTXO.utxos.map((utxo) => {
            return {
              ...utxo,
              addressing: tmpAddresses.paths[utxo.address],
            }
          })
        : []

      return [adressesWithUTXOs, checkedAdresses]
    }

    const UTXOArray = []
    const adressesArray = []
    const pageSize = 20
    const type = 'all'
    const maxShiftIndex = 10
    let shiftIndex = 0
    function* getAddressesWithShift(shift) {
      const [adressesWithUTXOs, checkedAdresses] = yield checkAddresses(type, pageSize, shift)
      adressesArray.push(...checkedAdresses)
      if (shiftIndex < maxShiftIndex) {
        if (adressesWithUTXOs.length) {
          shiftIndex += 1
          UTXOArray.push(...adressesWithUTXOs)
          yield getAddressesWithShift(shiftIndex)
        }
      }
    }
    yield getAddressesWithShift(shiftIndex)

    const assetsSummary = getAssetsSummary(UTXOArray)

    const { data: rawTxInputs } = yield Cardano.explorer.getTransactionsByInputs(adressesArray)
    const { data: rawTxOutputs } = yield Cardano.explorer.getTransactionsByOutputs(adressesArray)
    const transactions = [
      ...(rawTxInputs?.transactions || []),
      ...(rawTxOutputs?.transactions || []),
    ]
    const transactionsHashes = transactions.map((tx) => tx.hash)
    const { data: transactionsInputsOutputs } = yield Cardano.explorer.getTransactionsIO(
      transactionsHashes,
    )

    const rawTransactions = transactionsInputsOutputs?.transactions || []

    const transformedTransactions = rawTransactions.map((tx) => {
      let inputAmount = new BigNumber(0)
      let outputAmount = new BigNumber(0)
      const tokens = {}

      tx.inputs.forEach((input) => {
        if (adressesArray.includes(input.address)) {
          inputAmount = inputAmount.plus(input.value)
          input.tokens.forEach((token) => {
            const { asset, quantity } = token
            const { assetId } = asset
            if (!tokens[assetId]) {
              tokens[assetId] = {
                quantity: new BigNumber(0),
              }
            }
            tokens[assetId] = {
              ...tokens[assetId],
              ...asset,
              ticker:
                asset.ticker || Buffer.from(asset.assetName || '', 'hex').toString('utf-8') || '?',
              quantity: new BigNumber(tokens[assetId].quantity).minus(quantity),
            }
          })
        }
      })
      tx.outputs.forEach((output) => {
        if (adressesArray.includes(output.address)) {
          outputAmount = outputAmount.plus(output.value)
          output.tokens.forEach((token) => {
            const { asset, quantity } = token
            const { assetId } = asset
            if (!tokens[assetId]) {
              tokens[assetId] = {
                quantity: BigInt(0),
              }
            }
            tokens[assetId] = {
              ...tokens[assetId],
              ...asset,
              ticker:
                asset.ticker || Buffer.from(asset.assetName || '', 'hex').toString('utf-8') || '?',
              quantity: new BigNumber(tokens[assetId].quantity).plus(quantity),
            }
          })
        }
      })

      return {
        ...tx,
        type: new BigNumber(inputAmount).isZero() ? 'receive' : 'send',
        value: new BigNumber(outputAmount).minus(inputAmount),
        tokens: Object.keys(tokens).map((key) => tokens[key]),
      }
    })

    return {
      assets: assetsSummary,
      transactions: transformedTransactions,
      utxos: UTXOArray,
    }
  }
}

module.exports = Explorer
