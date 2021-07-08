const Bech32 = require('bech32').bech32
const BigNumber = require('bignumber.js')
const Bip39 = require('bip39-light')

const Crypto = function Crypto(pkg, settings) {
  return (async () => {
    /**
     * Cardano Serialization Lib
     */
    this.Cardano = await import('@emurgo/cardano-serialization-lib-browser')

    /**
     * Lib proxies
     */

    this.Bech32 = Bech32
    this.Bip39 = Bip39
    this.BigNumber = BigNumber

    /**
     * Cardano Serialization Lib
     */
    this.Network =
      settings.network === 'mainnet'
        ? this.Cardano.NetworkInfo.mainnet().network_id()
        : this.Cardano.NetworkInfo.testnet().network_id()

    /**
     * Protocol Parameters
     */

    const { protocolParams } = settings

    /**
     * Error Handler
     */

    const errorHandler =
      settings.errorHandler ||
      // ((error) => {
      //   console.error(error)
      // })
      (() => {})

    /**
     * Errors
     */

    const ErrorException = (type, index) => {
      const messages = {
        not_enough: 'Not enough funds to send a transaction',
        tokens_not_enough: 'Not enough tokens to send a transaction',
        ada_less_than_min: 'Minimum 1 ADA',
        ada_not_number: 'Wrong ADA value',
        ada_wrong_value: 'Wrong ADA value',
        address_wrong: 'Wrong address',
        no_outputs: 'Transaction requires at least 1 output, but no output was added',
        no_change: 'No change added even though it should be forced',
      }
      const error = new Error()
      error.message = messages[type] || 'An unspecified error has occurred'
      error.type = type || 'general_error'
      if (index) {
        error.index = index
      }

      return error
    }

    /**
     * Add input results values
     */

    const AddInputResult = Object.freeze({
      // valid
      VALID: 0,
      // not worth the fee of adding it to input
      TOO_SMALL: 1,
      // token would overflow if added
      OVERFLOW: 2,
      // doesn't contribute to target
      NO_NEED: 3,
    })

    /**
     * Generate mnemonic
     * @param {number} length string length (words count)
     * @return {string} seed phrase
     */

    this.generateMnemonic = (length = 24) => {
      try {
        return Bip39.generateMnemonic((32 * length) / 3)
      } catch (error) {
        errorHandler(error)
        return false
      }
    }

    /**
     * Validate mnemonic
     * @param {string} mnemonic seed phrase
     * @return {boolean} is valid
     */

    this.validateMnemonic = (mnemonic) => {
      try {
        return !!mnemonic && Bip39.validateMnemonic(mnemonic)
      } catch (error) {
        errorHandler(error)
        return false
      }
    }

    /**
     * Get account info (private key, public key, reward address, account ID)
     * @param {string} mnemonic mnemonic seed phrase
     * @return {object}
     */

    this.getAccountKeys = (mnemonic) => {
      const { Cardano, Network, Utils } = this
      try {
        const harden = (num) => {
          return settings.harden + num
        }

        const entropy = Bip39.mnemonicToEntropy(mnemonic)
        const rootKey = Cardano.Bip32PrivateKey.from_bip39_entropy(
          Buffer.from(entropy, 'hex'),
          Buffer.from(''),
        )
        const privateKey = rootKey.derive(harden(1852)).derive(harden(1815)).derive(harden(0))
        const stakeKey = privateKey.derive(2).derive(0).to_public()
        const rewardAddress = Cardano.RewardAddress.new(
          Network,
          Cardano.StakeCredential.from_keyhash(stakeKey.to_raw_key().hash()),
        )

        const privateKeyBech32 = privateKey.to_bech32()
        const publicKeyBech32 = privateKey.to_public().to_bech32()
        const rewardAddressBech32 = rewardAddress.to_address().to_bech32()
        const accountId = Utils.bechToHex(rewardAddressBech32)

        return {
          privateKey: privateKeyBech32,
          publicKey: publicKeyBech32,
          rewardAddress: rewardAddressBech32,
          accountId: accountId.data.slice(2),
          accountIdFull: accountId.data,
        }
      } catch (error) {
        errorHandler(error)
        return false
      }
    }

    /**
     * Generate addresses array by Public Key
     * @param {string} publicKeyBech32 public key
     * @param {string} type external / internal / all derives
     * @param {number} page page size
     * @param {number} shift shifting addresses by page size
     * @return {array} addresses array
     */

    this.getAccountAddresses = (publicKeyBech32, type = 'external', page = 20, shift = 0) => {
      const { Cardano, Network } = this

      try {
        const publicKey = Cardano.Bip32PublicKey.from_bech32(publicKeyBech32)
        let accountAdresses = {}

        const generateAddresses = (addressType) => {
          const tmpAddresses = {}
          for (let i = 0 + page * shift; i < page + page * shift; i += 1) {
            const utxoPubKey = publicKey
              .derive(addressType) // 0 external / 1 internal
              .derive(i)
            const stakeKey = publicKey
              .derive(2) // chimeric
              .derive(0)
            const baseAddr = Cardano.BaseAddress.new(
              Network,
              Cardano.StakeCredential.from_keyhash(utxoPubKey.to_raw_key().hash()),
              Cardano.StakeCredential.from_keyhash(stakeKey.to_raw_key().hash()),
            )
            const baseAddrBech32 = baseAddr.to_address().to_bech32()
            tmpAddresses[baseAddrBech32] = {
              type: addressType,
              path: i,
            }
          }
          return tmpAddresses
        }

        switch (type) {
          case 'external':
            accountAdresses = {
              ...generateAddresses(0),
            }
            break
          case 'internal':
            accountAdresses = {
              ...generateAddresses(1),
            }
            break
          case 'all':
            accountAdresses = {
              ...generateAddresses(0),
              ...generateAddresses(1),
            }
            break
          default:
            break
        }

        return {
          addresses: Object.keys(accountAdresses),
          paths: accountAdresses,
        }
      } catch (error) {
        errorHandler(error)
        return false
      }
    }

    /**
     * Validate Shelley Address
     * @param {string} address bech32 shelley address
     * @return {boolean} is valid
     */

    this.validateAddress = (address) => {
      const { Cardano } = this

      try {
        if (Cardano.ByronAddress.is_valid(address)) return 'byron'
        const shelleyAddress = Cardano.Address.from_bech32(address)
        if (Cardano.ByronAddress.from_address(shelleyAddress)) return 'byron'
        if (Cardano.BaseAddress.from_address(shelleyAddress)) return 'base'
        if (Cardano.PointerAddress.from_address(shelleyAddress)) return 'pointer'
        if (Cardano.EnterpriseAddress.from_address(shelleyAddress)) return 'enterprise'
        if (Cardano.RewardAddress.from_address(shelleyAddress)) return 'reward'
        return false
      } catch (error) {
        errorHandler(error)
        return false
      }
    }

    this.Utils = {
      /**
       * Bech to hex string converter
       * @param {string} str bech32 string
       * @return {string} hex string
       */
      bechToHex: (str) => {
        try {
          const tmp = Bech32.decode(str, 1000)
          return {
            prefix: tmp.prefix,
            data: Buffer.from(Bech32.fromWords(tmp.words)).toString('hex'),
          }
        } catch (error) {
          errorHandler(error)
          return false
        }
      },

      // parse tokens
      parseTokenList: (assets) => {
        if (assets == null) return []

        const result = []
        const hashes = assets.keys()

        // eslint-disable-next-line
        for (let i = 0; i < hashes.len(); i++) {
          const policyId = hashes.get(i)
          const assetsForPolicy = assets.get(policyId)
          // eslint-disable-next-line
          if (assetsForPolicy == null) continue

          const policies = assetsForPolicy.keys()

          // eslint-disable-next-line
          for (let j = 0; j < policies.len(); j++) {
            const assetName = policies.get(j)
            const amount = assetsForPolicy.get(assetName)
            // eslint-disable-next-line
            if (amount == null) continue

            const parsedQuantity = amount.to_str()
            const parsedName = Buffer.from(assetName.name()).toString('hex')
            const parsedPolicyId = Buffer.from(policyId.to_bytes()).toString('hex')
            const parsedAssetId = `${parsedPolicyId}${parsedName}`

            result.push({
              asset: {
                policyId: parsedPolicyId,
                assetId: parsedAssetId,
                assetName: parsedName,
              },
              quantity: parsedQuantity,
            })
          }
        }
        return result
      },

      // value from outputs (ada value/tokens) data
      cardanoValueFromTokens: (value, tokens = []) => {
        const { Cardano } = this

        const cardanoValue = Cardano.Value.new(Cardano.BigNum.from_str(value))

        if (tokens && tokens.length === 0) {
          return cardanoValue
        }

        const assets = Cardano.MultiAsset.new()
        tokens.forEach((token) => {
          const policyId = Cardano.ScriptHash.from_bytes(Buffer.from(token.asset.policyId, 'hex'))
          const assetName = Cardano.AssetName.new(Buffer.from(token.asset.assetName, 'hex'))
          const quantity = Cardano.BigNum.from_str(token.quantity)

          const asset = assets.get(policyId) ?? Cardano.Assets.new()

          asset.insert(assetName, quantity)
          assets.insert(policyId, asset)
        })

        if (assets.len() > 0) {
          cardanoValue.set_multiasset(assets)
        }

        return cardanoValue
      },

      // value from utxo
      cardanoValueFromRemoteFormat: (utxo) => {
        const { Cardano } = this

        const cardanoValue = Cardano.Value.new(Cardano.BigNum.from_str(utxo.value))

        if (!utxo.tokens || utxo.tokens.length === 0) {
          return cardanoValue
        }

        const assets = Cardano.MultiAsset.new()

        // eslint-disable-next-line
        for (const token of utxo.tokens) {
          const policyId = Cardano.ScriptHash.from_bytes(Buffer.from(token.asset.policyId, 'hex'))
          const assetName = Cardano.AssetName.new(Buffer.from(token.asset.assetName, 'hex'))
          const quantity = Cardano.BigNum.from_str(token.quantity)

          const asset = assets.get(policyId) ?? Cardano.Assets.new()

          asset.insert(assetName, quantity)
          assets.insert(policyId, asset)
        }

        if (assets.len() > 0) {
          cardanoValue.set_multiasset(assets)
        }

        return cardanoValue
      },

      // min required for change
      minRequiredForChange: (txBuilder, address, value) => {
        const { Cardano } = this

        const minimumAda = Cardano.min_ada_required(
          value,
          Cardano.BigNum.from_str(protocolParams.minimumUtxoVal),
        )

        const baseValue = (() => {
          if (value.coin().compare(minimumAda) < 0) {
            const newVal = Cardano.Value.new(minimumAda)
            const assets = value.multiasset()
            if (assets) {
              newVal.set_multiasset(assets)
            }
            return newVal
          }
          return value
        })()

        const minRequired = txBuilder
          .fee_for_output(
            Cardano.TransactionOutput.new(Cardano.Address.from_bech32(address), baseValue),
          )
          .checked_add(minimumAda)

        return minRequired
      },

      // put utxo input
      addUtxoInput: (txBuilder, remaining, input, excludeIfSmall) => {
        const { Cardano, Utils } = this

        const txAddr = Cardano.Address.from_bech32(input.address)
        const txAmount = Utils.cardanoValueFromRemoteFormat(input)
        const txInput = Cardano.TransactionInput.new(
          Cardano.TransactionHash.from_bytes(Buffer.from(input.transaction.hash, 'hex')),
          input.index,
        )

        const skipOverflow = () => {
          const currentInputSum = txBuilder
            .get_explicit_input()
            .checked_add(txBuilder.get_implicit_input())

          try {
            currentInputSum.checked_add(txAmount)
          } catch (e) {
            return AddInputResult.OVERFLOW
          }
          return AddInputResult.VALID
        }

        const skipInput = () => {
          if (remaining == null) return skipOverflow()

          const tokenSetInInput = new Set(input.tokens.map((token) => token.asset.assetId))
          const remainingAda = remaining.value.coin().to_str()
          const remainingTokens = Utils.parseTokenList(remaining.value.multiasset())
          const includedTargets = remainingTokens.filter((entry) =>
            tokenSetInInput.has(entry.asset.assetId),
          )

          if (new BigNumber(remainingAda).gt(0) && new BigNumber(input.value).gt(0)) {
            includedTargets.push('lovelace')
          }

          if (includedTargets.length === 0 && remaining.hasInput) {
            return AddInputResult.NO_NEED
          }

          const onlyDefaultEntry =
            includedTargets.length === 1 && includedTargets.includes('lovelace')

          if (onlyDefaultEntry && excludeIfSmall) {
            const feeForInput = new BigNumber(
              txBuilder.fee_for_input(txAddr, txInput, txAmount).to_str(),
            )
            if (feeForInput.gt(input.amount)) {
              return AddInputResult.TOO_SMALL
            }
          }

          return skipOverflow()
        }

        const skipResult = skipInput()
        if (skipResult !== AddInputResult.VALID) {
          return skipResult
        }

        txBuilder.add_input(txAddr, txInput, txAmount)

        return AddInputResult.VALID
      },
    }

    /**
     * Build Transaction
     * @param {array} outputs outputs array
     * @param {string} changeAddress change address
     * @param {number} currentSlot network slot (needed for tx timeout calculation)
     * @param {array} utxos addresses utxos
     * @param {object} metadata transaction metadata
     * @param {array} certificates delegation certificates
     * @param {array} withdrawals rewards withdrawal
     * @return {object}
     */

    this.txBuild = (
      outputs = [],
      utxos = [],
      changeAddress,
      currentSlot,
      metadata,
      certificates = [],
      withdrawals = [],
      allowNoOutputs = true,
    ) => {
      const { Cardano, Utils } = this

      try {
        // initial checks for errors
        outputs.forEach((output, outputIndex) => {
          if (this.validateAddress(output.address) !== 'base') {
            throw ErrorException('address_wrong', [outputIndex])
          }

          if (new BigNumber(output.value).isNaN()) {
            throw ErrorException('ada_not_number', [outputIndex])
          }

          if (new BigNumber(output.value).lt(new BigNumber(protocolParams.minimumUtxoVal))) {
            throw ErrorException('ada_less_than_min', [outputIndex])
          }

          if (new BigNumber(output.value).decimalPlaces() > 6) {
            throw ErrorException('ada_wrong_value', [outputIndex])
          }

          if (output.tokens) {
            output.tokens.forEach((token, tokenIndex) => {
              if (new BigNumber(token.quantity).lt(new BigNumber(1))) {
                throw ErrorException('tokens_not_enough', [outputIndex, tokenIndex])
              }
            })
          }
        })

        // allowNoOutputs in tx
        const shouldForceChange = (assetsForChange) => {
          const noOutputDisallowed = !allowNoOutputs && outputs.length === 0
          if (noOutputDisallowed && changeAddress == null) {
            throw ErrorException('no_outputs')
          }
          if (assetsForChange != null && assetsForChange.len() > 0) {
            return true
          }
          return noOutputDisallowed
        }
        shouldForceChange(undefined)

        // create transaction
        const txBuilder = Cardano.TransactionBuilder.new(
          Cardano.LinearFee.new(
            Cardano.BigNum.from_str(protocolParams.linearFeeCoefficient),
            Cardano.BigNum.from_str(protocolParams.linearFeeConstant),
          ),
          Cardano.BigNum.from_str(protocolParams.minimumUtxoVal),
          Cardano.BigNum.from_str(protocolParams.poolDeposit),
          Cardano.BigNum.from_str(protocolParams.keyDeposit),
        )

        // set ttl
        txBuilder.set_ttl(currentSlot + settings.ttl)

        const hasCertificates = certificates.length > 0
        const hasWithdrawal = withdrawals.length > 0
        const hasMetadata = !(metadata == null)

        // add certificates
        if (hasCertificates) {
          const certsArray = certificates.reduce((certs, cert) => {
            certs.add(cert)
            return certs
          }, Cardano.Certificates.new())
          txBuilder.set_certs(certsArray)
        }

        // add withdrawal
        if (hasWithdrawal) {
          const processed = withdrawals.map((withdrawal) => {
            const address = Cardano.Address.from_bech32(withdrawal.address)
            return {
              address: Cardano.RewardAddress.from_address(address),
              amount: Cardano.BigNum.from_str(withdrawal.amount),
            }
          })

          const withdrawalArray = processed.reduce((withs, withdrawal) => {
            withs.insert(withdrawal.address, withdrawal.amount)
            return withs
          }, Cardano.Withdrawals.new())
          txBuilder.set_withdrawals(withdrawalArray)
        }

        // add metadata
        if (hasMetadata) {
          txBuilder.set_metadata(metadata)
        }

        // add outputs
        outputs.forEach((output) => {
          txBuilder.add_output(
            Cardano.TransactionOutput.new(
              Cardano.Address.from_bech32(output.address),
              Utils.cardanoValueFromTokens(output.value, output.tokens),
            ),
          )
        })

        // add inputs
        // output excluding fee
        const targetOutput = txBuilder
          .get_explicit_output()
          .checked_add(Cardano.Value.new(txBuilder.get_deposit()))
        // used utxos for build transaction
        const usedUtxos = []
        // recall: we might have some implicit input to start with from deposit refunds
        const implicitSum = txBuilder.get_implicit_input()
        const emptyAsset = Cardano.MultiAsset.new()

        // add utxos until we have enough to send the transaction
        // eslint-disable-next-line
        for (const utxo of utxos) {
          const currentInputSum = txBuilder.get_explicit_input().checked_add(implicitSum)
          const output = targetOutput.checked_add(Cardano.Value.new(txBuilder.min_fee()))
          const remainingNeeded = output.clamped_sub(currentInputSum)

          // update amount required to make sure we have ADA required for change UTXO entry
          if (
            shouldForceChange(currentInputSum.multiasset()?.sub(output.multiasset() ?? emptyAsset))
          ) {
            if (changeAddress == null) throw ErrorException('no_outputs')
            const difference = currentInputSum.clamped_sub(output)

            const minimumNeededForChange = Utils.minRequiredForChange(
              txBuilder,
              changeAddress,
              difference,
            )

            const adaNeededLeftForChange = minimumNeededForChange.clamped_sub(difference.coin())

            if (remainingNeeded.coin().compare(adaNeededLeftForChange) < 0) {
              remainingNeeded.set_coin(adaNeededLeftForChange)
            }
          }

          // stop if we've added all the assets we needed
          const remainingAssets = remainingNeeded.multiasset()

          if (
            remainingNeeded.coin().compare(Cardano.BigNum.from_str('0')) === 0 &&
            (remainingAssets == null || remainingAssets.len() === 0) &&
            usedUtxos.length > 0
          ) {
            break
          }

          // push utxo if needed
          const added = Utils.addUtxoInput(
            txBuilder,
            {
              value: remainingNeeded,
              hasInput: usedUtxos.length > 0,
            },
            utxo,
            true,
          )

          // eslint-disable-next-line
          if (added !== AddInputResult.VALID) continue

          usedUtxos.push(utxo)
        }

        if (usedUtxos.length === 0) {
          throw ErrorException('not_enough')
        }

        // check to see if we have enough balance in the wallet to cover the transaction
        const currentInputSum = txBuilder.get_explicit_input().checked_add(implicitSum)
        const output = targetOutput.checked_add(Cardano.Value.new(txBuilder.min_fee()))
        const compare = currentInputSum.compare(output)
        const enoughInput = compare != null && compare >= 0
        const forceChange = shouldForceChange(
          currentInputSum.multiasset()?.sub(output.multiasset() ?? emptyAsset),
        )
        if (forceChange) {
          if (changeAddress == null) throw ErrorException('no_outputs')
          if (!enoughInput) {
            throw ErrorException('not_enough')
          }
          const difference = currentInputSum.checked_sub(output)
          const minimumNeededForChange = Utils.minRequiredForChange(
            txBuilder,
            changeAddress,
            difference,
          )
          if (difference.coin().compare(minimumNeededForChange) < 0) {
            throw ErrorException('not_enough')
          }
        }
        if (!forceChange && !enoughInput) {
          throw ErrorException('not_enough')
        }

        // handle change address
        const change = (() => {
          const totalInput = txBuilder
            .get_explicit_input()
            .checked_add(txBuilder.get_implicit_input())
          const difference = totalInput.checked_sub(targetOutput)

          const calcForceChange = shouldForceChange(difference.multiasset() ?? emptyAsset)
          if (changeAddress == null) {
            if (calcForceChange) {
              throw ErrorException('no_outputs')
            }
            const minFee = txBuilder.min_fee()
            if (difference.coin().compare(minFee) < 0) {
              throw ErrorException('not_enough')
            }
            // recall: min fee assumes the largest fee possible
            // so no worries of cbor issue by including larger fee
            txBuilder.set_fee(Cardano.BigNum.from_str(difference.coin().to_str()))
            return []
          }
          const outputBeforeChange = txBuilder.get_explicit_output()

          const calcChangeAddress = Cardano.Address.from_bech32(changeAddress)
          const changeWasAdded = txBuilder.add_change_if_needed(calcChangeAddress)
          if (calcForceChange && !changeWasAdded) {
            // note: this should never happened since it should have been handled by earlier code
            throw ErrorException('no_change')
          }

          const changeAda = txBuilder
            .get_explicit_output()
            .checked_sub(outputBeforeChange)
            .coin()
            .to_str()
          const changeTokens = Utils.parseTokenList(
            txBuilder.get_explicit_output().checked_sub(outputBeforeChange).multiasset(),
          )

          return changeWasAdded
            ? [
                {
                  address: changeAddress,
                  value: changeAda,
                  tokens: changeTokens,
                },
              ]
            : []
        })()

        // tx build
        const txBody = txBuilder.build()
        const txHash = Cardano.hash_transaction(txBody)

        return {
          data: {
            // txBody,
            // txHash,
            txBody: Buffer.from(txBody.to_bytes()).toString('hex'),
            txHash: Buffer.from(txHash.to_bytes()).toString('hex'),
            minFee: txBuilder.min_fee().to_str(),
            fee: txBuilder.get_fee_if_set().to_str(),
            spending: {
              value: (
                parseInt(targetOutput.coin().to_str(), 10) +
                parseInt(txBuilder.get_fee_if_set().to_str(), 10)
              ).toString(),
              tokens: Utils.parseTokenList(targetOutput.multiasset()),
            },
            outputs,
            usedUtxos,
            change,
            metadata,
            certificates,
            withdrawals,
          },
        }
      } catch (error) {
        if (!error.type) {
          error.type = 'tx_build_error'
        }
        // console.log(error)
        errorHandler(error)
        return {
          error,
        }
      }
    }

    /**
     * Sign Transaction
     * @param {boolean} transaction build final transaction (not for calculation fees)
     * @param {string} privateKey to address
     * @return {object}
     */

    this.txSign = (transaction, privateKey) => {
      const { Cardano } = this

      try {
        const { txHash, txBody, metadata, usedUtxos, certificates, withdrawals } = transaction

        const vkeyWitnesses = Cardano.Vkeywitnesses.new()

        usedUtxos.forEach((utxo) => {
          const prvKey = Cardano.Bip32PrivateKey.from_bech32(privateKey)
            .derive(utxo.addressing.type)
            .derive(utxo.addressing.path)
            .to_raw_key()
          const vkeyWitness = Cardano.make_vkey_witness(txHash, prvKey)
          vkeyWitnesses.add(vkeyWitness)
        })

        if (certificates.length > 0 || withdrawals.length > 0) {
          const prvKey = Cardano.Bip32PrivateKey.from_bech32(privateKey)
            .derive(2)
            .derive(0)
            .to_raw_key()
          const stakeKeyVitness = Cardano.make_vkey_witness(txHash, prvKey)
          vkeyWitnesses.add(stakeKeyVitness)
        }

        const witnesses = Cardano.TransactionWitnessSet.new()
        witnesses.set_vkeys(vkeyWitnesses)
        const signedTxRaw = Cardano.Transaction.new(txBody, witnesses, metadata)

        const signedTx = Buffer.from(signedTxRaw.to_bytes()).toString('hex')

        return signedTx
      } catch (error) {
        errorHandler(error)
        return false
      }
    }

    /**
     * Generate Delegation Certificates
     * @param {string} publicKeyBech32 publick key
     * @param {boolean} hasStakingKey is staking key exist
     * @param {string} poolId pool id
     * @return {array} certificates array
     */

    this.generateDelegationCerts = (publicKeyBech32, hasStakingKey, poolId) => {
      const { Cardano } = this

      try {
        const publicKey = Cardano.Bip32PublicKey.from_bech32(publicKeyBech32)
        const stakeKey = publicKey
          .derive(2) // chimeric
          .derive(0)

        const certificates = []

        if (!hasStakingKey) {
          const registrationCertificate = Cardano.Certificate.new_stake_registration(
            Cardano.StakeRegistration.new(
              Cardano.StakeCredential.from_keyhash(stakeKey.to_raw_key().hash()),
            ),
          )
          certificates.push(registrationCertificate)
        }

        const delegationCertificate = Cardano.Certificate.new_stake_delegation(
          Cardano.StakeDelegation.new(
            Cardano.StakeCredential.from_keyhash(stakeKey.to_raw_key().hash()),
            Cardano.Ed25519KeyHash.from_bech32(poolId),
          ),
        )
        certificates.push(delegationCertificate)

        return certificates
      } catch (error) {
        errorHandler(error)
        return false
      }
    }

    return this
  })()
}

module.exports = Crypto
