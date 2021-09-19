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
import React from 'react'

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

export const truncate = (x, y = 8) => {
  return x ? `${x.substring(0, y)}...${x.slice(-y)}` : ''
}

export const format = (x, precision = 0) => {
  return precision
    ? parseInt(x, 10)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
        (parseFloat(x) - parseInt(x, 10)).toFixed(precision).toString().replace('0.', '.')
    : parseInt(x, 10)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const formatValue = (value, postfix = '') => {
  return (
    <span>
      {value || '—'}
      {value && postfix ? postfix : ''}
    </span>
  )
}
