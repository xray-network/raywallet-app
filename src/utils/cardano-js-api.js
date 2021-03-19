import { generateMnemonic, validateMnemonic, mnemonicToEntropy } from 'bip39-light'

class CardanoWasmModule {
  async load() {
    this.wasm = await import('@emurgo/cardano-serialization-lib-browser/cardano_serialization_lib');
  }

  get API() {
    return this.wasm;
  }
}

export const CardanoWasm = new CardanoWasmModule()

export const CardanoGenerateMnemonic = (length = 24) => {
  return generateMnemonic((32 * length) / 3)
}

export const CardanoValidateMnemonic = (mnemonicPhrase) => {
  try {
    return !!mnemonicPhrase && validateMnemonic(mnemonicPhrase)
  } catch (e) {
    return false
  }
}

export const CardanoGetAccountInfo = async (mnemonic) => {
  await CardanoWasm.load()

  const harden = (num) => {
    return 0x80000000 + num
  }
  const entropy = mnemonicToEntropy(mnemonic)
  const rootKey = CardanoWasm.API.Bip32PrivateKey.from_bip39_entropy(
    Buffer.from(entropy, 'hex'),
    Buffer.from(''),
  )

  const privateKey = rootKey
    .derive(harden(1852))
    .derive(harden(1815))
    .derive(harden(0))

  const stakeKey = privateKey
    .derive(2)
    .derive(0)
    .to_public()

  const privateKeyBech32 = privateKey.to_bech32()
  const publicKeyBech32 = privateKey.to_public().to_bech32()
  console.log('p', privateKey.to_public())
  const rewardAddressBech32 = CardanoWasm.API.RewardAddress.new(
    CardanoWasm.API.NetworkInfo.testnet().network_id(),
    CardanoWasm.API.StakeCredential.from_keyhash(stakeKey.to_raw_key().hash()),
  ).to_address().to_bech32()

  // console.log([rewardAddressBech32, privateKeyBech32, publicKeyBech32])
  return { rewardAddressBech32, privateKeyBech32, publicKeyBech32 }
}

// CardanoGetAccountInfo('simple nation hedgehog vapor helmet split plate tomato picture polar sure oak notice ramp scrub mechanic afford door furnace gate build drop manual silk')

export const CardanoGetAccountAdresses = async (publicKeyBech32, type = 0, shift = 0) => {
  await CardanoWasm.load()

  const publicKey = CardanoWasm.API.Bip32PublicKey.from_bech32(publicKeyBech32)
  const accountAdresses = []

  for (let i = 0 + 20 * shift; i < 20 + 20 * shift; i += 1) {
    const utxoPubKey = publicKey
      .derive(type) // external/iternal
      .derive(i)

    const stakeKey = publicKey
      .derive(2) // chimeric
      .derive(0)

    const baseAddr = CardanoWasm.API.BaseAddress.new(
      CardanoWasm.API.NetworkInfo.testnet().network_id(),
      CardanoWasm.API.StakeCredential.from_keyhash(utxoPubKey.to_raw_key().hash()),
      CardanoWasm.API.StakeCredential.from_keyhash(stakeKey.to_raw_key().hash()),
    ).to_address().to_bech32()

    accountAdresses.push(baseAddr)
  }

  // console.log(accountAdresses)
  return accountAdresses
}

// CardanoGetAccountAdresses('xpub1nyyqpaq3hgsqzzmw8hzz5qgjw3z22uypxn0z7afhucww4r2de6r576k36sufu06wz42l8s3f2pul5g9dq83hx8fn92usvdaerp8mjtqyusz8e', 0)