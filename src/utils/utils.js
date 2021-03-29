export const stringToBinary = (input) => {
  const characters = input.split('')

  return characters
    .map((char) => {
      const binary = char.charCodeAt(0).toString(2)
      const pad = Math.max(8 - binary.length, 0)
      return '0'.repeat(pad) + binary
    })
    .join('')
}

export const binaryToString = (input) => {
  let bytesLeft = input
  let result = ''

  while (bytesLeft.length) {
    const byte = bytesLeft.substr(0, 8)
    bytesLeft = bytesLeft.substr(8)
    result += String.fromCharCode(parseInt(byte, 2))
  }

  return result
}
