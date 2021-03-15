import { generateMnemonic, validateMnemonic } from 'bip39-light'

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
