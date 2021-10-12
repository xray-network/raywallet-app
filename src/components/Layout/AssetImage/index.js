import React from 'react'
import { useSelector } from 'react-redux'

const AssetImage = ({ fingerprint }) => {
  const verifiedTokensList = useSelector((state) => state.wallets.verifiedTokensList)
  const isVerified = verifiedTokensList.some((item) => item.fingerprint === fingerprint)

  return isVerified ? (
    <img
      src={`https://raw.githubusercontent.com/ray-network/cardano-verified/main/tokens/icon/${fingerprint}.png`}
      alt=""
    />
  ) : (
    <span>?</span>
  )
}

export default AssetImage
