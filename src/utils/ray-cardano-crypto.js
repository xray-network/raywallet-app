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
  const accountAdresses = []

  const currentNetwork =
    network === 'testnet'
      ? CardanoWasm.API.NetworkInfo.testnet().network_id()
      : CardanoWasm.API.NetworkInfo.mainnet().network_id()

  const generateAddresses = (addressType) => {
    const tmpAddresses = []
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
      tmpAddresses.push(baseAddrBech32)
    }
    return tmpAddresses
  }

  switch (type) {
    case 'external':
      accountAdresses.push(...generateAddresses(0))
      break
    case 'internal':
      accountAdresses.push(...generateAddresses(1))
      break
    case 'all':
      accountAdresses.push(...generateAddresses(0))
      accountAdresses.push(...generateAddresses(1))
      break
    default:
      break
  }

  return accountAdresses
}
