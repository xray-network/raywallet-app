/**
 * Copyright (c) 2021, Ray Network <hello@rraayy.com>
 * https://rraayy.com, https://raywallet.io
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

import { generateMnemonic, validateMnemonic, mnemonicToEntropy } from 'bip39-light'
import BigNumber from 'bignumber.js'

/**
 *  Protocol Params
 */

const protocolParams = {
  linearFeeCoefficient: '44',
  linearFeeConstant: '155381',
  minimumUtxoVal: '1000000',
  poolDeposit: '500000000',
  keyDeposit: '2000000',
  ttlOffset: 7200,
}

/**
 *  WASM lib loader
 */

class CardanoWasmModule {
  async load() {
    this.wasm = await import('@emurgo/cardano-serialization-lib-browser/cardano_serialization_lib')
  }

  get API() {
    return this.wasm
  }
}

export const CardanoWasm = new CardanoWasmModule()

/**
 * Errors
 */

export const CardanoError = (type) => {
  const messages = {
    ada_not_enough: 'Not enough ADA',
    ada_less_than_min: 'Minimum 1 ADA',
    ada_not_number: 'Wrong ADA value',
    ada_wrong_value: 'Wrong ADA value',
    address_wrong: 'Wrong address',
  }
  const error = new Error(messages[type] || 'An unspecified error has occurred')
  error.type = type || 'default'
  console.error(error)

  return error
}

/**
 * Mnemonic generation
 * @return {string}
 */

export const CardanoGenerateMnemonic = (length = 24) => {
  return generateMnemonic((32 * length) / 3)
}

/**
 * Mnemonic validation
 * @return {boolean}
 */

export const CardanoValidateMnemonic = (mnemonicPhrase) => {
  try {
    return !!mnemonicPhrase && validateMnemonic(mnemonicPhrase)
  } catch (e) {
    return false
  }
}

/**
 * Get private key, public key, reward address
 * @return {object}
 */

export const CardanoGetAccountInfo = async (network, mnemonic) => {
  await CardanoWasm.load()

  const harden = (num) => {
    return 0x80000000 + num
  }

  const entropy = mnemonicToEntropy(mnemonic)
  const rootKey = CardanoWasm.API.Bip32PrivateKey.from_bip39_entropy(
    Buffer.from(entropy, 'hex'),
    Buffer.from(''),
  )

  const privateKey = rootKey.derive(harden(1852)).derive(harden(1815)).derive(harden(0))
  const stakeKey = privateKey.derive(2).derive(0).to_public()

  const currentNetwork =
    network === 'testnet'
      ? CardanoWasm.API.NetworkInfo.testnet().network_id()
      : CardanoWasm.API.NetworkInfo.mainnet().network_id()

  const rewardAddress = CardanoWasm.API.RewardAddress.new(
    currentNetwork,
    CardanoWasm.API.StakeCredential.from_keyhash(stakeKey.to_raw_key().hash()),
  )
  const rewardAddressBech32 = rewardAddress.to_address().to_bech32()
  const privateKeyBech32 = privateKey.to_bech32()
  const publicKeyBech32 = privateKey.to_public().to_bech32()

  return { rewardAddressBech32, privateKeyBech32, publicKeyBech32 }
}

/**
 * Generate address pack related to Private Key
 * @param {string} publicKeyBech32 private key
 * @param {string} type external internal / all derives
 * @param {number} shift shifting addresses by page size
 * @param {number} page page size
 * @return {array} adresses array
 */

export const CardanoGetAccountAdresses = async (
  network,
  publicKeyBech32,
  type = 'external',
  shift = 0,
  page = 20,
) => {
  await CardanoWasm.load()

  const publicKey = CardanoWasm.API.Bip32PublicKey.from_bech32(publicKeyBech32)
  let accountAdresses = {}

  const currentNetwork =
    network === 'testnet'
      ? CardanoWasm.API.NetworkInfo.testnet().network_id()
      : CardanoWasm.API.NetworkInfo.mainnet().network_id()

  const generateAddresses = (addressType) => {
    const tmpAddresses = {}
    for (let i = 0 + page * shift; i < page + page * shift; i += 1) {
      const utxoPubKey = publicKey
        .derive(addressType) // 0 external / 1 internal
        .derive(i)
      const stakeKey = publicKey
        .derive(2) // chimeric
        .derive(0)
      const baseAddr = CardanoWasm.API.BaseAddress.new(
        currentNetwork,
        CardanoWasm.API.StakeCredential.from_keyhash(utxoPubKey.to_raw_key().hash()),
        CardanoWasm.API.StakeCredential.from_keyhash(stakeKey.to_raw_key().hash()),
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

  return accountAdresses
}

/**
 * Validate Shelley Address
 */

export const CardanoValidateAddress = async (address) => {
  await CardanoWasm.load()

  try {
    const shelleyAddress = CardanoWasm.API.Address.from_bech32(address)
    CardanoWasm.API.BaseAddress.from_address(shelleyAddress)
    return true
  } catch (e) {
    return false
  }
}

/**
 * Get transaction
 */

export const CardanoBuildTx = async (
  isSend,
  value,
  toAddress,
  changeAddress,
  currentSlot,
  utxos,
  metadata,
  certificates,
  withdrawals,
) => {
  await CardanoWasm.load()

  try {
    // initial checks
    if (isSend && !(await CardanoValidateAddress(toAddress))) {
      throw CardanoError('address_wrong')
    }
    if (isSend && new BigNumber(value).isNaN()) {
      throw CardanoError('ada_not_number')
    }
    if (isSend && new BigNumber(value).lt(new BigNumber(protocolParams.minimumUtxoVal))) {
      throw CardanoError('ada_less_than_min')
    }
    if (isSend && new BigNumber(value).decimalPlaces() > 6) {
      throw CardanoError('ada_wrong_value')
    }

    // create transaction
    const txBuilder = CardanoWasm.API.TransactionBuilder.new(
      CardanoWasm.API.LinearFee.new(
        CardanoWasm.API.BigNum.from_str(protocolParams.linearFeeCoefficient),
        CardanoWasm.API.BigNum.from_str(protocolParams.linearFeeConstant),
      ),
      CardanoWasm.API.BigNum.from_str(protocolParams.minimumUtxoVal),
      CardanoWasm.API.BigNum.from_str(protocolParams.poolDeposit),
      CardanoWasm.API.BigNum.from_str(protocolParams.keyDeposit),
    )

    // set ttl
    txBuilder.set_ttl(currentSlot + protocolParams.ttlOffset)

    // add outputs
    if (toAddress) {
      txBuilder.add_output(
        CardanoWasm.API.TransactionOutput.new(
          CardanoWasm.API.Address.from_bech32(toAddress),
          CardanoWasm.API.Value.new(
            CardanoWasm.API.BigNum.from_str(new BigNumber(value).toFixed()),
          ),
        ),
      )
    }

    const hasCertificates = certificates.length > 0
    const hasWithdrawal = withdrawals.length > 0

    // add certificates
    if (hasCertificates) {
      const certsArray = certificates.reduce((certs, cert) => {
        certs.add(cert)
        return certs
      }, CardanoWasm.API.Certificates.new())
      txBuilder.set_certs(certsArray)
    }

    // add withdrawal
    if (hasWithdrawal) {
      const processed = withdrawals.map((withdrawal) => {
        const address = CardanoWasm.API.Address.from_bech32(withdrawal.address)
        return {
          address: CardanoWasm.API.RewardAddress.from_address(address),
          amount: CardanoWasm.API.BigNum.from_str(withdrawal.amount),
        }
      })

      const withdrawalArray = processed.reduce((withs, withdrawal) => {
        withs.insert(withdrawal.address, withdrawal.amount)
        return withs
      }, CardanoWasm.API.Withdrawals.new())
      txBuilder.set_withdrawals(withdrawalArray)
    }

    // add inputs
    const usedUtxos = []
    const targetOutput = txBuilder
      .get_explicit_output()
      .checked_add(CardanoWasm.API.Value.new(txBuilder.get_deposit()))
    const implicitSum = txBuilder.get_implicit_input()
    let stopIterations = false

    utxos.forEach((tx) => {
      if (stopIterations) {
        return
      }
      const currentInputValue = txBuilder.get_explicit_input().checked_add(implicitSum)
      const currentInputValueRaw = txBuilder.get_explicit_input()
      const output = targetOutput.checked_add(CardanoWasm.API.Value.new(txBuilder.min_fee()))
      const remainingNeeded = output.clamped_sub(currentInputValue)

      let checkSkip = remainingNeeded.coin().compare(CardanoWasm.API.BigNum.from_str('0')) === 0
      if (hasWithdrawal) {
        const compare = currentInputValueRaw.compare(output)
        checkSkip = compare != null && compare >= 0
      }
      if (checkSkip) {
        stopIterations = true
        return
      }

      usedUtxos.push(tx)
      txBuilder.add_input(
        CardanoWasm.API.Address.from_bech32(tx.address),
        CardanoWasm.API.TransactionInput.new(
          CardanoWasm.API.TransactionHash.from_bytes(Buffer.from(tx.transaction.hash, 'hex')),
          tx.index,
        ),
        CardanoWasm.API.Value.new(CardanoWasm.API.BigNum.from_str(tx.value.toString())),
      )
    })

    // check if inputs values enough
    const currentInputValue = txBuilder.get_explicit_input().checked_add(implicitSum)
    const output = targetOutput.checked_add(CardanoWasm.API.Value.new(txBuilder.min_fee()))

    const compare = currentInputValue.compare(output)
    const isEnough = compare != null && compare >= 0

    if (!isEnough) {
      throw CardanoError('ada_not_enough')
    }

    // change address
    txBuilder.add_change_if_needed(CardanoWasm.API.Address.from_bech32(changeAddress))

    // tx build
    const txBody = txBuilder.build()
    const txHash = CardanoWasm.API.hash_transaction(txBody)

    return {
      txBody,
      txHash,
      minFee: new BigNumber(txBuilder.min_fee().to_str()),
      fee: new BigNumber(txBuilder.get_fee_if_set().to_str()),
      toAddress,
      value: new BigNumber(value).toFixed(),
      metadata,
      usedUtxos,
      certificates,
      withdrawals,
    }
  } catch (e) {
    console.log('ERROR', e)
    return e
  }
}

/**
 * Get delegation certificates
 */

export const CardanoGenerateDelegationCertificates = async (
  publicKeyBech32,
  hasStakingKey,
  poolId,
) => {
  const publicKey = CardanoWasm.API.Bip32PublicKey.from_bech32(publicKeyBech32)
  const stakeKey = publicKey
    .derive(2) // chimeric
    .derive(0)

  const certificates = []

  if (!hasStakingKey) {
    const registrationCertificate = CardanoWasm.API.Certificate.new_stake_registration(
      CardanoWasm.API.StakeRegistration.new(
        CardanoWasm.API.StakeCredential.from_keyhash(stakeKey.to_raw_key().hash()),
      ),
    )
    certificates.push(registrationCertificate)
  }

  const delegationCertificate = CardanoWasm.API.Certificate.new_stake_delegation(
    CardanoWasm.API.StakeDelegation.new(
      CardanoWasm.API.StakeCredential.from_keyhash(stakeKey.to_raw_key().hash()),
      CardanoWasm.API.Ed25519KeyHash.from_bech32(poolId),
    ),
  )
  certificates.push(delegationCertificate)

  return certificates
}

export const CardanoSignTx = async (transaction, privateKey) => {
  await CardanoWasm.load()

  const { txHash, txBody, metadata, usedUtxos, certificates, withdrawals } = transaction
  const vkeyWitnesses = CardanoWasm.API.Vkeywitnesses.new()
  usedUtxos.forEach((utxo) => {
    const prvKey = CardanoWasm.API.Bip32PrivateKey.from_bech32(privateKey)
      .derive(utxo.addressing.type)
      .derive(utxo.addressing.path)
      .to_raw_key()
    const vkeyWitness = CardanoWasm.API.make_vkey_witness(txHash, prvKey)
    vkeyWitnesses.add(vkeyWitness)
  })

  if (certificates.length > 0 || withdrawals.length > 0) {
    const prvKey = CardanoWasm.API.Bip32PrivateKey.from_bech32(privateKey)
      .derive(2)
      .derive(0)
      .to_raw_key()
    const stakeKeyVitness = CardanoWasm.API.make_vkey_witness(txHash, prvKey)
    vkeyWitnesses.add(stakeKeyVitness)
  }

  const witnesses = CardanoWasm.API.TransactionWitnessSet.new()
  witnesses.set_vkeys(vkeyWitnesses)
  const signedTxRaw = CardanoWasm.API.Transaction.new(txBody, witnesses, metadata)

  const signedTx = Buffer.from(signedTxRaw.to_bytes()).toString('hex')

  return signedTx
}
